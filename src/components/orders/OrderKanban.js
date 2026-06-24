import { t } from '../../utils/i18n.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent } from '../../utils/events.js';

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

    const formatTimeAgo = (timestamp) => {
        const diffMs = Date.now() - timestamp;
        const diffMins = Math.floor(diffMs / 60000);
        return t('orders.card.timeAgo').replace('{time}', diffMins);
    };

    const handleStatusChange = (orderId, newStatus) => {
        const currentOrders = getLocal('ordersItems', true) || [];
        const index = currentOrders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            if (newStatus === 'completed') {
                // Remove from active orders (ideally move to history)
                currentOrders.splice(index, 1);
            } else {
                currentOrders[index].status = newStatus;
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
            const card = document.createElement('article');
            card.className = 'order-card';

            const cardHeader = document.createElement('div');
            cardHeader.className = 'order-header';
            
            const idSpan = document.createElement('span');
            idSpan.className = 'order-id';
            idSpan.textContent = `#${order.id}`;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'order-time';
            timeSpan.textContent = formatTimeAgo(order.createdAt);

            cardHeader.appendChild(idSpan);
            cardHeader.appendChild(timeSpan);
            card.appendChild(cardHeader);

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'order-items';

            order.items.forEach(item => {
                const pill = document.createElement('span');
                pill.className = 'item-pill';
                
                const qtySpan = document.createElement('span');
                qtySpan.className = 'item-qty';
                qtySpan.textContent = `${item.qty}x`;
                
                pill.appendChild(qtySpan);
                pill.appendChild(document.createTextNode(` ${item.name}`));
                itemsContainer.appendChild(pill);
            });

            card.appendChild(itemsContainer);

            const actionBtn = document.createElement('button');
            actionBtn.className = 'btn-kanban';
            actionBtn.textContent = t(btnKey);
            actionBtn.addEventListener('click', () => {
                handleStatusChange(order.id, nextStatus);
            });

            card.appendChild(actionBtn);
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
