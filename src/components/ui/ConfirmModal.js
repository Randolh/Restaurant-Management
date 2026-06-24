import { t } from '../../utils/i18n.js';

export default function showConfirm(message, onConfirm) {
    const wrapper = document.createElement('div');
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.className = 'modal-toggle';
    toggle.checked = true; // Open immediately
    wrapper.appendChild(toggle);

    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    modal.appendChild(overlay);
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.maxWidth = '400px';
    
    const mHeader = document.createElement('div');
    mHeader.className = 'modal-header';
    const h2 = document.createElement('h2');
    h2.textContent = t('modal.confirmTitle');
    mHeader.appendChild(h2);
    modalContainer.appendChild(mHeader);
    
    const mBody = document.createElement('div');
    mBody.className = 'modal-body';
    
    const text = document.createElement('p');
    text.textContent = message;
    text.style.margin = '0';
    text.style.whiteSpace = 'pre-wrap';
    text.style.color = 'var(--brand-surface-text)';
    mBody.appendChild(text);
    modalContainer.appendChild(mBody);
    
    const mFooter = document.createElement('div');
    mFooter.className = 'modal-footer';

    const closeAndCleanup = () => {
        toggle.checked = false;
        setTimeout(() => wrapper.remove(), 300); // Wait for CSS transition
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = t('btn.cancel');
    cancelBtn.addEventListener('click', closeAndCleanup);
    overlay.addEventListener('click', closeAndCleanup);
    
    mFooter.appendChild(cancelBtn);
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-danger';
    confirmBtn.textContent = t('btn.confirm');
    confirmBtn.addEventListener('click', () => {
        onConfirm();
        closeAndCleanup();
    });
    mFooter.appendChild(confirmBtn);
    
    modalContainer.appendChild(mFooter);
    modal.appendChild(modalContainer);
    wrapper.appendChild(modal);
    
    document.body.appendChild(wrapper);
}
