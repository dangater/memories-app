async function loadDirectory(dirPath) {
    console.log('Loading directory:', dirPath); // Debugging statement
    try {
        const files = await window.electronAPI.listFiles(dirPath);
        console.log('Files:', files); // Debugging statement
        currentDirectory = dirPath;
        displayBreadcrumb(dirPath);
        displayFiles(files, dirPath);

        // Fetch and display the folder description
        const folderName = getFolderName(dirPath);
        const folderDetails = await window.electronAPI.fetchFolderDetails(folderName);
        if (folderDetails) {
            document.getElementById('folderDescription').value = folderDetails.folder_description || '';
            document.getElementById('folderDescription').dataset.folderId = folderDetails.memory_folder_id;
        } else {
            document.getElementById('folderDescription').value = '';
            document.getElementById('folderDescription').dataset.folderId = '';
        }
    } catch (error) {
        console.error('Error listing files:', error);
    }
}

window.electronAPI.loadDirectory((_event, dirPath) => {
    console.log('Received load-directory event with path:', dirPath);
    loadDirectory(dirPath);
});

document.addEventListener('DOMContentLoaded', async () => {
    const rootDirectory = await window.electronAPI.selectRootDirectory();
    if (rootDirectory) {
        console.log('Selected root directory:', rootDirectory);
        loadDirectory(rootDirectory);
    }
});