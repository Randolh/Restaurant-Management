import { INVENTORY_CATEGORIES, MEASUREMENT_UNITS } from '../../utils/constants.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent } from '../../utils/events.js';

export default function AddItemModal() {
    const wrapper = document.createElement('div');
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'add-item-modal-toggle';
    toggle.className = 'modal-toggle';
    toggle.hidden = true;
    wrapper.appendChild(toggle);

    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const overlay = document.createElement('label');
    overlay.htmlFor = 'add-item-modal-toggle';
    overlay.className = 'modal-overlay';
    modal.appendChild(overlay);
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    const mHeader = document.createElement('div');
    mHeader.className = 'modal-header';
    const h2 = document.createElement('h2');
    h2.id = 'add-item-modal-title';
    h2.textContent = 'Add Ingredient';
    mHeader.appendChild(h2);
    modalContainer.appendChild(mHeader);
    
    const mBody = document.createElement('div');
    mBody.className = 'modal-body';
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.color = 'var(--brand-primary)'; // Red color
    errorContainer.style.fontSize = 'var(--font-size-label-md)';
    errorContainer.style.marginBottom = 'var(--stack-sm)';
    errorContainer.style.padding = '8px 12px';
    errorContainer.style.backgroundColor = 'rgba(220, 20, 60, 0.1)';
    errorContainer.style.borderRadius = 'var(--radius-sm)';
    errorContainer.style.display = 'none';
    mBody.appendChild(errorContainer);
    
    const fields = [
        { id: 'item-name', label: 'Name', type: 'text', placeholder: 'e.g. Tomato' },
        { label: 'Category', type: 'select', options: Object.keys(INVENTORY_CATEGORIES) },
        { label: 'Unit measure', type: 'select', options: MEASUREMENT_UNITS },
        { id: 'item-stock', label: 'Initial stock', type: 'number', placeholder: '100' },
        { id: 'item-min-stock', label: 'Min Stock', type: 'number', placeholder: '50' },
        { id: 'item-cost', label: 'Unit Cost ($)', type: 'number', placeholder: '0.00', step: '0.01' }
    ];

    fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        
        if (field.label === 'Unit measure') {
            label.style.display = 'flex';
            label.style.justifyContent = 'space-between';
            label.style.alignItems = 'center';
            
            const span = document.createElement('span');
            span.textContent = field.label;
            label.appendChild(span);
            
            const defaultLabel = document.createElement('label');
            defaultLabel.style.display = 'flex';
            defaultLabel.style.alignItems = 'center';
            defaultLabel.style.gap = '4px';
            defaultLabel.style.fontWeight = 'normal';
            defaultLabel.style.fontSize = '12px';
            defaultLabel.style.cursor = 'pointer';
            
            const defaultCheckbox = document.createElement('input');
            defaultCheckbox.type = 'checkbox';
            defaultCheckbox.id = 'unit-default-checkbox';
            defaultCheckbox.checked = true;
            
            defaultCheckbox.addEventListener('change', (e) => {
                const unitSelect = document.getElementById('unit-select');
                const catSelect = document.getElementById('category-select');
                if (unitSelect && catSelect) {
                    unitSelect.disabled = e.target.checked;
                    if (e.target.checked && catSelect.value) {
                        unitSelect.value = INVENTORY_CATEGORIES[catSelect.value].defaultUnit;
                    }
                }
            });
            
            defaultLabel.appendChild(defaultCheckbox);
            defaultLabel.appendChild(document.createTextNode('Default'));
            label.appendChild(defaultLabel);
        } else {
            label.textContent = field.label;
        }
        
        group.appendChild(label);
        
        if (field.type === 'select') {
            const select = document.createElement('select');
            select.className = 'form-select';
            
            if (field.label === 'Category') {
                select.id = 'category-select';
                select.addEventListener('change', (e) => {
                    const unitSelect = document.getElementById('unit-select');
                    const defaultCheck = document.getElementById('unit-default-checkbox');
                    if (unitSelect && defaultCheck && defaultCheck.checked) {
                        unitSelect.value = INVENTORY_CATEGORIES[e.target.value].defaultUnit;
                    }
                });
            } else if (field.label === 'Unit measure') {
                select.id = 'unit-select';
                select.disabled = true; // default is true initially
            }

            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.textContent = opt;
                select.appendChild(option);
            });
            
            if (field.label === 'Unit measure') {
                setTimeout(() => {
                    const catSelect = document.getElementById('category-select');
                    if (catSelect && catSelect.value) {
                        select.value = INVENTORY_CATEGORIES[catSelect.value].defaultUnit;
                    }
                }, 0);
            }
            group.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.className = 'form-control';
            if (field.id) input.id = field.id;
            if (field.placeholder) input.placeholder = field.placeholder;
            if (field.step) input.step = field.step;
            
            if (field.id === 'item-min-stock') {
                input.value = '50';
            }

            group.appendChild(input);
        }
        mBody.appendChild(group);
    });
    modalContainer.appendChild(mBody);
    
    const mFooter = document.createElement('div');
    mFooter.className = 'modal-footer';

    const resetForm = () => {
        const nameInput = document.getElementById('item-name');
        if (nameInput) nameInput.value = '';
        
        const stockInput = document.getElementById('item-stock');
        if (stockInput) stockInput.value = '';
        
        const costInput = document.getElementById('item-cost');
        if (costInput) costInput.value = '';
        
        const catSelect = document.getElementById('category-select');
        if (catSelect) {
            catSelect.selectedIndex = 0;
        }
        
        const defaultCheck = document.getElementById('unit-default-checkbox');
        if (defaultCheck) {
            defaultCheck.checked = true;
            defaultCheck.dispatchEvent(new Event('change'));
        }
        
        const minStockInput = document.getElementById('item-min-stock');
        if (minStockInput) minStockInput.value = '50';
        
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
        
        const saveBtn = document.getElementById('add-item-modal-save-btn');
        if (saveBtn) {
            saveBtn.dataset.editId = '';
            saveBtn.textContent = 'Add Item';
        }
        const title = document.getElementById('add-item-modal-title');
        if (title) title.textContent = 'Add Ingredient';
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        resetForm();
        const toggle = document.getElementById('add-item-modal-toggle');
        if (toggle) toggle.checked = false;
    });
    mFooter.appendChild(cancelBtn);
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-primary';
    addBtn.textContent = 'Add Item';
    addBtn.id = 'add-item-modal-save-btn';
    addBtn.addEventListener('click', () => {
        const name = document.getElementById('item-name')?.value.trim();
        const category = document.getElementById('category-select')?.value;
        const unit = document.getElementById('unit-select')?.value;
        const stock = document.getElementById('item-stock')?.value;
        const minStock = document.getElementById('item-min-stock')?.value;
        const cost = document.getElementById('item-cost')?.value;
        
        let errors = [];
        
        if (!name) {
            errors.push('• Item name is required.');
        }
        
        if (!stock || isNaN(stock) || Number(stock) <= 0) {
            errors.push('• Initial stock must be a valid number strictly greater than 0.');
        }
        if (!minStock || isNaN(minStock) || Number(minStock) < 0) {
            errors.push('• Min stock must be a valid number greater than or equal to 0.');
        }
        if (!cost || isNaN(cost) || Number(cost) <= 0) {
            errors.push('• Unit Cost must be a valid number strictly greater than 0.');
        }
        
        if (errors.length > 0) {
            errorContainer.innerHTML = errors.join('<br>');
            errorContainer.style.display = 'block';
            return;
        }

        const existingItems = getLocal('inventoryItems', true) || [];
        const editId = addBtn.dataset.editId;
        
        if (editId) {
            const index = existingItems.findIndex(i => i.id == editId);
            if (index !== -1) {
                existingItems[index] = { ...existingItems[index], name, category, unit, stock, minStock, cost };
            }
        } else {
            const newItem = {
                id: Date.now(),
                name,
                category,
                unit,
                stock,
                minStock,
                cost
            };
            existingItems.push(newItem);
        }
        
        setLocal('inventoryItems', existingItems);
        
        resetForm();
        const toggle = document.getElementById('add-item-modal-toggle');
        if (toggle) toggle.checked = false;
        
        emitEvent('inventoryUpdated');
    });
    mFooter.appendChild(addBtn);
    
    modalContainer.appendChild(mFooter);

    modal.appendChild(modalContainer);
    wrapper.appendChild(modal);
    return wrapper;
}
