function showFullSizeImage() {
    const mediaElement = document.getElementById('mediaPreview').firstChild;
    const overlay = document.getElementById('imageOverlay');
    const fullSizeImage = document.getElementById('fullSizeImage');

    if (mediaElement.tagName === 'IMG') {
        fullSizeImage.src = mediaElement.src;
        overlay.classList.add('show');
    } else if (mediaElement.tagName === 'VIDEO') {
        // Handle video case if needed
        fullSizeImage.src = '';
    }
}