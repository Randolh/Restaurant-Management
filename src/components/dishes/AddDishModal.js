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
    
    wrapper.innerHTML = `
        <input type="checkbox" id="add-dish-modal-toggle" class="modal-toggle" hidden>
        <div class="modal">
            <label for="add-dish-modal-toggle" class="modal-overlay"></label>
            <div class="modal-container" style="max-width: 800px;">
                <div class="modal-header">
                    <h2 id="add-dish-modal-title"></h2>
                    <label for="add-dish-modal-toggle" class="modal-close"><i class="fa-solid fa-xmark"></i></label>
                </div>
                <form id="add-dish-form" class="modal-body">
                    <!-- A. Information & Image -->
                    <div class="form-row" style="display: flex; gap: var(--stack-md); margin-bottom: var(--stack-md);">
                        <div class="form-col" style="flex: 1; display: flex; flex-direction: column; gap: var(--stack-sm);">
                            <div class="form-group">
                                <label class="form-label">${t('dishModal.name')}</label>
                                <input type="text" id="dish-name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${t('dishModal.image')}</label>
                                <input type="url" id="dish-image" class="form-control" placeholder="https://example.com/image.jpg">
                            </div>
                        </div>
                        <div id="dish-image-preview-box" class="image-preview-box" style="width: 120px; height: 120px; border-radius: var(--radius-md); background: var(--elevation-1-bg); display: flex; align-items: center; justify-content: center; overflow: hidden; border: var(--elevation-border);">
                            <i class="fa-regular fa-image" style="font-size: 32px; color: var(--color-text-variant);"></i>
                        </div>
                    </div>
                    
                    <hr class="form-divider" style="border: none; border-top: 1px solid var(--elevation-border-color); margin: var(--stack-md) 0;">
                    
                    <!-- B. Commercial Details -->
                    <div class="form-row" style="display: flex; gap: var(--stack-md); margin-bottom: var(--stack-md);">
                        <div class="form-col" style="flex: 1;">
                            <div class="form-group">
                                <label class="form-label">${t('dishModal.category')}</label>
                                <select id="dish-category" class="form-control" required>
                                    ${Object.entries(DISH_CATEGORIES).map(([cat, obj]) => `<option value="${cat}">${t(obj.labelKey) || cat}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-col" style="flex: 1;">
                            <div class="form-group">
                                <label class="form-label">${t('dishModal.price')}</label>
                                <input type="number" id="dish-price" class="form-control" min="0" step="0.01" required>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">${t('dishModal.desc')}</label>
                        <textarea id="dish-desc" class="form-control" rows="2"></textarea>
                    </div>

                    <div class="form-group" style="flex-direction: row; align-items: center; gap: 8px; margin-top: var(--stack-sm);">
                        <input type="checkbox" id="dish-available" checked>
                        <label for="dish-available" style="margin: 0;">${t('dishModal.available')}</label>
                    </div>

                    <hr class="form-divider" style="border: none; border-top: 1px solid var(--elevation-border-color); margin: var(--stack-md) 0;">

                    <!-- C. Recipe Builder -->
                    <h3 style="margin-bottom: 0px; font-size: var(--font-size-body-lg); color: var(--brand-surface-text);">${t('dishModal.ingredients')}</h3>
                    <div class="recipe-builder">
                        <div class="form-col" style="position: relative;">
                            <div class="recipe-search">
                                <input type="text" id="recipe-search-input" class="form-control" placeholder="${t('dishModal.ingredients.search')}">
                                <!-- Dropdown container -->
                                <div id="recipe-search-dropdown" class="search-results-dropdown" style="display: none;"></div>
                            </div>
                        </div>
                        <div class="form-col">
                            <div id="recipe-list-box" class="recipe-list-box">
                                <!-- Recipe items will be injected here -->
                            </div>
                        </div>
                    </div>
                </form>
                <div class="modal-footer">
                    <label for="add-dish-modal-toggle" class="btn-secondary">${t('btn.cancel')}</label>
                    <button type="submit" form="add-dish-form" class="btn-primary" id="add-dish-modal-save-btn"></button>
                </div>
            </div>
        </div>
    `;

    // Initialize logic after DOM string is parsed
    setTimeout(() => {
        const form = wrapper.querySelector('#add-dish-form');
        const saveBtn = wrapper.querySelector('#add-dish-modal-save-btn');
        const toggle = wrapper.querySelector('#add-dish-modal-toggle');
        const imageInput = wrapper.querySelector('#dish-image');
        const imagePreviewBox = wrapper.querySelector('#dish-image-preview-box');
        
        const searchInput = wrapper.querySelector('#recipe-search-input');
        const searchDropdown = wrapper.querySelector('#recipe-search-dropdown');
        const recipeListBox = wrapper.querySelector('#recipe-list-box');

        // Image Preview logic
        imageInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                imagePreviewBox.innerHTML = `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fa-solid fa-triangle-exclamation\\' style=\\'color: var(--color-warning); font-size: 32px;\\'></i>';">`;
            } else {
                imagePreviewBox.innerHTML = '<i class="fa-regular fa-image" style="font-size: 32px; color: var(--color-text-variant);"></i>';
            }
        });

        // --- Recipe Builder Logic ---
        
        const renderRecipeList = () => {
            recipeListBox.innerHTML = '';
            if (currentRecipe.length === 0) {
                recipeListBox.innerHTML = `<div style="text-align: center; color: var(--color-text-variant); padding: 20px 0;">${t('dishModal.ingredients.empty') || 'No ingredients added'}</div>`;
                return;
            }

            currentRecipe.forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'recipe-item';
                row.innerHTML = `
                    <div class="recipe-item-name">
                        <span>${item.name} <span class="stock-info">(${item.unit})</span></span>
                    </div>
                    <div class="recipe-item-actions">
                        <input type="number" class="form-control inline-qty" value="${item.qty}" min="0.01" step="0.01" data-index="${index}">
                        <button type="button" class="btn-icon btn-small danger btn-remove-ingredient" data-index="${index}" title="${t('btn.delete')}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                recipeListBox.appendChild(row);
            });

            // Listeners for quantity change
            recipeListBox.querySelectorAll('.inline-qty').forEach(input => {
                input.addEventListener('change', (e) => {
                    const idx = e.target.dataset.index;
                    currentRecipe[idx].qty = parseFloat(e.target.value) || 1;
                });
            });

            // Listeners for remove
            recipeListBox.querySelectorAll('.btn-remove-ingredient').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.dataset.index;
                    currentRecipe.splice(idx, 1);
                    renderRecipeList();
                });
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
                searchDropdown.innerHTML = `<div style="padding: 8px 12px; color: var(--color-text-variant); font-size: 13px;">No items found</div>`;
                searchDropdown.style.display = 'flex';
                return;
            }

            matches.forEach(item => {
                const el = document.createElement('div');
                el.className = 'search-result-item';
                el.innerHTML = `
                    <span>${item.name} <span class="stock-info">(${item.unit || 'unit'})</span></span>
                    <div class="search-result-actions">
                        <button type="button" class="btn-icon btn-add-ingredient" title="Add"><i class="fa-solid fa-plus"></i></button>
                    </div>
                `;
                
                el.querySelector('.btn-add-ingredient').addEventListener('click', () => {
                    // Check if already in recipe
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
                    searchInput.value = '';
                    searchDropdown.style.display = 'none';
                    renderRecipeList();
                });

                searchDropdown.appendChild(el);
            });
            
            searchDropdown.style.display = 'flex';
        };

        searchInput.addEventListener('input', (e) => {
            renderSearchDropdown(e.target.value.trim());
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.recipe-search')) {
                searchDropdown.style.display = 'none';
            }
        });

        // --- Form Submission ---
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('dish-name').value.trim();
            const category = document.getElementById('dish-category').value;
            const price = parseFloat(document.getElementById('dish-price').value);
            const image = document.getElementById('dish-image').value.trim();
            const description = document.getElementById('dish-desc').value.trim();
            const isAvailable = document.getElementById('dish-available').checked;
            
            const dishes = getLocal('dishesItems', true) || [];
            
            const editId = saveBtn.dataset.editId;
            
            if (editId) {
                // Edit existing
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
                // Add new
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
            imagePreviewBox.innerHTML = '<i class="fa-regular fa-image" style="font-size: 32px; color: var(--color-text-variant);"></i>';
        });

        // Expose open events logic to reset modal state
        onEvent('openAddDishModal', () => {
            document.getElementById('add-dish-modal-title').textContent = t('dishModal.title.add') || 'Add New Dish';
            saveBtn.textContent = t('dishes.btn.save') || 'Save Dish';
            saveBtn.dataset.editId = '';
            
            form.reset();
            imagePreviewBox.innerHTML = '<i class="fa-regular fa-image" style="font-size: 32px; color: var(--color-text-variant);"></i>';
            currentRecipe = [];
            allInventoryItems = getLocal('inventoryItems', true) || [];
            renderRecipeList();
        });

        onEvent('openEditDishModal', (e) => {
            const dish = e.detail.dish;
            document.getElementById('add-dish-modal-title').textContent = t('dishModal.title.edit') || 'Edit Dish';
            saveBtn.textContent = t('btn.saveChanges') || 'Save Changes';
            saveBtn.dataset.editId = dish.id;

            document.getElementById('dish-name').value = dish.name || '';
            document.getElementById('dish-category').value = dish.category ? dish.category.toLowerCase() : 'ramen';
            document.getElementById('dish-price').value = dish.price || '';
            document.getElementById('dish-image').value = dish.image || '';
            document.getElementById('dish-desc').value = dish.description || '';
            document.getElementById('dish-available').checked = dish.isAvailable !== undefined ? dish.isAvailable : true;

            currentRecipe = dish.recipe ? [...dish.recipe] : [];
            allInventoryItems = getLocal('inventoryItems', true) || [];
            
            // Trigger image preview
            const evt = new Event('input');
            imageInput.dispatchEvent(evt);
            
            renderRecipeList();
        });

    }, 0);

    return wrapper;
}
