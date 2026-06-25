import { t } from './i18n.js';

// Verifica si una URL de imagen es válida y funciona correctamente
export const isValidImageUrl = (url) => {
    return new Promise((resolve) => {
        if (!url || url.trim() === '') {
            resolve(false);
            return;
        }
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

// Comprueba que los campos del formulario de platillos estén correctos
export const validateDishForm = (data) => {
    let isValid = true;
    let errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push(t('dishModal.err.name') || 'Dish name is required.');
        isValid = false;
    }

    if (isNaN(data.price) || data.price < 0) {
        errors.push(t('dishModal.err.price') || 'Price must be a valid positive number.');
        isValid = false;
    }

    return { isValid, errors };
};
