function getFolderName(dirPath) {
    const parts = dirPath.split(/[\\/]/); // Handle both \ and / as separators
    return parts[parts.length - 1]; // Return the last part of the path as the folder name
}