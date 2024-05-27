function displayBreadcrumb(dirPath) {
    const parts = dirPath.split(/[\\/]/); // Handle both \ and / as separators
    breadcrumbElement.innerHTML = parts.map((part, index) => {
        const pathToHere = parts.slice(0, index + 1).join('/');
        return `<button class="breadcrumb-button" onclick="loadDirectory('${pathToHere}')">${part}</button>`;
    }).join(' / ');
}