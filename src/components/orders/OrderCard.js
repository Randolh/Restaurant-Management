import { t } from '../../utils/i18n.js';
import showConfirm from '../ui/ConfirmModal.js';

const OrderCard = ({ order, btnKey, onAction, onCancel }) => {
    const formatTimeAgo = (timestamp) => {
        const diffMs = Date.now() - timestamp;
        const diffMins = Math.floor(diffMs / 60000);
        return t('orders.card.timeAgo').replace('{time}', diffMins);
    };

    const card = document.createElement('article');
    card.className = 'order-card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'order-header';
    
    const headerLeft = document.createElement('div');
    headerLeft.style.display = 'flex';
    headerLeft.style.alignItems = 'center';
    headerLeft.style.gap = '8px';

    const idSpan = document.createElement('span');
    idSpan.className = 'order-id';
    idSpan.textContent = `#${order.id}`;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'order-time';
    timeSpan.textContent = formatTimeAgo(order.createdAt);

    headerLeft.appendChild(idSpan);
    headerLeft.appendChild(timeSpan);
    cardHeader.appendChild(headerLeft);

    if (onCancel) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-icon danger';
        cancelBtn.title = t('orders.card.btn.cancel') || 'Cancel Order';
        cancelBtn.style.width = '24px';
        cancelBtn.style.height = '24px';
        const cancelIcon = document.createElement('i');
        cancelIcon.className = 'fa-solid fa-xmark';
        cancelBtn.appendChild(cancelIcon);

        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showConfirm(
                t('orders.card.confirmCancel') || 'Cancel this order and return ingredients to stock?',
                () => {
                    onCancel();
                }
            );
        });
        cardHeader.appendChild(cancelBtn);
    }

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
        const itemName = item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name;
        pill.appendChild(document.createTextNode(` ${itemName}`));
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
