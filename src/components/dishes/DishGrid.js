import { emitEvent } from '../../utils/events.js';
import { t, formatCurrency } from '../../utils/i18n.js';
import { DISH_CATEGORIES } from '../../utils/constants.js';
import { getLocal } from '../../utils/storage.js';

export default function DishGrid(dishes) {
    const grid = document.createElement('div');
    grid.className = 'dishes-grid';
    
    const inventoryItems = getLocal('inventoryItems', true) || [];

    dishes.forEach(dish => {
        const card = document.createElement('article');
        card.className = 'dish-card';

        // Image Container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'dish-image-container';
        
        // Price
        const priceDiv = document.createElement('div');
        priceDiv.className = 'dish-price';
        priceDiv.textContent = formatCurrency(dish.price || 0);
        imgContainer.appendChild(priceDiv);

        if (dish.image) {
            const img = document.createElement('img');
            img.src = dish.image;
            img.className = 'dish-image';
            img.onerror = () => {
                const fallbackIcon = document.createElement('i');
                const catKey = dish.category ? dish.category.toLowerCase() : '';
                fallbackIcon.className = `fa-solid ${DISH_CATEGORIES[catKey]?.icon || 'fa-utensils'} fallback-icon`;
                imgContainer.appendChild(fallbackIcon);
                img.remove();
            };
            imgContainer.appendChild(img);
        } else {
            const fallbackIcon = document.createElement('i');
            const catKey = dish.category ? dish.category.toLowerCase() : '';
            fallbackIcon.className = `fa-solid ${DISH_CATEGORIES[catKey]?.icon || 'fa-utensils'} fallback-icon`;
            imgContainer.appendChild(fallbackIcon);
        }

        // Availability Badge
        const badge = document.createElement('div');
        if (dish.isAvailable) {
            badge.className = 'dish-badge available';
            badge.textContent = t('dishes.kpi.available');
        } else {
            badge.className = 'dish-badge unavailable';
            badge.textContent = t('dishes.kpi.unavailable');
        }
        imgContainer.appendChild(badge);

        // Missing or Deleted Ingredients Warning
        const hasDeletedIngredients = (dish.recipe || []).some(recipeItem => {
            const invItem = inventoryItems.find(i => i.id === recipeItem.id);
            return !invItem || invItem.deleted;
        });

        if (hasDeletedIngredients) {
            const warningBadge = document.createElement('div');
            warningBadge.className = 'dish-warning-badge';
            warningBadge.title = t('dishes.warning.deletedIngredient') || 'Warning: Recipe contains deleted ingredients';
            const warnIcon = document.createElement('i');
            warnIcon.className = 'fa-solid fa-triangle-exclamation';
            warningBadge.appendChild(warnIcon);
            imgContainer.appendChild(warningBadge);
        }

        // Content Container
        const content = document.createElement('div');
        content.className = 'dish-info';

        const title = document.createElement('h3');
        title.textContent = dish.name;

        const desc = document.createElement('p');
        desc.textContent = dish.description || '';
        
        content.appendChild(title);
        content.appendChild(desc);

        const footer = document.createElement('div');
        footer.className = 'dish-footer';
        footer.style.display = 'flex';
        footer.style.gap = '8px';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn-secondary';
        viewBtn.textContent = t('dishes.btn.view') || 'View';
        viewBtn.style.flex = '1';
        viewBtn.style.padding = '8px';
        viewBtn.style.fontSize = 'var(--font-size-body-sm)';
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            emitEvent('openViewDishModal', { dish });
        });

        const editDetailsBtn = document.createElement('button');
        editDetailsBtn.className = 'btn-primary';
        editDetailsBtn.textContent = t('dishes.btn.details') || 'Edit Details';
        editDetailsBtn.style.flex = '1';
        editDetailsBtn.style.padding = '8px';
        editDetailsBtn.style.fontSize = 'var(--font-size-body-sm)';
        editDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            emitEvent('openEditDishModal', { dish });
        });
        
        footer.appendChild(viewBtn);
        footer.appendChild(editDetailsBtn);

        // content.appendChild(category) was removed
        card.appendChild(imgContainer);
        card.appendChild(content);
        card.appendChild(footer);

        grid.appendChild(card);
    });

    return grid;
}
