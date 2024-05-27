async function openModal(filePath, fileName) {
    const ext = filePath.split('.').pop().toLowerCase();
    let content;

    if (validImageExtensions.includes(ext)) {
        content = `<img src="${filePath}" alt="Image Preview" />`;
    } else if (validVideoExtensions.includes(ext)) {
        content = `<video src="${filePath}" controls autoplay></video>`;
    } else {
        content = `<div>Unsupported file type</div>`;
    }

    mediaPreview.innerHTML = content;

    // Set the folder name
    const folderName = filePath.split(/[\\/]/).slice(0, -1).join('/');
    folderNameInput.value = folderName;

    currentFileName = fileName;  // Store the file name globally

    try {
        const fileDetails = await window.electronAPI.fetchFileDetails(fileName);
        console.log(fileDetails);
        if (fileDetails) {
            currentFileId = fileDetails.memory_id;
            descriptionInput.value = fileDetails.description || '';
            memoryDateInput.value = fileDetails.memory_date ? parseLocalDate(fileDetails.memory_date) : '';

            // Populate people tags
            peopleTagsInput.innerHTML = '<input type="text" id="peopleInput" placeholder="Add a person and press Enter">';
            peopleInput = document.getElementById('peopleInput');
            const people = fileDetails.people ? fileDetails.people.split(', ') : [];
            people.forEach(person => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = person + ' <span class="remove-tag" onclick="removeTag(this, updatePeopleInputValue)">×</span>';
                peopleTagsInput.insertBefore(tag, peopleInput);
            });
            // Reprocess the loaded people tags
            updatePeopleInputValue();

            // Populate location tags
            locationTagsInput.innerHTML = '<input type="text" id="locationInput" placeholder="Add a location and press Enter">';
            locationInput = document.getElementById('locationInput');
            const locations = fileDetails.location ? fileDetails.location.split(', ') : [];
            locations.forEach(location => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = location + ' <span class="remove-tag" onclick="removeTag(this, updateLocationInputValue)">×</span>';
                locationTagsInput.insertBefore(tag, locationInput);
            });
            // Reprocess the loaded location tags
            updateLocationInputValue();

            // Load comments
            await loadComments(currentFileId);
        } else {
            currentFileId = null;
            descriptionInput.value = '';
            memoryDateInput.value = '';
            peopleTagsInput.innerHTML = '<input type="text" id="peopleInput" placeholder="Add a person and press Enter">';
            peopleInput = document.getElementById('peopleInput');
            locationTagsInput.innerHTML = '<input type="text" id="locationInput" placeholder="Add a location and press Enter">';
            locationInput = document.getElementById('locationInput');
            displayComments([]); // Ensure the comment input fields are always displayed
        }
    } catch (error) {
        console.error('Error fetching file details:', error);
        currentFileId = null;
        descriptionInput.value = '';
        memoryDateInput.value = '';
        peopleTagsInput.innerHTML = '<input type="text" id="peopleInput" placeholder="Add a person and press Enter">';
        peopleInput = document.getElementById('peopleInput');
        locationTagsInput.innerHTML = '<input type="text" id="locationInput" placeholder="Add a location and press Enter">';
        locationInput = document.getElementById('locationInput');
        displayComments([]); // Ensure the comment input fields are always displayed
    }

    modal.style.display = 'flex';
}


function closeModal() {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
}

const peopleTagsInput = document.getElementById('peopleTagsInput');
        let peopleInput = document.getElementById('peopleInput');

        const locationTagsInput = document.getElementById('locationTagsInput');
        let locationInput = document.getElementById('locationInput');

        function updateTagsInputValue(input, wrapper) {
            const tags = wrapper.querySelectorAll('.tag');
            const values = Array.from(tags).map(tag => tag.textContent.replace('×', '').trim());
            input.dataset.tags = values.join(', ');
            console.log('Updated dataset tags:', input.dataset.tags); // Add logging
        }

        function updatePeopleInputValue() {
            updateTagsInputValue(peopleInput, peopleTagsInput);
        }

        function updateLocationInputValue() {
            updateTagsInputValue(locationInput, locationTagsInput);
        }


        function removeTag(element, updateFunction) {
            element.parentElement.remove();
            updateFunction();
        }