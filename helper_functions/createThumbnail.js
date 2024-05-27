function createThumbnail(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    let thumbnail;

    if (validImageExtensions.includes(ext)) {
        thumbnail = `<img src="${file.fullPath.replace(/\\/g, '/')}" class="thumbnail" alt="${file.name}" />`;
    } else if (validVideoExtensions.includes(ext)) {
        thumbnail = `<video src="${file.fullPath.replace(/\\/g, '/')}" class="thumbnail" alt="${file.name}" controls></video>`;
    } else {
        thumbnail = `<div class="thumbnail">${file.name}</div>`;
    }

    return thumbnail;
}