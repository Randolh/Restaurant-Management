import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent } from '../../utils/events.js';

export default function AddStockModal() {
    const wrapper = document.createElement('div');
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'add-stock-modal-toggle';
    toggle.className = 'modal-toggle';
    toggle.hidden = true;
    wrapper.appendChild(toggle);

    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const overlay = document.createElement('label');
    overlay.htmlFor = 'add-stock-modal-toggle';
    overlay.className = 'modal-overlay';
    modal.appendChild(overlay);
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    const mHeader = document.createElement('div');
    mHeader.className = 'modal-header';
    const h2 = document.createElement('h2');
    h2.id = 'add-stock-modal-title';
    h2.textContent = 'Add Stock';
    mHeader.appendChild(h2);
    modalContainer.appendChild(mHeader);
    
    const mBody = document.createElement('div');
    mBody.className = 'modal-body';
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.color = 'var(--brand-primary)';
    errorContainer.style.fontSize = 'var(--font-size-label-md)';
    errorContainer.style.marginBottom = 'var(--stack-sm)';
    errorContainer.style.padding = '8px 12px';
    errorContainer.style.backgroundColor = 'rgba(220, 20, 60, 0.1)';
    errorContainer.style.borderRadius = 'var(--radius-sm)';
    errorContainer.style.display = 'none';
    mBody.appendChild(errorContainer);
    
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = 'Quantity to Add';
    group.appendChild(label);

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'form-control';
    input.id = 'add-stock-amount';
    input.placeholder = 'e.g. 50';
    group.appendChild(input);
    
    mBody.appendChild(group);
    modalContainer.appendChild(mBody);
    
    const mFooter = document.createElement('div');
    mFooter.className = 'modal-footer';

    const resetForm = () => {
        input.value = '';
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
        addBtn.dataset.itemId = '';
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        resetForm();
        const toggle = document.getElementById('add-stock-modal-toggle');
        if (toggle) toggle.checked = false;
    });
    mFooter.appendChild(cancelBtn);
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-primary';
    addBtn.textContent = 'Accept';
    addBtn.id = 'add-stock-modal-save-btn';
    addBtn.addEventListener('click', () => {
        const amount = document.getElementById('add-stock-amount')?.value;
        const itemId = addBtn.dataset.itemId;
        
        let errors = [];
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            errors.push('• Quantity must be a valid number strictly greater than 0.');
        }
        
        if (errors.length > 0) {
            errorContainer.innerHTML = errors.join('<br>');
            errorContainer.style.display = 'block';
            return;
        }

        const existingItems = getLocal('inventoryItems', true) || [];
        const index = existingItems.findIndex(i => i.id == itemId);
        if (index !== -1) {
            const currentStock = Number(existingItems[index].stock || 0);
            existingItems[index].stock = currentStock + Number(amount);
            setLocal('inventoryItems', existingItems);
            
            resetForm();
            const toggle = document.getElementById('add-stock-modal-toggle');
            if (toggle) toggle.checked = false;
            
            emitEvent('inventoryUpdated');
        } else {
            errorContainer.innerHTML = '• Item not found.';
            errorContainer.style.display = 'block';
        }
    });
    mFooter.appendChild(addBtn);
    
    modalContainer.appendChild(mFooter);
    modal.appendChild(modalContainer);
    wrapper.appendChild(modal);
    
    return wrapper;
}
