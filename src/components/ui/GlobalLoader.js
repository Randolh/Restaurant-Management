import { t } from './../../utils/i18n.js';

export function showLoader(text) {
    if (!text) {
        text = t('loading') || 'Cargando...';
    }
    let loader = document.getElementById('global-fullscreen-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-fullscreen-loader';
        loader.className = 'global-loader';

        const spinner = document.createElement('div');
        spinner.className = 'custom-spinner';

        const span = document.createElement('span');
        span.id = 'global-loader-text';
        span.textContent = text;

        loader.appendChild(spinner);
        loader.appendChild(span);
        document.body.appendChild(loader);
    } else {
        document.getElementById('global-loader-text').textContent = text;
        loader.style.opacity = '1';
        loader.style.visibility = 'visible';
    }
}

export function hideLoader() {
    const loader = document.getElementById('global-fullscreen-loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 300);
    }
}
