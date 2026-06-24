import { emitEvent } from '../../utils/events.js';
import { t, formatCurrency } from '../../utils/i18n.js';
import { DISH_CATEGORIES } from '../../utils/constants.js';

export default function DishGrid(dishes) {
    const grid = document.createElement('div');
    grid.className = 'dishes-grid';

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
                fallbackIcon.className = `fa-solid ${DISH_CATEGORIES[dish.category]?.icon || 'fa-utensils'} fallback-icon`;
                imgContainer.appendChild(fallbackIcon);
                img.remove();
            };
            imgContainer.appendChild(img);
        } else {
            const fallbackIcon = document.createElement('i');
            fallbackIcon.className = `fa-solid ${DISH_CATEGORIES[dish.category]?.icon || 'fa-utensils'} fallback-icon`;
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

        // Content Container
        const content = document.createElement('div');
        content.className = 'dish-info';

        const title = document.createElement('h3');
        title.textContent = dish.name;

        const desc = document.createElement('p');
        desc.textContent = dish.description || '';
        
        content.appendChild(title);
        content.appendChild(desc);

        // Footer (Actions)
        const footer = document.createElement('div');
        footer.className = 'dish-footer';

        const viewDetailsBtn = document.createElement('a');
        viewDetailsBtn.className = 'btn-details';
        viewDetailsBtn.innerHTML = t('dishes.btn.details') || 'View Details';
        viewDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            emitEvent('openEditDishModal', { dish });
        });
        
        footer.appendChild(viewDetailsBtn);

        // content.appendChild(category) was removed
        card.appendChild(imgContainer);
        card.appendChild(content);
        card.appendChild(footer);

        grid.appendChild(card);
    });

    return grid;
}
