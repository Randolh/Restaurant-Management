import { emitEvent, onEvent } from '../../utils/events.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { DISH_CATEGORIES } from '../../utils/constants.js';
import { t } from '../../utils/i18n.js';
import showToast from '../ui/Toast.js';

export default function AddDishModal() {
    const wrapper = document.createElement('div');
    
    // State for the Recipe Builder
    let currentRecipe = [];
    let allInventoryItems = [];
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'add-dish-modal-toggle';
    toggle.className = 'modal-toggle';
    toggle.hidden = true;
    wrapper.appendChild(toggle);

    const modal = document.createElement('div');
    modal.className = 'modal';

    const overlay = document.createElement('label');
    overlay.htmlFor = 'add-dish-modal-toggle';
    overlay.className = 'modal-overlay';
    modal.appendChild(overlay);

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.maxWidth = '800px';

    // Header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const titleEl = document.createElement('h2');
    titleEl.id = 'add-dish-modal-title';
    const closeLbl = document.createElement('label');
    closeLbl.htmlFor = 'add-dish-modal-toggle';
    closeLbl.className = 'modal-close';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeLbl.appendChild(closeIcon);
    modalHeader.appendChild(titleEl);
    modalHeader.appendChild(closeLbl);
    modalContainer.appendChild(modalHeader);

    // Form
    const form = document.createElement('form');
    form.id = 'add-dish-form';
    form.className = 'modal-body';

    // Row 1
    const formRow1 = document.createElement('div');
    formRow1.className = 'form-row';
    formRow1.style.display = 'flex';
    formRow1.style.gap = 'var(--stack-md)';
    formRow1.style.marginBottom = 'var(--stack-md)';

    const col1 = document.createElement('div');
    col1.className = 'form-col';
    col1.style.flex = '1';
    col1.style.display = 'flex';
    col1.style.flexDirection = 'column';
    col1.style.gap = 'var(--stack-sm)';

    const groupName = document.createElement('div');
    groupName.className = 'form-group';
    const labelName = document.createElement('label');
    labelName.className = 'form-label';
    labelName.textContent = t('dishModal.name');
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.id = 'dish-name';
    inputName.className = 'form-control';
    inputName.placeholder = t('dishModal.placeholder.name') || 'e.g. Tonkotsu Ramen';
    inputName.required = true;
    groupName.appendChild(labelName);
    groupName.appendChild(inputName);

    const groupImage = document.createElement('div');
    groupImage.className = 'form-group';
    const labelImage = document.createElement('label');
    labelImage.className = 'form-label';
    labelImage.textContent = t('dishModal.image');
    const inputImage = document.createElement('input');
    inputImage.type = 'url';
    inputImage.id = 'dish-image';
    inputImage.className = 'form-control';
    inputImage.placeholder = t('dishModal.placeholder.image') || 'https://www...';
    groupImage.appendChild(labelImage);
    groupImage.appendChild(inputImage);

    col1.appendChild(groupName);
    col1.appendChild(groupImage);

    const imagePreviewBox = document.createElement('div');
    imagePreviewBox.id = 'dish-image-preview-box';
    imagePreviewBox.className = 'image-preview-box';
    imagePreviewBox.style.width = '120px';
    imagePreviewBox.style.height = '120px';
    imagePreviewBox.style.borderRadius = 'var(--radius-md)';
    imagePreviewBox.style.background = 'var(--elevation-1-bg)';
    imagePreviewBox.style.display = 'flex';
    imagePreviewBox.style.alignItems = 'center';
    imagePreviewBox.style.justifyContent = 'center';
    imagePreviewBox.style.overflow = 'hidden';
    imagePreviewBox.style.border = 'var(--elevation-border)';
    
    const renderEmptyImage = () => {
        imagePreviewBox.innerHTML = '';
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-image';
        icon.style.fontSize = '32px';
        icon.style.color = 'var(--color-text-variant)';
        imagePreviewBox.appendChild(icon);
    };
    renderEmptyImage();

    inputImage.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        imagePreviewBox.innerHTML = '';
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.onerror = () => {
                imagePreviewBox.innerHTML = '';
                const errIcon = document.createElement('i');
                errIcon.className = 'fa-solid fa-triangle-exclamation';
                errIcon.style.color = 'var(--color-warning)';
                errIcon.style.fontSize = '32px';
                imagePreviewBox.appendChild(errIcon);
            };
            imagePreviewBox.appendChild(img);
        } else {
            renderEmptyImage();
        }
    });

    // Wrap image preview in a form-group to align with input
    const groupImagePreview = document.createElement('div');
    groupImagePreview.className = 'form-group';
    const emptyLabel = document.createElement('label');
    emptyLabel.className = 'form-label';
    emptyLabel.innerHTML = '&nbsp;';
    groupImagePreview.appendChild(emptyLabel);
    groupImagePreview.appendChild(imagePreviewBox);

    formRow1.appendChild(col1);
    formRow1.appendChild(groupImagePreview);
    form.appendChild(formRow1);

    const divider1 = document.createElement('hr');
    divider1.className = 'form-divider';
    divider1.style.border = 'none';
    divider1.style.borderTop = '1px solid var(--elevation-border-color)';
    divider1.style.margin = 'var(--stack-md) 0';
    form.appendChild(divider1);

    // Row 2
    const formRow2 = document.createElement('div');
    formRow2.className = 'form-row';
    formRow2.style.display = 'flex';
    formRow2.style.gap = 'var(--stack-md)';
    formRow2.style.marginBottom = 'var(--stack-md)';

    const colCat = document.createElement('div');
    colCat.className = 'form-col';
    colCat.style.flex = '1';
    const groupCat = document.createElement('div');
    groupCat.className = 'form-group';
    const labelCat = document.createElement('label');
    labelCat.className = 'form-label';
    labelCat.textContent = t('dishModal.category');
    const selectCat = document.createElement('select');
    selectCat.id = 'dish-category';
    selectCat.className = 'form-control';
    selectCat.required = true;
    Object.entries(DISH_CATEGORIES).forEach(([catKey, obj]) => {
        const opt = document.createElement('option');
        opt.value = catKey;
        opt.textContent = t(obj.labelKey) || catKey;
        selectCat.appendChild(opt);
    });
    groupCat.appendChild(labelCat);
    groupCat.appendChild(selectCat);
    colCat.appendChild(groupCat);

    const colPrice = document.createElement('div');
    colPrice.className = 'form-col';
    colPrice.style.flex = '1';
    const groupPrice = document.createElement('div');
    groupPrice.className = 'form-group';
    const labelPrice = document.createElement('label');
    labelPrice.className = 'form-label';
    labelPrice.textContent = t('dishModal.price');
    const inputPrice = document.createElement('input');
    inputPrice.type = 'number';
    inputPrice.id = 'dish-price';
    inputPrice.className = 'form-control';
    inputPrice.min = '0';
    inputPrice.step = '0.01';
    inputPrice.placeholder = t('dishModal.placeholder.price') || '10.00';
    inputPrice.required = true;
    groupPrice.appendChild(labelPrice);
    groupPrice.appendChild(inputPrice);
    colPrice.appendChild(groupPrice);

    formRow2.appendChild(colCat);
    formRow2.appendChild(colPrice);
    form.appendChild(formRow2);

    const groupDesc = document.createElement('div');
    groupDesc.className = 'form-group';
    const labelDesc = document.createElement('label');
    labelDesc.className = 'form-label';
    labelDesc.textContent = t('dishModal.desc');
    const inputDesc = document.createElement('textarea');
    inputDesc.id = 'dish-desc';
    inputDesc.className = 'form-control';
    inputDesc.rows = '2';
    inputDesc.placeholder = t('dishModal.placeholder.desc') || 'Describe the dish...';
    groupDesc.appendChild(labelDesc);
    groupDesc.appendChild(inputDesc);
    form.appendChild(groupDesc);

    const groupAvail = document.createElement('div');
    groupAvail.className = 'form-group';
    groupAvail.style.flexDirection = 'row';
    groupAvail.style.alignItems = 'center';
    groupAvail.style.gap = '8px';
    groupAvail.style.marginTop = 'var(--stack-sm)';
    const inputAvail = document.createElement('input');
    inputAvail.type = 'checkbox';
    inputAvail.id = 'dish-available';
    inputAvail.checked = true;
    const labelAvail = document.createElement('label');
    labelAvail.htmlFor = 'dish-available';
    labelAvail.style.margin = '0';
    labelAvail.textContent = t('dishModal.available');
    groupAvail.appendChild(inputAvail);
    groupAvail.appendChild(labelAvail);
    form.appendChild(groupAvail);

    const divider2 = document.createElement('hr');
    divider2.className = 'form-divider';
    divider2.style.border = 'none';
    divider2.style.borderTop = '1px solid var(--elevation-border-color)';
    divider2.style.margin = 'var(--stack-md) 0';
    form.appendChild(divider2);

    const recipeHeader = document.createElement('h3');
    recipeHeader.style.marginBottom = '0px';
    recipeHeader.style.fontSize = 'var(--font-size-body-lg)';
    recipeHeader.style.color = 'var(--brand-surface-text)';
    recipeHeader.textContent = t('dishModal.ingredients');
    form.appendChild(recipeHeader);

    const recipeBuilder = document.createElement('div');
    recipeBuilder.className = 'recipe-builder';

    const colSearch = document.createElement('div');
    colSearch.className = 'form-col';
    colSearch.style.position = 'relative';
    const recipeSearch = document.createElement('div');
    recipeSearch.className = 'recipe-search';
    const inputSearch = document.createElement('input');
    inputSearch.type = 'text';
    inputSearch.id = 'recipe-search-input';
    inputSearch.className = 'form-control';
    inputSearch.placeholder = t('dishModal.ingredients.search');
    
    const searchDropdown = document.createElement('div');
    searchDropdown.id = 'recipe-search-dropdown';
    searchDropdown.className = 'search-results-dropdown';
    searchDropdown.style.display = 'none';

    recipeSearch.appendChild(inputSearch);
    recipeSearch.appendChild(searchDropdown);
    colSearch.appendChild(recipeSearch);

    const colList = document.createElement('div');
    colList.className = 'form-col';
    const recipeListBox = document.createElement('div');
    recipeListBox.id = 'recipe-list-box';
    recipeListBox.className = 'recipe-list-box';
    colList.appendChild(recipeListBox);

    recipeBuilder.appendChild(colSearch);
    recipeBuilder.appendChild(colList);
    form.appendChild(recipeBuilder);
    
    modalContainer.appendChild(form);

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    const cancelLbl = document.createElement('label');
    cancelLbl.htmlFor = 'add-dish-modal-toggle';
    cancelLbl.className = 'btn-secondary';
    cancelLbl.textContent = t('btn.cancel');
    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.setAttribute('form', 'add-dish-form');
    saveBtn.className = 'btn-primary';
    saveBtn.id = 'add-dish-modal-save-btn';
    modalFooter.appendChild(cancelLbl);
    modalFooter.appendChild(saveBtn);
    modalContainer.appendChild(modalFooter);

    modal.appendChild(modalContainer);
    wrapper.appendChild(modal);

    // Logic Functions

    const renderRecipeList = () => {
        recipeListBox.innerHTML = '';
        if (currentRecipe.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.textAlign = 'center';
            emptyDiv.style.color = 'var(--color-text-variant)';
            emptyDiv.style.padding = '20px 0';
            emptyDiv.textContent = t('dishModal.ingredients.empty') || 'No ingredients added';
            recipeListBox.appendChild(emptyDiv);
            return;
        }

        currentRecipe.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'recipe-item';
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'recipe-item-name';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name + ' ';
            const stockSpan = document.createElement('span');
            stockSpan.className = 'stock-info';
            stockSpan.textContent = `(${item.unit})`;
            nameSpan.appendChild(stockSpan);
            nameDiv.appendChild(nameSpan);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'recipe-item-actions';
            
            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.className = 'form-control inline-qty';
            qtyInput.value = item.qty;
            qtyInput.min = '0.01';
            qtyInput.step = '0.01';
            qtyInput.dataset.index = index;
            qtyInput.addEventListener('change', (e) => {
                currentRecipe[index].qty = parseFloat(e.target.value) || 1;
            });

            const btnRemove = document.createElement('button');
            btnRemove.type = 'button';
            btnRemove.className = 'btn-icon btn-small danger btn-remove-ingredient';
            btnRemove.title = t('btn.delete');
            btnRemove.dataset.index = index;
            const iconRem = document.createElement('i');
            iconRem.className = 'fa-solid fa-trash';
            btnRemove.appendChild(iconRem);
            btnRemove.addEventListener('click', () => {
                currentRecipe.splice(index, 1);
                renderRecipeList();
            });

            actionsDiv.appendChild(qtyInput);
            actionsDiv.appendChild(btnRemove);

            row.appendChild(nameDiv);
            row.appendChild(actionsDiv);
            recipeListBox.appendChild(row);
        });
    };

    const renderSearchDropdown = (query) => {
        searchDropdown.innerHTML = '';
        if (!query) {
            searchDropdown.style.display = 'none';
            return;
        }

        const activeItems = allInventoryItems.filter(i => !i.deleted);
        const matches = activeItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

        if (matches.length === 0) {
            const noRes = document.createElement('div');
            noRes.style.padding = '8px 12px';
            noRes.style.color = 'var(--color-text-variant)';
            noRes.style.fontSize = '13px';
            noRes.textContent = 'No items found';
            searchDropdown.appendChild(noRes);
            searchDropdown.style.display = 'flex';
            return;
        }

        matches.forEach(item => {
            const el = document.createElement('div');
            el.className = 'search-result-item';
            
            const spanName = document.createElement('span');
            spanName.textContent = item.name + ' ';
            const spanUnit = document.createElement('span');
            spanUnit.className = 'stock-info';
            spanUnit.textContent = `(${item.unit || 'unit'})`;
            spanName.appendChild(spanUnit);
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'search-result-actions';
            const btnAdd = document.createElement('button');
            btnAdd.type = 'button';
            btnAdd.className = 'btn-icon btn-add-ingredient';
            btnAdd.title = 'Add';
            const iconAdd = document.createElement('i');
            iconAdd.className = 'fa-solid fa-plus';
            btnAdd.appendChild(iconAdd);
            
            btnAdd.addEventListener('click', () => {
                const existing = currentRecipe.find(r => r.id === item.id);
                if (existing) {
                    existing.qty += 1;
                } else {
                    currentRecipe.push({
                        id: item.id,
                        name: item.name,
                        unit: item.unit || 'unit',
                        qty: 1
                    });
                }
                inputSearch.value = '';
                searchDropdown.style.display = 'none';
                renderRecipeList();
            });
            
            actionsDiv.appendChild(btnAdd);
            el.appendChild(spanName);
            el.appendChild(actionsDiv);
            
            searchDropdown.appendChild(el);
        });
        
        searchDropdown.style.display = 'flex';
    };

    inputSearch.addEventListener('input', (e) => {
        renderSearchDropdown(e.target.value.trim());
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.recipe-search')) {
            searchDropdown.style.display = 'none';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = inputName.value.trim();
        const category = selectCat.value;
        const price = parseFloat(inputPrice.value);
        const image = inputImage.value.trim();
        const description = inputDesc.value.trim();
        const isAvailable = inputAvail.checked;
        
        const dishes = getLocal('dishesItems', true) || [];
        
        const editId = saveBtn.dataset.editId;
        
        if (editId) {
            const index = dishes.findIndex(d => d.id == editId);
            if (index !== -1) {
                dishes[index] = { 
                    ...dishes[index], 
                    name, category, price, image, description, isAvailable, 
                    recipe: [...currentRecipe],
                    lastUpdated: new Date().toISOString() 
                };
            }
        } else {
            dishes.push({
                id: Date.now().toString(),
                name,
                category,
                price,
                image,
                description,
                isAvailable,
                recipe: [...currentRecipe],
                createdAt: new Date().toISOString(),
                deleted: false
            });
        }
        
        setLocal('dishesItems', dishes, true);
        emitEvent('dishesUpdated');
        
        toggle.checked = false;
        form.reset();
        renderEmptyImage();
    });

    onEvent('openAddDishModal', () => {
        titleEl.textContent = t('dishModal.title.add') || 'Add New Dish';
        saveBtn.textContent = t('dishes.btn.save') || 'Save Dish';
        saveBtn.dataset.editId = '';
        
        form.reset();
        renderEmptyImage();
        currentRecipe = [];
        allInventoryItems = getLocal('inventoryItems', true) || [];
        renderRecipeList();
    });

    onEvent('openEditDishModal', (e) => {
        const dish = e.detail.dish;
        titleEl.textContent = t('dishModal.title.edit') || 'Edit Dish';
        saveBtn.textContent = t('btn.saveChanges') || 'Save Changes';
        saveBtn.dataset.editId = dish.id;

        inputName.value = dish.name || '';
        selectCat.value = dish.category ? dish.category.toLowerCase() : 'ramen';
        inputPrice.value = dish.price || '';
        inputImage.value = dish.image || '';
        inputDesc.value = dish.description || '';
        inputAvail.checked = dish.isAvailable !== undefined ? dish.isAvailable : true;

        currentRecipe = dish.recipe ? [...dish.recipe] : [];
        allInventoryItems = getLocal('inventoryItems', true) || [];
        
        const evt = new Event('input');
        inputImage.dispatchEvent(evt);
        
        renderRecipeList();
    });

    return wrapper;
}
