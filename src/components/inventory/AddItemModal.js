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
        { label: 'Category', type: 'select', options: ['Vegetables', 'Meats', 'Dairy', 'Grains', 'Liquids'] },
        { label: 'Initial stock', type: 'number', placeholder: '100' },
        { label: 'Unit measure', type: 'select', options: ['kg', 'units', 'liters', 'portions', 'packs'] },
        { label: 'Unit Cost ($)', type: 'number', placeholder: '0.00', step: '0.01' }
    ];

    fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = field.label;
        group.appendChild(label);
        
        if (field.type === 'select') {
            const select = document.createElement('select');
            select.className = 'form-select';
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.textContent = opt;
                select.appendChild(option);
            });
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
