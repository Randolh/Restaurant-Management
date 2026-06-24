import { t } from '../../utils/i18n.js';
import { onEvent } from '../../utils/events.js';

export const OrderDetailsModal = () => {
    const wrapper = document.createElement('div');
    
    // We create the modal structure, initially hidden
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.maxWidth = '600px';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    const title = document.createElement('h2');
    title.textContent = t('history.modal.title') || 'Order Details';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-icon';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeBtn.appendChild(closeIcon);
    closeBtn.addEventListener('click', () => {
        wrapper.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    const renderContent = (order) => {
        body.replaceChildren();
        
        // Header Info
        const infoRow = document.createElement('div');
        infoRow.className = 'info-row';
        
        const custInfo = document.createElement('div');
        const custLabel = document.createElement('strong');
        custLabel.textContent = (t('history.col.customer') || 'Customer') + ': ';
        const custVal = document.createTextNode(order.customerName || t('orders.modal.anonymous'));
        const custBr = document.createElement('br');
        const custPhone = document.createElement('small');
        custPhone.style.color = 'var(--color-text-variant)';
        custPhone.textContent = order.phoneNumber || '';
        custInfo.appendChild(custLabel);
        custInfo.appendChild(custVal);
        custInfo.appendChild(custBr);
        custInfo.appendChild(custPhone);
        
        const dateInfo = document.createElement('div');
        dateInfo.className = 'date-info';
        const d = new Date(order.createdAt);
        const dateLabel = document.createElement('strong');
        dateLabel.textContent = (t('history.col.order') || 'Order #') + ': ';
        const dateVal = document.createTextNode(order.id);
        const dateBr = document.createElement('br');
        const dateTime = document.createElement('small');
        dateTime.style.color = 'var(--color-text-variant)';
        dateTime.textContent = d.toLocaleString();
        dateInfo.appendChild(dateLabel);
        dateInfo.appendChild(dateVal);
        dateInfo.appendChild(dateBr);
        dateInfo.appendChild(dateTime);
        
        infoRow.appendChild(custInfo);
        infoRow.appendChild(dateInfo);
        body.appendChild(infoRow);
        
        // Items Table
        const itemsTitle = document.createElement('h3');
        itemsTitle.textContent = t('history.modal.items') || 'Items';
        itemsTitle.className = 'items-title';
        body.appendChild(itemsTitle);
        
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-responsive';
        tableContainer.style.marginBottom = 'var(--stack-md)';
        
        const table = document.createElement('table');
        table.className = 'data-table';
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const thItem = document.createElement('th');
        thItem.textContent = t('history.modal.items') || 'Item';
        thItem.className = 'col-item';
        const thQty = document.createElement('th');
        thQty.className = 'col-qty';
        thQty.textContent = 'Qty';
        const thPrice = document.createElement('th');
        thPrice.className = 'col-price';
        thPrice.textContent = 'Price';
        const thSubtotal = document.createElement('th');
        thSubtotal.className = 'col-subtotal';
        thSubtotal.textContent = 'Subtotal';
        trHead.appendChild(thItem);
        trHead.appendChild(thQty);
        trHead.appendChild(thPrice);
        trHead.appendChild(thSubtotal);
        thead.appendChild(trHead);
        
        const tbody = document.createElement('tbody');
        order.items.forEach(item => {
            const tr = document.createElement('tr');
            
            const tdName = document.createElement('td');
            tdName.className = 'col-item';
            tdName.textContent = item.name;
            
            const tdQty = document.createElement('td');
            tdQty.className = 'col-qty';
            tdQty.textContent = item.qty;
            
            const tdPrice = document.createElement('td');
            tdPrice.className = 'col-price';
            tdPrice.textContent = '$' + parseFloat(item.price).toFixed(2);
            
            const tdSub = document.createElement('td');
            tdSub.className = 'col-subtotal';
            tdSub.textContent = '$' + (parseFloat(item.price) * parseInt(item.qty, 10)).toFixed(2);
            
            tr.appendChild(tdName);
            tr.appendChild(tdQty);
            tr.appendChild(tdPrice);
            tr.appendChild(tdSub);
            tbody.appendChild(tr);
        });
        
        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        body.appendChild(tableContainer);
        
        // Totals
        const totalsDiv = document.createElement('div');
        totalsDiv.className = 'totals-container';
        const row1 = document.createElement('div');
        row1.className = 'totals-row';
        const l1 = document.createElement('span');
        l1.textContent = (t('history.modal.subtotal') || 'Subtotal') + ':';
        const v1 = document.createElement('span');
        v1.textContent = '$' + parseFloat(order.subtotal).toFixed(2);
        row1.appendChild(l1);
        row1.appendChild(v1);
        
        const row2 = document.createElement('div');
        row2.className = 'totals-row';
        const l2 = document.createElement('span');
        l2.textContent = (t('history.modal.tax') || 'Tax') + ':';
        const v2 = document.createElement('span');
        v2.textContent = '$' + parseFloat(order.tax).toFixed(2);
        row2.appendChild(l2);
        row2.appendChild(v2);
        
        const row3 = document.createElement('div');
        row3.className = 'totals-row grand-total';
        const l3 = document.createElement('span');
        l3.textContent = (t('history.modal.total') || 'Total') + ':';
        const v3 = document.createElement('span');
        v3.className = 'grand-total-val';
        v3.textContent = '$' + parseFloat(order.total).toFixed(2);
        row3.appendChild(l3);
        row3.appendChild(v3);
        
        totalsDiv.appendChild(row1);
        totalsDiv.appendChild(row2);
        totalsDiv.appendChild(row3);
        
        const totalsWrapper = document.createElement('div');
        totalsWrapper.style.display = 'flex';
        totalsWrapper.appendChild(totalsDiv);
        body.appendChild(totalsWrapper);
    };
    
    modalContainer.appendChild(header);
    modalContainer.appendChild(body);
    
    wrapper.appendChild(overlay);
    wrapper.appendChild(modalContainer);
    
    // Hide initially
    wrapper.style.display = 'none';
    
    // Manage visibility via CSS classes if needed or just display
    wrapper.classList.add('modal-wrapper', 'order-details-modal'); // Custom styling
    
    // We override wrapper styles with a class dynamically
    
    onEvent('openOrderDetails', (e) => {
        const order = e.detail.order;
        if (!order) return;
        
        renderContent(order);
        
        wrapper.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Allow clicking overlay to close
    overlay.addEventListener('click', () => {
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    closeBtn.addEventListener('click', () => {
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
    });

    return wrapper;
};
