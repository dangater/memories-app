function displayFiles(files, dirPath) {
    fileListElement.innerHTML = '';

    files.forEach(file => {
        if (file.name.startsWith('._') || !file.name) {
            return;
        }

        const item = document.createElement('div');
        item.className = 'grid-item';

        if (file.isDirectory) {
            item.innerHTML = `
                <div class="folder-tile" onclick="loadDirectory('${file.fullPath.replace(/\\/g, '/')}')">
                    <div>${file.name}</div>
                </div>`;
        } else {
            const ext = file.name.split('.').pop().toLowerCase();
            if (validExtensions.includes(ext)) {
                const thumbnail = createThumbnail(file);
                item.innerHTML = `
                    <div class="media-tile" onclick="openModal('${file.fullPath.replace(/\\/g, '/')}', '${file.name}')">
                        ${thumbnail}
                    </div>`;
            }
        }

        fileListElement.appendChild(item);
    });
}