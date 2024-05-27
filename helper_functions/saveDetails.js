async function saveDetails() {
    const description = descriptionInput.value || ''; // Ensure it's a string
    const memory_date = memoryDateInput.value || null; // Set to null if empty
    const location = locationTagsInput.querySelector('input').dataset.tags || ''; // Ensure it's a string
    const people = peopleTagsInput.querySelector('input').dataset.tags || ''; // Ensure it's a string

    console.log('Saving details:', {
        description,
        memory_date,
        location,
        people,
        currentFileId,
        currentFileName
    });

    try {
        if (currentFileId) {
            console.log('Updating file details for ID:', currentFileId);
            await window.electronAPI.updateFileDetails(currentFileId, description, memory_date, location, people);
        } else {
            console.log('Creating file details for fileName:', currentFileName);
            currentFileId = await window.electronAPI.createFileDetails(currentFileName, description, memory_date, location, people); // Use currentFileName
        }

        // Show success message
        showToast('Saved successfully!');

        // Load comments if a new record was created
        if (currentFileId) {
            await loadComments(currentFileId);
        }

    } catch (error) {
        console.error('Error saving file details:', error);
    }
}