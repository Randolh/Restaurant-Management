import { t, formatCurrency } from '../../utils/i18n.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent, onEvent } from '../../utils/events.js';
import { DEFAULT_TAX_RATE } from '../../utils/constants.js';

const AddOrderModal = () => {
    const wrapper = document.createElement('div');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'add-order-modal-toggle';
    checkbox.className = 'modal-toggle';
    checkbox.hidden = true;
    wrapper.appendChild(checkbox);

    const modal = document.createElement('div');
    modal.className = 'modal';

    const overlay = document.createElement('label');
    overlay.htmlFor = 'add-order-modal-toggle';
    overlay.className = 'modal-overlay';
    modal.appendChild(overlay);

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container pos-modal-container';

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.style.borderBottom = 'none';
    const h2 = document.createElement('h2');
    h2.textContent = t('orders.modal.title');
    header.appendChild(h2);
    modalContainer.appendChild(header);

    const body = document.createElement('div');
    body.className = 'modal-body pos-modal-body';

    const posLayout = document.createElement('div');
    posLayout.className = 'pos-layout';

    const getTaxRate = () => {
        const saved = getLocal('appTaxRate', false);
        return saved !== null ? parseFloat(saved) : DEFAULT_TAX_RATE;
    };

    // State
    let cart = [];
    let searchQuery = '';
    
    // UI Elements that need re-rendering
    const dishGrid = document.createElement('div');
    dishGrid.className = 'pos-dish-grid';
    const ticketItemsContainer = document.createElement('div');
    ticketItemsContainer.className = 'ticket-items';
    const subtotalEl = document.createElement('span');
    const taxEl = document.createElement('span');
    const totalEl = document.createElement('span');
    
    const customerInput = document.createElement('input');
    const phoneInput = document.createElement('input');

    const getMaxPortions = (dish, inventoryItems) => {
        if (!dish.recipe || dish.recipe.length === 0) return 999;
        let minPortions = Infinity;
        for (const ing of dish.recipe) {
            const invItem = inventoryItems.find(i => i.id === ing.id);
            const invQty = invItem && !invItem.deleted ? parseFloat(invItem.quantity) : 0;
            const requiredQty = parseFloat(ing.qty);
            if (requiredQty <= 0) continue;
            const portions = Math.floor(invQty / requiredQty);
            if (portions < minPortions) minPortions = portions;
        }
        return minPortions === Infinity ? 0 : minPortions;
    };

    const renderDishGrid = () => {
        dishGrid.replaceChildren();
        if (!searchQuery.trim()) return; // Solo mostrar si hay busqueda
        
        const allDishes = getLocal('dishesItems', true) || [];
        const inventoryItems = getLocal('inventoryItems', true) || [];
        const filtered = allDishes.filter(d => d.isAvailable && d.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        filtered.forEach(dish => {
            const maxPortions = getMaxPortions(dish, inventoryItems);
            const inCartItem = cart.find(item => item.dishId === dish.id);
            const currentCartQty = inCartItem ? inCartItem.qty : 0;
            const availableToAdd = maxPortions - currentCartQty;

            const card = document.createElement('div');
            card.className = 'order-dish-item is-search-result';
            
            if (inCartItem) card.classList.add('selected');

            const infoDiv = document.createElement('div');
            infoDiv.className = 'order-dish-info';

            const nameText = document.createElement('span');
            nameText.className = 'order-dish-name';
            nameText.textContent = dish.name.length > 10 ? dish.name.substring(0, 10) + '...' : dish.name;

            const priceText = document.createElement('span');
            priceText.className = 'order-dish-price';
            priceText.textContent = formatCurrency(parseFloat(dish.price));

            infoDiv.appendChild(nameText);
            infoDiv.appendChild(priceText);

            if (maxPortions <= 0) {
                const outOfStockText = document.createElement('span');
                outOfStockText.className = 'text-warning';
                outOfStockText.style.fontSize = 'var(--font-size-label-md)';
                outOfStockText.textContent = t('orders.modal.outOfStock') || 'Out of Stock';
                outOfStockText.style.display = 'block';
                outOfStockText.style.marginTop = '4px';
                infoDiv.appendChild(outOfStockText);
            }

            const actionsCol = document.createElement('div');
            actionsCol.className = 'order-dish-actions';

            const addBtn = document.createElement('button');
            addBtn.className = 'btn-icon btn-small btn-circle';
            addBtn.title = 'Add';
            addBtn.style.backgroundColor = availableToAdd > 0 ? 'var(--brand-primary)' : 'var(--elevation-2-bg)';
            addBtn.style.color = '#fff';
            if (availableToAdd <= 0) {
                addBtn.disabled = true;
                addBtn.style.cursor = 'not-allowed';
            }
            
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-plus';
            addBtn.appendChild(icon);
            
            addBtn.addEventListener('click', () => {
                if (availableToAdd <= 0) return;
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

            actionsCol.appendChild(addBtn);

            card.appendChild(infoDiv);
            card.appendChild(actionsCol);
            
            dishGrid.appendChild(card);
        });
    };

    const renderTicket = () => {
        ticketItemsContainer.replaceChildren();
        
        if (cart.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'ticket-empty-msg';
            emptyMsg.textContent = t('orders.modal.emptyTicket');
            ticketItemsContainer.appendChild(emptyMsg);
            
            subtotalEl.textContent = formatCurrency(0);
            taxEl.textContent = formatCurrency(0);
            totalEl.textContent = formatCurrency(0);
            
            if (window.confirmOrderBtn) window.confirmOrderBtn.disabled = true;
            return;
        }

        if (window.confirmOrderBtn) window.confirmOrderBtn.disabled = false;

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const row = document.createElement('div');
            row.className = 'order-dish-item';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'order-dish-info';

            const nameText = document.createElement('span');
            nameText.className = 'order-dish-name';
            nameText.textContent = item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name;

            infoDiv.appendChild(nameText);

            const actionsCol = document.createElement('div');
            actionsCol.className = 'order-dish-actions';

            const allDishes = getLocal('dishesItems', true) || [];
            const inventoryItems = getLocal('inventoryItems', true) || [];
            const dish = allDishes.find(d => d.id === item.dishId);
            const maxPortions = dish ? getMaxPortions(dish, inventoryItems) : 999;

            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.className = 'form-control inline-qty';
            qtyInput.value = item.qty;
            qtyInput.min = 1;
            qtyInput.max = maxPortions;
            qtyInput.addEventListener('change', (e) => {
                let val = parseInt(e.target.value, 10);
                if (val > maxPortions) val = maxPortions;
                if (val > 0) {
                    item.qty = val;
                } else {
                    item.qty = 1;
                }
                renderTicket();
                renderDishGrid();
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

            const priceText = document.createElement('span');
            priceText.className = 'order-dish-price';
            priceText.textContent = `${formatCurrency(item.price)} x`;
            priceText.style.marginRight = '4px';

            actionsCol.appendChild(priceText);
            actionsCol.appendChild(qtyInput);
            actionsCol.appendChild(removeBtn);

            row.appendChild(infoDiv);
            row.appendChild(actionsCol);
            ticketItemsContainer.appendChild(row);
        });

        const currentTaxRate = getTaxRate();
        const tax = subtotal * currentTaxRate;
        const total = subtotal + tax;

        subtotalEl.textContent = formatCurrency(subtotal);
        taxEl.textContent = formatCurrency(tax);
        totalEl.textContent = formatCurrency(total);
    };

    // --- Left Panel ---
    const leftPanel = document.createElement('div');
    leftPanel.className = 'pos-left-panel';

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
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value;
            renderDishGrid();
        }, 300); // 300ms debounce
    });
    
    searchWrap.appendChild(searchInput);

    leftPanel.appendChild(formRow);
    leftPanel.appendChild(searchWrap);
    leftPanel.appendChild(dishGrid);

    // --- Right Panel ---
    const rightPanel = document.createElement('div');
    rightPanel.className = 'pos-right-panel';

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
    const currentTaxRate = getTaxRate();
    l2.textContent = t('orders.modal.tax') + ` (${(currentTaxRate * 100).toFixed(0)}%)`;
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
    window.confirmOrderBtn = confirmBtn; // Expose globally just to update state in renderTicket
    
    confirmBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const currentTaxRate = getTaxRate();
        const newOrder = {
            id: Date.now().toString(36).toUpperCase(),
            customerName: customerInput.value.trim() || t('orders.modal.anonymous') || 'Walk-in Customer',
            phoneNumber: phoneInput.value.trim(),
            status: 'pending',
            items: cart.map(item => ({ ...item })),
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
            tax: cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * currentTaxRate,
            total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * (1 + currentTaxRate),
            createdAt: Date.now()
        };

        const currentOrders = getLocal('ordersItems', true) || [];
        currentOrders.unshift(newOrder); // add to top
        setLocal('ordersItems', currentOrders, true);
        
        emitEvent('ordersUpdated');
        checkbox.checked = false; // close modal
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    modalContainer.appendChild(footer);
    modal.appendChild(modalContainer);
    wrapper.appendChild(modal);

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

    return wrapper;
};

export default AddOrderModal;
