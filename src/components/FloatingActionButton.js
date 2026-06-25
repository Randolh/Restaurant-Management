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
    btnIngredient.innerHTML = `<span>Añadir Ingrediente</span><i class="fa-solid fa-carrot"></i>`;
    btnIngredient.addEventListener('click', () => {
        container.classList.remove('active');
        emitEvent('openAddItemModal');
    });

    // Crear Platillo
    const btnDish = document.createElement('button');
    btnDish.className = 'fab-menu-item';
    btnDish.innerHTML = `<span>Crear Platillo</span><i class="fa-solid fa-utensils"></i>`;
    btnDish.addEventListener('click', () => {
        container.classList.remove('active');
        emitEvent('openAddDishModal');
    });

    // Nueva Orden
    const btnOrder = document.createElement('button');
    btnOrder.className = 'fab-menu-item';
    btnOrder.innerHTML = `<span>Nueva Orden</span><i class="fa-solid fa-receipt"></i>`;
    btnOrder.addEventListener('click', () => {
        container.classList.remove('active');
        emitEvent('openAddOrderModal');
    });

    menu.appendChild(btnIngredient);
    menu.appendChild(btnDish);
    menu.appendChild(btnOrder);

    const mainBtn = document.createElement('button');
    mainBtn.className = 'fab-main-btn';
    mainBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
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
