import { emitEvent } from '../utils/events.js';
import { t } from '../utils/i18n.js';

export default function FloatingActionButton() {
    const container = document.createElement('div');
    container.className = 'fab-container';

    const menu = document.createElement('div');
    menu.className = 'fab-menu';

    // Añadir Ingrediente
    const btnIngredient = document.createElement('button');
    btnIngredient.className = 'fab-menu-item';
    const spanIng = document.createElement('span');
    spanIng.textContent = t('itemModal.title.add');
    const iconIng = document.createElement('i');
    iconIng.className = 'fa-solid fa-carrot';
    btnIngredient.appendChild(spanIng);
    btnIngredient.appendChild(iconIng);
    btnIngredient.addEventListener('click', () => {
        container.classList.remove('active');
        emitEvent('openAddItemModal');
    });

    // Crear Platillo
    const btnDish = document.createElement('button');
    btnDish.className = 'fab-menu-item';
    const spanDish = document.createElement('span');
    spanDish.textContent = t('dishes.btn.add');
    const iconDish = document.createElement('i');
    iconDish.className = 'fa-solid fa-utensils';
    btnDish.appendChild(spanDish);
    btnDish.appendChild(iconDish);
    btnDish.addEventListener('click', () => {
        container.classList.remove('active');
        emitEvent('openAddDishModal');
    });

    // Nueva Orden
    const btnOrder = document.createElement('button');
    btnOrder.className = 'fab-menu-item';
    const spanOrder = document.createElement('span');
    spanOrder.textContent = t('orders.btn.new');
    const iconOrder = document.createElement('i');
    iconOrder.className = 'fa-solid fa-receipt';
    btnOrder.appendChild(spanOrder);
    btnOrder.appendChild(iconOrder);
    btnOrder.addEventListener('click', () => {
        container.classList.remove('active');
        emitEvent('openAddOrderModal');
    });

    menu.appendChild(btnIngredient);
    menu.appendChild(btnDish);
    menu.appendChild(btnOrder);

    const mainBtn = document.createElement('button');
    mainBtn.className = 'fab-main-btn';
    const mainIcon = document.createElement('i');
    mainIcon.className = 'fa-solid fa-plus';
    mainBtn.appendChild(mainIcon);
    mainBtn.addEventListener('click', () => {
        container.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            container.classList.remove('active');
        }
    });

    container.appendChild(menu);
    container.appendChild(mainBtn);

    return container;
}
