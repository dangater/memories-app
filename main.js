const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const mysql = require('mysql2/promise'); // Ensure you have mysql2 installed

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-root-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('list-files', async (_event, dirPath) => {
  const fs = require('fs').promises;
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  return files.map(file => ({
    name: file.name,
    isDirectory: file.isDirectory(),
    fullPath: path.join(dirPath, file.name)
  }));
});

ipcMain.handle('fetch-file-details', async (_event, fileName) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'memories_user',
    password: 'IdahoRanchHouse24',
    database: 'memories_app_db'
  });

  const [rows] = await connection.execute('SELECT * FROM memory_files WHERE filename = ?', [fileName]);
  await connection.end();
  return rows.length > 0 ? rows[0] : null;
});

ipcMain.handle('create-file-details', async (_event, fileName, description, memory_date, location, people) => {
  console.log(fileName + "'" + description + "'" + memory_date + "'" +location + "'" +people )
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'memories_user',
    password: 'IdahoRanchHouse24',
    database: 'memories_app_db'
  });

  const [result] = await connection.execute(
    'INSERT INTO memory_files (filename, description, memory_date, location, people) VALUES (?, ?, ?, ?, ?)',
    [fileName, description, memory_date || null, location, people]
  );
  await connection.end();
  return result.insertId;
});

ipcMain.handle('update-file-details', async (_event, id, description, memory_date, location, people) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'memories_user',
    password: 'IdahoRanchHouse24',
    database: 'memories_app_db'
  });

  await connection.execute(
    'UPDATE memory_files SET description = ?, memory_date = ?, location = ?, people = ? WHERE memory_id = ?',
    [description, memory_date || null, location, people, id]
  );
  await connection.end();
});

ipcMain.handle('add-comment', async (_event, memory_id, person, comments) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'memories_user',
    password: 'IdahoRanchHouse24',
    database: 'memories_app_db'
  });

  const [result] = await connection.execute(
    'INSERT INTO memory_comments (memory_id, person, comments) VALUES (?, ?, ?)',
    [memory_id, person, comments]
  );
  await connection.end();
  return result.insertId;
});

ipcMain.handle('fetch-comments', async (_event, memory_id) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'memories_user',
    password: 'IdahoRanchHouse24',
    database: 'memories_app_db'
  });

  const [rows] = await connection.execute(
    `SELECT
      mf.memory_id,
      mf.file_location,
      mf.filename,
      mf.description,
      mf.memory_date,
      mf.location,
      mf.people,
      mc.memory_comment_id,
      mc.memory_id,
      mc.person,
      mc.comments,
      mc.comments_date
    FROM memory_files mf
    INNER JOIN memory_comments mc ON mf.memory_id = mc.memory_id
    WHERE mc.comment_visible = 'Y'
    AND mf.memory_id = ?
    ORDER BY mc.comments_date ASC
    `,
    [memory_id]
  );
  await connection.end();
  return rows;
});

ipcMain.handle('update-comment', async (_event, memory_comment_id, updatedComment) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'memories_user',
    password: 'IdahoRanchHouse24',
    database: 'memories_app_db'
  });

  await connection.execute(
    'UPDATE memory_comments SET comments = ? WHERE memory_comment_id = ?',
    [updatedComment, memory_comment_id]
  );
  await connection.end();
});

ipcMain.handle('delete-comment', async (_event, memory_comment_id) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'memories_user',
    password: 'IdahoRanchHouse24',
    database: 'memories_app_db'
  });

  await connection.execute(
    'UPDATE memory_comments SET comment_visible = "N" WHERE memory_comment_id = ?',
    [memory_comment_id]
  );
  await connection.end();
});

ipcMain.handle('fetch-folder-details', async (_event, folderName) => {
  const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'memories_user',
      password: 'IdahoRanchHouse24',
      database: 'memories_app_db'
  });

  const [rows] = await connection.execute('SELECT memory_folder_id, folder_name, folder_description FROM memory_folders WHERE folder_name = ?', [folderName]);
  await connection.end();
  return rows.length > 0 ? rows[0] : null;
});

ipcMain.handle('create-folder-description', async (_event, folderName, folderDescription) => {
  const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'memories_user',
      password: 'IdahoRanchHouse24',
      database: 'memories_app_db'
  });

  const [result] = await connection.execute(
      'INSERT INTO memory_folders (folder_name, folder_description) VALUES (?, ?)',
      [folderName, folderDescription || null]
  );
  await connection.end();
  return result.insertId;
});

ipcMain.handle('update-folder-description', async (_event, folderId, folderDescription) => {
  const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'memories_user',
      password: 'IdahoRanchHouse24',
      database: 'memories_app_db'
  });

  await connection.execute(
      'UPDATE memory_folders SET folder_description = ? WHERE memory_folder_id = ?',
      [folderDescription || null, folderId]
  );
  await connection.end();
});
