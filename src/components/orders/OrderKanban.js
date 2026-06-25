import { t } from '../../utils/i18n.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent } from '../../utils/events.js';
import OrderCard from './OrderCard.js';

const OrderKanban = () => {
    const container = document.createElement('div');
    container.className = 'kanban-board-container'; // Wrapper for radios and board

    // Create radio inputs for mobile carousel
    const radios = [
        { id: 'view-pending', checked: true },
        { id: 'view-inprogress', checked: false },
        { id: 'view-ready', checked: false }
    ];

    radios.forEach(r => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'kanban-view';
        radio.id = r.id;
        radio.className = 'kanban-view-radio';
        radio.hidden = true;
        if (r.checked) radio.checked = true;
        container.appendChild(radio);
    });

    const board = document.createElement('div');
    board.className = 'kanban-board';

    const orders = getLocal('ordersItems', true) || [];

    const handleStatusChange = (orderId, newStatus) => {
        const currentOrders = getLocal('ordersItems', true) || [];
        const index = currentOrders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            currentOrders[index].status = newStatus;
            setLocal('ordersItems', currentOrders, true);
            emitEvent('ordersUpdated');
        }
    };

    const handleCancelOrder = (orderId) => {
        const currentOrders = getLocal('ordersItems', true) || [];
        const index = currentOrders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            const orderToCancel = currentOrders[index];
            orderToCancel.status = 'cancelled';
            
            // Return stock
            const inventoryItems = getLocal('inventoryItems', true) || [];
            const allDishes = getLocal('dishesItems', true) || [];
            let inventoryChanged = false;

            orderToCancel.items.forEach(item => {
                const dish = allDishes.find(d => d.id === item.dishId);
                if (dish && dish.recipe && dish.recipe.length > 0) {
                    dish.recipe.forEach(ing => {
                        const invItem = inventoryItems.find(i => i.id === ing.id);
                        if (invItem && !invItem.deleted) {
                            const returnedStock = parseFloat(invItem.stock) + (parseFloat(ing.qty) * item.qty);
                            invItem.stock = returnedStock.toString();
                            inventoryChanged = true;
                        }
                    });
                }
            });

            if (inventoryChanged) {
                setLocal('inventoryItems', inventoryItems, true);
                emitEvent('inventoryUpdated');
            }

            setLocal('ordersItems', currentOrders, true);
            emitEvent('ordersUpdated');
        }
    };

    const renderColumn = (status, titleKey, prevId, nextId, nextStatus, btnKey) => {
        const colOrders = orders.filter(o => o.status === status);
        
        const col = document.createElement('div');
        col.className = `kanban-column ${status === 'in-progress' ? 'in-progress' : status}`;

        const header = document.createElement('div');
        header.className = 'kanban-header';

        const prevLabel = document.createElement('label');
        prevLabel.htmlFor = prevId;
        prevLabel.className = 'carousel-nav prev';
        const prevIcon = document.createElement('i');
        prevIcon.className = 'fa-solid fa-chevron-left';
        prevLabel.appendChild(prevIcon);
        
        const nextLabel = document.createElement('label');
        nextLabel.htmlFor = nextId;
        nextLabel.className = 'carousel-nav next';
        const nextIcon = document.createElement('i');
        nextIcon.className = 'fa-solid fa-chevron-right';
        nextLabel.appendChild(nextIcon);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'header-title';
        
        const h2 = document.createElement('h2');
        h2.textContent = t(titleKey);
        
        const badge = document.createElement('span');
        badge.className = 'kanban-badge';
        badge.textContent = colOrders.length;

        titleDiv.appendChild(h2);
        titleDiv.appendChild(badge);

        header.appendChild(prevLabel);
        header.appendChild(titleDiv);
        header.appendChild(nextLabel);

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'kanban-cards';

        colOrders.forEach(order => {
            const card = OrderCard({
                order: order,
                btnKey: btnKey,
                onAction: () => handleStatusChange(order.id, nextStatus),
                onCancel: status === 'pending' ? () => handleCancelOrder(order.id) : null
            });
            cardsContainer.appendChild(card);
        });

        col.appendChild(header);
        col.appendChild(cardsContainer);

        return col;
    };

    board.appendChild(renderColumn('pending', 'orders.kanban.pending', 'view-ready', 'view-inprogress', 'in-progress', 'orders.card.btn.start'));
    board.appendChild(renderColumn('in-progress', 'orders.kanban.inProgress', 'view-pending', 'view-ready', 'ready', 'orders.card.btn.ready'));
    board.appendChild(renderColumn('ready', 'orders.kanban.ready', 'view-inprogress', 'view-pending', 'completed', 'orders.card.btn.complete'));

    container.appendChild(board);
    return container;
};

export default OrderKanban;
