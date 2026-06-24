import { t } from '../../utils/i18n.js';

const OrderCard = ({ order, btnKey, onAction }) => {
    const formatTimeAgo = (timestamp) => {
        const diffMs = Date.now() - timestamp;
        const diffMins = Math.floor(diffMs / 60000);
        return t('orders.card.timeAgo').replace('{time}', diffMins);
    };

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
        if (onAction) onAction();
    });

    card.appendChild(actionBtn);

    return card;
};

export default OrderCard;
