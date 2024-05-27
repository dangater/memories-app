const fs = require('fs');
const path = require('path');

// Function to list directories and files
const listFilesAndDirectories = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const result = files.map(file => {
        return {
          name: file.name,
          isDirectory: file.isDirectory(),
          fullPath: path.join(dirPath, file.name)
        };
      });

      resolve(result);
    });
  });
};

module.exports = {
  listFilesAndDirectories
};
