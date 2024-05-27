async function saveFolderDescription() {
    const folderDescriptionElement = document.getElementById('folderDescription');
    const folderDescription = folderDescriptionElement.value;
    const folderId = folderDescriptionElement.dataset.folderId;
    const folderName = getFolderName(currentDirectory);

    try {
        if (folderId) {
            await window.electronAPI.updateFolderDescription(folderId, folderDescription);
        } else {
            const newFolderId = await window.electronAPI.createFolderDescription(folderName, folderDescription);
            folderDescriptionElement.dataset.folderId = newFolderId;
        }

        showToast('Folder description saved successfully!');
    } catch (error) {
        console.error('Error saving folder description:', error);
    }
}