export default function FormError() {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.color = 'var(--brand-primary)';
    errorContainer.style.fontSize = 'var(--font-size-label-md)';
    errorContainer.style.marginBottom = 'var(--stack-sm)';
    errorContainer.style.padding = '8px 12px';
    errorContainer.style.backgroundColor = 'rgba(220, 20, 60, 0.1)';
    errorContainer.style.borderRadius = 'var(--radius-sm)';
    errorContainer.style.display = 'none';

    const show = (errors) => {
        if (!errors || errors.length === 0) {
            hide();
            return;
        }
        const errorList = Array.isArray(errors) ? errors : [errors];
        errorContainer.textContent = '';
        errorList.forEach((err, index) => {
            const span = document.createElement('span');
            span.textContent = err;
            errorContainer.appendChild(span);
            if (index < errorList.length - 1) {
                errorContainer.appendChild(document.createElement('br'));
            }
        });
        errorContainer.style.display = 'block';
    };

    const hide = () => {
        errorContainer.style.display = 'none';
        errorContainer.textContent = '';
    };

    return {
        element: errorContainer,
        show,
        hide
    };
}
