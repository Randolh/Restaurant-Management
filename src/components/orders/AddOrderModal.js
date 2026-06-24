import { t } from '../../utils/i18n.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent, onEvent } from '../../utils/events.js';

const AddOrderModal = () => {
    const container = document.createElement('div');
    container.className = 'modal';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'add-order-modal-toggle';
    checkbox.className = 'modal-toggle';
    checkbox.hidden = true;
    container.appendChild(checkbox);

    const overlay = document.createElement('label');
    overlay.htmlFor = 'add-order-modal-toggle';
    overlay.className = 'modal-overlay';
    container.appendChild(overlay);

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.maxWidth = '1000px';
    modalContainer.style.padding = '0';

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.style.borderBottom = 'none';
    const h2 = document.createElement('h2');
    h2.textContent = t('orders.modal.title');
    header.appendChild(h2);
    modalContainer.appendChild(header);

    const body = document.createElement('div');
    body.className = 'modal-body';
    body.style.padding = '0';
    body.style.paddingTop = '0';

    const posLayout = document.createElement('div');
    posLayout.className = 'pos-layout';

    // State
    let cart = [];
    let searchQuery = '';
    const allDishes = getLocal('dishesItems', true) || [];
    
    // UI Elements that need re-rendering
    const dishGrid = document.createElement('div');
    dishGrid.className = 'dish-select-grid';
    const ticketItemsContainer = document.createElement('div');
    ticketItemsContainer.className = 'ticket-items';
    const subtotalEl = document.createElement('span');
    const taxEl = document.createElement('span');
    const totalEl = document.createElement('span');
    
    const customerInput = document.createElement('input');
    const phoneInput = document.createElement('input');

    const renderDishGrid = () => {
        dishGrid.replaceChildren();
        const filtered = allDishes.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        filtered.forEach(dish => {
            const card = document.createElement('div');
            card.className = 'dish-select-card';
            
            const inCart = cart.some(item => item.dishId === dish.id);
            if (inCart) card.classList.add('selected');

            const img = document.createElement('img');
            img.src = dish.image || './images/dish_ramen.png';
            img.alt = dish.name;
            
            const info = document.createElement('div');
            info.className = 'dish-select-info';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'dish-select-name';
            nameSpan.textContent = dish.name;
            
            const bottomDiv = document.createElement('div');
            bottomDiv.className = 'dish-select-bottom';
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'dish-select-price';
            priceSpan.textContent = `$${parseFloat(dish.price).toFixed(2)}`;
            
            const addBtn = document.createElement('button');
            addBtn.className = 'btn-icon btn-small btn-circle';
            addBtn.title = 'Add';
            addBtn.style.backgroundColor = 'var(--elevation-2-bg)';
            
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-plus';
            addBtn.appendChild(icon);
            
            addBtn.addEventListener('click', () => {
                const existing = cart.find(item => item.dishId === dish.id);
                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({
                        dishId: dish.id,
                        name: dish.name,
                        price: parseFloat(dish.price),
                        qty: 1
                    });
                }
                renderTicket();
                renderDishGrid(); // To update selection state
            });

            bottomDiv.appendChild(priceSpan);
            bottomDiv.appendChild(addBtn);
            info.appendChild(nameSpan);
            info.appendChild(bottomDiv);
            card.appendChild(img);
            card.appendChild(info);
            
            dishGrid.appendChild(card);
        });
    };

    const renderTicket = () => {
        ticketItemsContainer.replaceChildren();
        
        if (cart.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.padding = '16px';
            emptyMsg.style.color = 'var(--text-secondary)';
            emptyMsg.textContent = t('orders.modal.emptyTicket');
            ticketItemsContainer.appendChild(emptyMsg);
            
            subtotalEl.textContent = '$0.00';
            taxEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const row = document.createElement('div');
            row.className = 'recipe-item';
            row.style.backgroundColor = 'transparent';
            row.style.padding = '0';

            const nameCol = document.createElement('div');
            nameCol.className = 'recipe-item-name';
            nameCol.style.flexDirection = 'column';
            nameCol.style.alignItems = 'flex-start';
            nameCol.style.gap = '2px';

            const nameText = document.createElement('span');
            nameText.style.fontWeight = '600';
            nameText.textContent = item.name;

            const priceText = document.createElement('span');
            priceText.className = 'stock-info';
            priceText.style.margin = '0';
            priceText.textContent = `$${item.price.toFixed(2)}`;

            nameCol.appendChild(nameText);
            nameCol.appendChild(priceText);

            const actionsCol = document.createElement('div');
            actionsCol.className = 'recipe-item-actions';

            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.className = 'form-control inline-qty';
            qtyInput.value = item.qty;
            qtyInput.min = 1;
            qtyInput.addEventListener('change', (e) => {
                const val = parseInt(e.target.value, 10);
                if (val > 0) {
                    item.qty = val;
                } else {
                    item.qty = 1;
                }
                renderTicket();
            });

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-icon btn-small danger';
            removeBtn.title = 'Remove';
            const trashIcon = document.createElement('i');
            trashIcon.className = 'fa-solid fa-trash';
            removeBtn.appendChild(trashIcon);
            
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                renderTicket();
                renderDishGrid(); // Update selection state
            });

            actionsCol.appendChild(qtyInput);
            actionsCol.appendChild(removeBtn);

            row.appendChild(nameCol);
            row.appendChild(actionsCol);
            ticketItemsContainer.appendChild(row);
        });

        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    };

    // --- Left Panel ---
    const leftPanel = document.createElement('div');
    leftPanel.style.padding = 'var(--stack-lg)';
    leftPanel.style.paddingTop = '0';

    const formRow = document.createElement('div');
    formRow.className = 'form-row';
    formRow.style.marginBottom = 'var(--stack-lg)';

    const colName = document.createElement('div');
    colName.className = 'form-col';
    const labelName = document.createElement('label');
    labelName.className = 'form-label';
    labelName.textContent = t('orders.modal.customer');
    customerInput.type = 'text';
    customerInput.className = 'form-control';
    customerInput.placeholder = t('orders.modal.optional');
    colName.appendChild(labelName);
    colName.appendChild(customerInput);

    const colPhone = document.createElement('div');
    colPhone.className = 'form-col';
    const labelPhone = document.createElement('label');
    labelPhone.className = 'form-label';
    labelPhone.textContent = t('orders.modal.phone');
    phoneInput.type = 'tel';
    phoneInput.className = 'form-control';
    phoneInput.placeholder = t('orders.modal.optional');
    colPhone.appendChild(labelPhone);
    colPhone.appendChild(phoneInput);

    formRow.appendChild(colName);
    formRow.appendChild(colPhone);

    const searchWrap = document.createElement('div');
    searchWrap.className = 'recipe-search';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control';
    searchInput.placeholder = t('orders.modal.search');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderDishGrid();
    });
    
    const searchBtn = document.createElement('button');
    searchBtn.className = 'btn-primary';
    searchBtn.style.padding = '0 16px';
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fa-solid fa-magnifying-glass';
    searchBtn.appendChild(searchIcon);
    searchWrap.appendChild(searchInput);
    searchWrap.appendChild(searchBtn);

    leftPanel.appendChild(formRow);
    leftPanel.appendChild(searchWrap);
    leftPanel.appendChild(dishGrid);

    // --- Right Panel ---
    const rightPanel = document.createElement('div');
    rightPanel.style.padding = 'var(--stack-lg)';
    rightPanel.style.paddingTop = '0';
    rightPanel.style.paddingLeft = '0';

    const ticketPanel = document.createElement('div');
    ticketPanel.className = 'ticket-panel';

    const ticketHeader = document.createElement('div');
    ticketHeader.className = 'ticket-header';
    const tH4 = document.createElement('h4');
    tH4.textContent = t('orders.modal.title');
    const tSpan = document.createElement('span');
    tSpan.textContent = ''; // Can display current time or walk-in status
    ticketHeader.appendChild(tH4);
    ticketHeader.appendChild(tSpan);

    const ticketSummary = document.createElement('div');
    ticketSummary.className = 'ticket-summary';

    const sumRow1 = document.createElement('div');
    sumRow1.className = 'ticket-summary-row';
    const l1 = document.createElement('span');
    l1.textContent = t('orders.modal.subtotal');
    sumRow1.appendChild(l1);
    sumRow1.appendChild(subtotalEl);

    const sumRow2 = document.createElement('div');
    sumRow2.className = 'ticket-summary-row';
    const l2 = document.createElement('span');
    l2.textContent = t('orders.modal.tax') + ' (8%)';
    sumRow2.appendChild(l2);
    sumRow2.appendChild(taxEl);

    const sumRow3 = document.createElement('div');
    sumRow3.className = 'ticket-summary-total';
    const l3 = document.createElement('span');
    l3.textContent = t('orders.modal.total');
    sumRow3.appendChild(l3);
    sumRow3.appendChild(totalEl);

    ticketSummary.appendChild(sumRow1);
    ticketSummary.appendChild(sumRow2);
    ticketSummary.appendChild(sumRow3);

    ticketPanel.appendChild(ticketHeader);
    ticketPanel.appendChild(ticketItemsContainer);
    ticketPanel.appendChild(ticketSummary);

    rightPanel.appendChild(ticketPanel);

    posLayout.appendChild(leftPanel);
    posLayout.appendChild(rightPanel);
    body.appendChild(posLayout);
    modalContainer.appendChild(body);

    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    const cancelBtn = document.createElement('label');
    cancelBtn.htmlFor = 'add-order-modal-toggle';
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = t('orders.modal.cancel');

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-primary';
    confirmBtn.textContent = t('orders.modal.confirm');
    
    confirmBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            emitEvent('showToast', { message: 'Cannot create empty order', type: 'warning' });
            return;
        }

        const newOrder = {
            id: Math.floor(1000 + Math.random() * 9000).toString(),
            customerName: customerInput.value.trim() || 'Walk-in Customer',
            phoneNumber: phoneInput.value.trim(),
            status: 'pending',
            items: cart.map(item => ({ ...item })),
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
            tax: cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.08,
            total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 1.08,
            createdAt: Date.now()
        };

        const currentOrders = getLocal('ordersItems', true) || [];
        currentOrders.unshift(newOrder); // add to top
        setLocal('ordersItems', currentOrders, true);
        
        emitEvent('ordersUpdated');
        emitEvent('showToast', { message: 'Order created successfully', type: 'success' });
        checkbox.checked = false; // close modal
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    modalContainer.appendChild(footer);
    container.appendChild(modalContainer);

    onEvent('openAddOrderModal', () => {
        cart = [];
        searchQuery = '';
        searchInput.value = '';
        customerInput.value = '';
        phoneInput.value = '';
        renderDishGrid();
        renderTicket();
        checkbox.checked = true;
    });

    // Initial render
    renderDishGrid();
    renderTicket();

    return container;
};

export default AddOrderModal;
