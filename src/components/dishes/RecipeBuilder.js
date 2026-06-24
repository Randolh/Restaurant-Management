import { t } from '../../utils/i18n.js';

export default function RecipeBuilder(onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'recipe-builder';

    let currentRecipe = [];
    let allInventoryItems = [];

    const colSearch = document.createElement('div');
    colSearch.className = 'form-col recipe-search-container';
    const recipeSearch = document.createElement('div');
    recipeSearch.className = 'recipe-search';
    const inputSearch = document.createElement('input');
    inputSearch.type = 'text';
    inputSearch.className = 'form-control';
    inputSearch.placeholder = t('dishModal.ingredients.search') || 'Search ingredients...';
    
    const searchDropdown = document.createElement('div');
    searchDropdown.className = 'search-results-dropdown';
    searchDropdown.style.display = 'none';

    recipeSearch.appendChild(inputSearch);
    recipeSearch.appendChild(searchDropdown);
    colSearch.appendChild(recipeSearch);

    const colList = document.createElement('div');
    colList.className = 'form-col';
    const recipeListBox = document.createElement('div');
    recipeListBox.className = 'recipe-list-box';
    colList.appendChild(recipeListBox);

    wrapper.appendChild(colSearch);
    wrapper.appendChild(colList);

    const renderRecipeList = () => {
        recipeListBox.innerHTML = '';
        if (currentRecipe.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'recipe-empty-state';
            emptyDiv.textContent = t('dishModal.ingredients.empty') || 'No ingredients added';
            recipeListBox.appendChild(emptyDiv);
            return;
        }

        currentRecipe.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'recipe-item';
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'recipe-item-name ingredient-name-container';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'ingredient-name-text';
            nameSpan.textContent = item.name;
            const stockSpan = document.createElement('span');
            stockSpan.className = 'stock-info';
            stockSpan.textContent = `(${t('unit.' + item.unit) || item.unit})`;
            
            // Check if ingredient is missing or deleted in inventory
            const invItem = allInventoryItems.find(i => i.id === item.id);
            if (!invItem || invItem.deleted) {
                nameSpan.classList.add('text-warning');
                const warnLbl = document.createElement('div');
                warnLbl.className = 'recipe-item-warning';
                warnLbl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${t('dishModal.ingredients.deleted') || 'Deleted from inventory'}`;
                
                const wrapperDiv = document.createElement('div');
                wrapperDiv.className = 'ingredient-name-container';
                wrapperDiv.style.flexDirection = 'column';
                wrapperDiv.style.alignItems = 'flex-start';
                
                const topRow = document.createElement('div');
                topRow.style.display = 'flex';
                topRow.style.gap = '4px';
                topRow.style.width = '100%';
                topRow.appendChild(nameSpan);
                topRow.appendChild(stockSpan);
                
                wrapperDiv.appendChild(topRow);
                wrapperDiv.appendChild(warnLbl);
                nameDiv.appendChild(wrapperDiv);
            } else {
                nameDiv.appendChild(nameSpan);
                nameDiv.appendChild(stockSpan);
            }

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'recipe-item-actions';
            
            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.className = 'form-control inline-qty';
            qtyInput.value = item.qty;
            qtyInput.min = '1';
            qtyInput.step = '1';
            qtyInput.dataset.index = index;
            qtyInput.addEventListener('change', (e) => {
                currentRecipe[index].qty = parseInt(e.target.value, 10) || 1;
                if (onChange) onChange();
            });

            const btnRemove = document.createElement('button');
            btnRemove.type = 'button';
            btnRemove.className = 'btn-icon btn-small danger btn-remove-ingredient';
            btnRemove.title = t('btn.delete');
            const iconRem = document.createElement('i');
            iconRem.className = 'fa-solid fa-trash';
            btnRemove.appendChild(iconRem);
            btnRemove.addEventListener('click', () => {
                currentRecipe.splice(index, 1);
                renderRecipeList();
                if (onChange) onChange();
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

        const activeItems = allInventoryItems.filter(i => !i.deleted && !currentRecipe.some(r => r.id === i.id));
        const matches = activeItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

        if (matches.length === 0) {
            const noRes = document.createElement('div');
            noRes.className = 'search-no-results';
            noRes.textContent = 'No items found';
            searchDropdown.appendChild(noRes);
            searchDropdown.style.display = 'flex';
            return;
        }

        matches.forEach(item => {
            const el = document.createElement('div');
            el.className = 'search-result-item';
            
            const nameContainer = document.createElement('div');
            nameContainer.className = 'ingredient-name-container';
            const spanName = document.createElement('span');
            spanName.className = 'ingredient-name-text';
            spanName.textContent = item.name;
            const spanUnit = document.createElement('span');
            spanUnit.className = 'stock-info';
            spanUnit.textContent = `(${t('unit.' + item.unit) || item.unit || 'unit'})`;
            nameContainer.appendChild(spanName);
            nameContainer.appendChild(spanUnit);
            
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
                currentRecipe.push({
                    id: item.id,
                    name: item.name,
                    unit: item.unit || 'unit',
                    qty: 1
                });
                inputSearch.value = '';
                searchDropdown.style.display = 'none';
                renderRecipeList();
                if (onChange) onChange();
            });
            
            actionsDiv.appendChild(btnAdd);
            el.appendChild(nameContainer);
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

    return {
        element: wrapper,
        setInventoryItems: (items) => { allInventoryItems = items || []; },
        setRecipe: (recipe) => { 
            currentRecipe = recipe ? [...recipe] : []; 
            renderRecipeList(); 
        },
        getRecipe: () => [...currentRecipe]
    };
}
