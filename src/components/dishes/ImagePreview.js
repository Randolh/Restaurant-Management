export default function ImagePreview() {
    const imagePreviewBox = document.createElement('div');
    imagePreviewBox.id = 'dish-image-preview-box';
    imagePreviewBox.className = 'image-preview-box';
    
    const renderEmptyImage = () => {
        imagePreviewBox.textContent = '';
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-image image-preview-empty';
        imagePreviewBox.appendChild(icon);
    };
    
    const setPreviewUrl = (url) => {
        imagePreviewBox.textContent = '';
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.className = 'image-preview-img';
            img.onerror = () => {
                imagePreviewBox.textContent = '';
                const errIcon = document.createElement('i');
                errIcon.className = 'fa-solid fa-triangle-exclamation image-preview-error';
                imagePreviewBox.appendChild(errIcon);
            };
            imagePreviewBox.appendChild(img);
        } else {
            renderEmptyImage();
        }
    };

    // Initialize empty state
    renderEmptyImage();

    return {
        element: imagePreviewBox,
        setPreviewUrl,
        reset: renderEmptyImage
    };
}
