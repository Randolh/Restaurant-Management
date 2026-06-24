import { onEvent } from '../../utils/events.js';
import { getLocal } from '../../utils/storage.js';
import { t, formatCurrency } from '../../utils/i18n.js';
import { DISH_CATEGORIES } from '../../utils/constants.js';

export default function ViewDishModal() {
    const wrapper = document.createElement('div');
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'view-dish-modal-toggle';
    toggle.className = 'modal-toggle';
    toggle.style.display = 'none';
    wrapper.appendChild(toggle);

    const modal = document.createElement('div');
    modal.className = 'modal';

    const overlay = document.createElement('label');
    overlay.className = 'modal-overlay';
    overlay.htmlFor = 'view-dish-modal-toggle';
    modal.appendChild(overlay);

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.maxWidth = '500px';

    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const title = document.createElement('h2');
    title.id = 'view-dish-modal-title';
    title.textContent = t('viewDish.title') || 'Dish Details';
    
    const closeBtn = document.createElement('label');
    closeBtn.className = 'modal-close';
    closeBtn.htmlFor = 'view-dish-modal-toggle';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeBtn.appendChild(closeIcon);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContainer.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'modal-body view-dish-body';

    // Warning Banner
    const warningBanner = document.createElement('div');
    warningBanner.className = 'view-dish-warning';
    body.appendChild(warningBanner);

    // Image & basic info
    const infoSection = document.createElement('div');
    infoSection.className = 'view-dish-info';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'view-dish-img-container';
    
    const textInfo = document.createElement('div');
    textInfo.className = 'view-dish-text-info';

    const dishName = document.createElement('h3');
    dishName.className = 'view-dish-name';

    const dishPrice = document.createElement('div');
    dishPrice.className = 'view-dish-price';

    const dishStatus = document.createElement('div');
    
    const dishCategory = document.createElement('div');
    dishCategory.className = 'view-dish-category';

    const dishDesc = document.createElement('p');
    dishDesc.className = 'view-dish-desc';

    textInfo.appendChild(dishName);
    textInfo.appendChild(dishPrice);
    textInfo.appendChild(dishStatus);
    textInfo.appendChild(dishCategory);
    textInfo.appendChild(dishDesc);
    
    infoSection.appendChild(imgContainer);
    infoSection.appendChild(textInfo);
    
    body.appendChild(infoSection);

    // Ingredients Section
    const ingredientsSection = document.createElement('div');
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.className = 'view-dish-ingredients-title';
    ingredientsTitle.textContent = t('viewDish.ingredients') || 'Ingredients';
    ingredientsSection.appendChild(ingredientsTitle);

    const ingredientsList = document.createElement('div');
    ingredientsList.className = 'view-dish-ingredients';
    ingredientsSection.appendChild(ingredientsList);
    
    body.appendChild(ingredientsSection);
    modalContainer.appendChild(body);

    modal.appendChild(modalContainer);
    wrapper.appendChild(modal);

    // Update Data
    onEvent('openViewDishModal', (e) => {
        const dish = e.detail.dish;
        const inventoryItems = getLocal('inventoryItems', true) || [];
        
        dishName.textContent = dish.name;
        dishPrice.textContent = formatCurrency(dish.price || 0);
        dishDesc.textContent = dish.description || '';
        
        const catKey = dish.category ? dish.category.toLowerCase() : 'other';
        const catInfo = DISH_CATEGORIES[catKey];
        dishCategory.textContent = catInfo ? t(catInfo.labelKey) : dish.category;
        
        dishStatus.textContent = '';
        const badge = document.createElement('span');
        badge.className = dish.isAvailable ? 'dish-badge available' : 'dish-badge unavailable';
        badge.style.display = 'inline-block';
        badge.style.position = 'static';
        badge.textContent = dish.isAvailable ? t('dishes.kpi.available') : t('dishes.kpi.unavailable');
        dishStatus.appendChild(badge);
        
        imgContainer.textContent = '';
        if (dish.image) {
            const img = document.createElement('img');
            img.src = dish.image;
            img.className = 'view-dish-img';
            img.onerror = () => {
                imgContainer.textContent = '';
                const icon = document.createElement('i');
                icon.className = `fa-solid ${catInfo?.icon || 'fa-utensils'} fallback-icon view-dish-fallback-icon`;
                imgContainer.appendChild(icon);
            };
            imgContainer.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = `fa-solid ${catInfo?.icon || 'fa-utensils'} fallback-icon view-dish-fallback-icon`;
            imgContainer.appendChild(icon);
        }
        
        let hasDeletedIngredients = false;
        
        ingredientsList.textContent = '';
        let totalCost = 0;
        
        if (dish.recipe && dish.recipe.length > 0) {
            dish.recipe.forEach(recipeItem => {
                const invItem = inventoryItems.find(i => i.id === recipeItem.id);
                const itemDiv = document.createElement('div');
                itemDiv.className = 'view-dish-ingredient-item';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'view-dish-ingredient-name';
                if (!invItem || invItem.deleted) {
                    hasDeletedIngredients = true;
                    nameSpan.textContent = `[!] ${t('dishModal.ingredients.deleted')}`;
                    nameSpan.classList.add('text-warning');
                } else {
                    nameSpan.textContent = invItem.name;
                }
                
                const qtySpan = document.createElement('span');
                qtySpan.className = 'view-dish-ingredient-qty';
                qtySpan.textContent = `${recipeItem.qty} ${t('unit.' + recipeItem.unit) || recipeItem.unit}`;
                
                itemDiv.appendChild(nameSpan);
                itemDiv.appendChild(qtySpan);
                ingredientsList.appendChild(itemDiv);
            });
        } else {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'view-dish-empty';
            emptyMsg.textContent = t('dishModal.ingredients.empty') || 'No ingredients';
            ingredientsList.appendChild(emptyMsg);
        }
        
        if (hasDeletedIngredients) {
            warningBanner.style.display = 'flex';
            warningBanner.textContent = '';
            
            const warnIcon = document.createElement('i');
            warnIcon.className = 'fa-solid fa-triangle-exclamation';
            
            const warnText = document.createElement('span');
            warnText.textContent = t('dishes.warning.deletedIngredient') || 'Warning: Recipe contains deleted ingredients';
            
            warningBanner.appendChild(warnIcon);
            warningBanner.appendChild(warnText);
        } else {
            warningBanner.style.display = 'none';
        }
        
        toggle.checked = true;
    });

    return wrapper;
}
