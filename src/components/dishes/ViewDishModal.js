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
    body.className = 'modal-body';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.gap = 'var(--stack-md)';
    body.style.overflowY = 'auto';
    body.style.maxHeight = '70vh';

    // Warning Banner
    const warningBanner = document.createElement('div');
    warningBanner.style.display = 'none';
    warningBanner.style.backgroundColor = 'rgba(220, 20, 60, 0.1)';
    warningBanner.style.color = 'var(--brand-primary)';
    warningBanner.style.padding = '8px 12px';
    warningBanner.style.borderRadius = 'var(--radius-sm)';
    warningBanner.style.fontSize = 'var(--font-size-body-sm)';
    warningBanner.style.alignItems = 'center';
    warningBanner.style.gap = '8px';
    body.appendChild(warningBanner);

    // Image & basic info
    const infoSection = document.createElement('div');
    infoSection.className = 'view-dish-info';
    infoSection.style.display = 'flex';
    infoSection.style.gap = 'var(--stack-md)';
    infoSection.style.alignItems = 'flex-start';

    const imgContainer = document.createElement('div');
    imgContainer.style.width = '120px';
    imgContainer.style.height = '120px';
    imgContainer.style.borderRadius = 'var(--radius-md)';
    imgContainer.style.overflow = 'hidden';
    imgContainer.style.backgroundColor = 'var(--elevation-2-bg)';
    imgContainer.style.display = 'flex';
    imgContainer.style.alignItems = 'center';
    imgContainer.style.justifyContent = 'center';
    imgContainer.style.flexShrink = '0';
    imgContainer.style.position = 'relative';
    
    const textInfo = document.createElement('div');
    textInfo.style.flex = '1';
    textInfo.style.minWidth = '0';
    textInfo.style.display = 'flex';
    textInfo.style.flexDirection = 'column';
    textInfo.style.gap = '8px';

    const dishName = document.createElement('h3');
    dishName.style.margin = '0';
    dishName.style.color = 'var(--brand-surface-text)';
    dishName.style.fontSize = 'var(--font-size-headline-md)';

    const dishPrice = document.createElement('div');
    dishPrice.style.fontSize = 'var(--font-size-headline-sm)';
    dishPrice.style.fontWeight = '700';
    dishPrice.style.color = 'var(--brand-primary)';

    const dishStatus = document.createElement('div');
    const dishCategory = document.createElement('div');
    dishCategory.style.color = 'var(--color-text-variant)';
    dishCategory.style.fontSize = 'var(--font-size-body-sm)';

    const dishDesc = document.createElement('p');
    dishDesc.style.margin = '0';
    dishDesc.style.color = 'var(--color-text-variant)';
    dishDesc.style.fontSize = 'var(--font-size-body-md)';
    dishDesc.style.wordBreak = 'break-word';

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
    ingredientsTitle.style.margin = '0 0 12px 0';
    ingredientsTitle.style.fontSize = 'var(--font-size-body-lg)';
    ingredientsTitle.style.color = 'var(--brand-surface-text)';
    ingredientsTitle.textContent = t('viewDish.ingredients') || 'Ingredients';
    ingredientsSection.appendChild(ingredientsTitle);

    const ingredientsList = document.createElement('div');
    ingredientsList.className = 'view-dish-ingredients';
    ingredientsList.style.display = 'flex';
    ingredientsList.style.flexDirection = 'column';
    ingredientsList.style.gap = '8px';
    ingredientsList.style.backgroundColor = 'var(--elevation-1-bg)';
    ingredientsList.style.padding = 'var(--stack-md)';
    ingredientsList.style.borderRadius = 'var(--radius-md)';
    ingredientsList.style.border = 'var(--elevation-border)';
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
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.onerror = () => {
                imgContainer.textContent = '';
                const icon = document.createElement('i');
                icon.className = `fa-solid ${catInfo?.icon || 'fa-utensils'} fallback-icon`;
                icon.style.fontSize = '48px';
                icon.style.color = 'var(--color-text-variant)';
                icon.style.margin = '0';
                imgContainer.appendChild(icon);
            };
            imgContainer.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = `fa-solid ${catInfo?.icon || 'fa-utensils'} fallback-icon`;
            icon.style.fontSize = '48px';
            icon.style.color = 'var(--color-text-variant)';
            icon.style.margin = '0';
            imgContainer.appendChild(icon);
        }
        
        let hasDeletedIngredients = false;
        
        ingredientsList.textContent = '';
        let totalCost = 0;
        
        if (dish.recipe && dish.recipe.length > 0) {
            dish.recipe.forEach(recipeItem => {
                const invItem = inventoryItems.find(i => i.id === recipeItem.id);
                const itemDiv = document.createElement('div');
                itemDiv.style.display = 'flex';
                itemDiv.style.justifyContent = 'space-between';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.fontSize = 'var(--font-size-body-md)';
                
                const nameSpan = document.createElement('span');
                nameSpan.style.color = 'var(--brand-surface-text)';
                if (!invItem || invItem.deleted) {
                    hasDeletedIngredients = true;
                    nameSpan.textContent = `[!] ${t('dishModal.ingredients.deleted')}`;
                    nameSpan.style.color = 'var(--brand-primary)';
                } else {
                    nameSpan.textContent = invItem.name;
                }
                
                const qtySpan = document.createElement('span');
                qtySpan.style.color = 'var(--color-text-variant)';
                qtySpan.textContent = `${recipeItem.qty} ${t('unit.' + recipeItem.unit) || recipeItem.unit}`;
                
                itemDiv.appendChild(nameSpan);
                itemDiv.appendChild(qtySpan);
                ingredientsList.appendChild(itemDiv);
            });
        } else {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.color = 'var(--color-text-variant)';
            emptyMsg.style.fontStyle = 'italic';
            emptyMsg.textContent = t('dishModal.ingredients.empty') || 'No ingredients';
            ingredientsList.appendChild(emptyMsg);
        }
        
        if (hasDeletedIngredients) {
            warningBanner.style.display = 'flex';
            warningBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${t('dishes.warning.deletedIngredient') || 'Warning: Recipe contains deleted ingredients'}</span>`;
        } else {
            warningBanner.style.display = 'none';
        }
        
        toggle.checked = true;
    });

    return wrapper;
}
