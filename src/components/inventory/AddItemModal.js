import { INVENTORY_CATEGORIES, MEASUREMENT_UNITS } from '../../utils/constants.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent } from '../../utils/events.js';
import { t, getCurrencySymbol } from '../../utils/i18n.js';

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
    h2.textContent = t('itemModal.title.add');
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
        { id: 'item-name', label: t('itemModal.label.name'), type: 'text', placeholder: t('itemModal.placeholder.name') },
        { label: t('itemModal.label.category'), type: 'select', options: Object.keys(INVENTORY_CATEGORIES) },
        { label: t('itemModal.label.unit'), type: 'select', options: MEASUREMENT_UNITS },
        { id: 'item-stock', label: t('itemModal.label.stock'), type: 'number', placeholder: '100' },
        { id: 'item-min-stock', label: t('itemModal.label.minStock'), type: 'number', placeholder: '50' },
        { id: 'item-cost', label: t('itemModal.label.cost', { currency: getCurrencySymbol() }), type: 'number', placeholder: '0.00', step: '0.01' }
    ];

    fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        
        if (field.label === t('itemModal.label.unit')) {
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
            
            const defaultCheck = document.createElement('input');
            defaultCheck.type = 'checkbox';
            defaultCheck.id = 'unit-default-checkbox';
            defaultCheck.checked = true;
            
            defaultCheck.addEventListener('change', (e) => {
                const unitSelect = document.getElementById('unit-select');
                const catSelect = document.getElementById('category-select');
                if (unitSelect && catSelect) {
                    unitSelect.disabled = e.target.checked;
                    if (e.target.checked && catSelect.value) {
                        unitSelect.value = INVENTORY_CATEGORIES[catSelect.value].defaultUnit;
                    }
                }
            });
            
            defaultLabel.appendChild(defaultCheck);
            defaultLabel.appendChild(document.createTextNode(' ' + t('itemModal.label.autoUnit')));
            label.appendChild(defaultLabel);
        } else {
            label.textContent = field.label;
        }
        
        group.appendChild(label);
        
        if (field.type === 'select') {
            const select = document.createElement('select');
            select.className = 'form-control';
            
            if (field.label === t('itemModal.label.category')) {
                select.id = 'category-select';
                select.addEventListener('change', (e) => {
                    const unitSelect = document.getElementById('unit-select');
                    const defaultCheck = document.getElementById('unit-default-checkbox');
                    if (unitSelect && defaultCheck && defaultCheck.checked) {
                        unitSelect.value = INVENTORY_CATEGORIES[e.target.value].defaultUnit;
                    }
                });
            } else if (field.label === t('itemModal.label.unit')) {
                select.id = 'unit-select';
                select.disabled = true; // default is true initially
            }

            field.options.forEach(opt => {
                const option = document.createElement('option');
                if (field.label === t('itemModal.label.category')) {
                    option.textContent = t('cat.' + opt);
                } else if (field.label === t('itemModal.label.unit')) {
                    option.textContent = t('unit.' + opt);
                } else {
                    option.textContent = opt;
                }
                option.value = opt;
                select.appendChild(option);
            });
            
            if (field.label === t('itemModal.label.unit')) {
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
            saveBtn.textContent = t('btn.add');
        }
        const title = document.getElementById('add-item-modal-title');
        if (title) title.textContent = t('itemModal.title.add');
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-outline';
    cancelBtn.textContent = t('btn.cancel');
    cancelBtn.addEventListener('click', () => {
        resetForm();
        const toggle = document.getElementById('add-item-modal-toggle');
        if (toggle) toggle.checked = false;
    });
    mFooter.appendChild(cancelBtn);
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-primary';
    addBtn.id = 'add-item-modal-save-btn';
    addBtn.textContent = t('btn.add');
    addBtn.addEventListener('click', () => {
        const name = document.getElementById('item-name')?.value.trim();
        const category = document.getElementById('category-select')?.value;
        const unit = document.getElementById('unit-select')?.value;
        const stock = document.getElementById('item-stock')?.value;
        const minStock = document.getElementById('item-min-stock')?.value;
        const cost = document.getElementById('item-cost')?.value;
        
        let errors = [];
        
        if (!name) {
            errors.push(t('itemModal.err.name'));
        }
        
        if (!stock || isNaN(stock) || Number(stock) <= 0) {
            errors.push(t('itemModal.err.stock'));
        }
        if (!minStock || isNaN(minStock) || Number(minStock) < 0) {
            errors.push(t('itemModal.err.minStock'));
        }
        if (!cost || isNaN(cost) || Number(cost) <= 0) {
            errors.push(t('itemModal.err.cost'));
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
