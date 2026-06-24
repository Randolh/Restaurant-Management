import { INVENTORY_CATEGORIES, MEASUREMENT_UNITS } from '../../utils/constants.js';

export default function AddItemModal() {
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
    h2.textContent = 'Add Ingredient';
    mHeader.appendChild(h2);
    modalContainer.appendChild(mHeader);
    
    const mBody = document.createElement('div');
    mBody.className = 'modal-body';
    
    const fields = [
        { label: 'Name', type: 'text', placeholder: 'e.g. Tomato' },
        { label: 'Category', type: 'select', options: Object.keys(INVENTORY_CATEGORIES) },
        { label: 'Unit measure', type: 'select', options: MEASUREMENT_UNITS },
        { label: 'Initial stock', type: 'number', placeholder: '100' },
        { label: 'Unit Cost ($)', type: 'number', placeholder: '0.00', step: '0.01' }
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
            if (field.placeholder) input.placeholder = field.placeholder;
            if (field.step) input.step = field.step;
            group.appendChild(input);
        }
        mBody.appendChild(group);
    });
    modalContainer.appendChild(mBody);
    
    const mFooter = document.createElement('div');
    mFooter.className = 'modal-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        const toggle = document.getElementById('add-item-modal-toggle');
        if (toggle) toggle.checked = false;
    });
    mFooter.appendChild(cancelBtn);
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-primary';
    addBtn.textContent = 'Add Item';
    mFooter.appendChild(addBtn);
    
    modalContainer.appendChild(mFooter);

    modal.appendChild(modalContainer);
    return modal;
}
