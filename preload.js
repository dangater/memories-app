const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    listFiles: (dirPath) => ipcRenderer.invoke('list-files', dirPath),
    fetchFileDetails: (fileName) => ipcRenderer.invoke('fetch-file-details', fileName),
    createFileDetails: (fileName, description, memory_date, location, people) => ipcRenderer.invoke('create-file-details', fileName, description, memory_date, location, people),
    updateFileDetails: (id, description, memory_date, location, people) => ipcRenderer.invoke('update-file-details', id, description, memory_date, location, people),
    fetchFolderDetails: (folderName) => ipcRenderer.invoke('fetch-folder-details', folderName),
    createFolderDescription: (folderName, folderDescription) => ipcRenderer.invoke('create-folder-description', folderName, folderDescription),
    updateFolderDescription: (folderId, folderDescription) => ipcRenderer.invoke('update-folder-description', folderId, folderDescription),
    /* selectRootDirectory: () => ipcRenderer.invoke('select-root-directory'), */
    selectRootDirectory: () => {
        return 'x:\\pictures';
      },
    loadDirectory: (dirPath) => ipcRenderer.invoke('load-directory', dirPath),
    addComment: (memory_id, person, comments) => ipcRenderer.invoke('add-comment', memory_id, person, comments), // Expose addComment
    fetchComments: (memory_id) => ipcRenderer.invoke('fetch-comments', memory_id) // Expose fetchComments
});