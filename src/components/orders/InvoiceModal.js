import { t, formatCurrency } from '../../utils/i18n.js';
import { getLocal } from '../../utils/storage.js';
import { onEvent, emitEvent } from '../../utils/events.js';

export const InvoiceModal = () => {
    const wrapper = document.createElement('div');
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container invoice-modal';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-icon floating-close-btn';
    
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeBtn.appendChild(closeIcon);
    
    closeBtn.addEventListener('click', () => {
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    const body = document.createElement('div');
    body.className = 'modal-body invoice-paper';
    
    const renderInvoice = (order, invoiceData) => {
        body.replaceChildren();
        
        const restaurantProfile = getLocal('restaurant_profile', true) || {};
        const restaurantName = restaurantProfile.name || 'RESTAURANTE';
        
        // Invoice Header
        const header = document.createElement('div');
        header.className = 'invoice-header';
        
        const rName = document.createElement('h1');
        rName.textContent = restaurantName;
        
        const invTitle = document.createElement('h2');
        invTitle.textContent = t('invoice.title') || 'FACTURA';
        
        const invNumber = document.createElement('p');
        invNumber.textContent = `N.º ${order.id}`;
        
        header.appendChild(rName);
        header.appendChild(invTitle);
        header.appendChild(invNumber);
        
        if (order.status === 'cancelled') {
            const cancelledBadge = document.createElement('div');
            cancelledBadge.textContent = 'CANCELADA';
            cancelledBadge.style.textAlign = 'center';
            cancelledBadge.style.fontSize = '24px';
            cancelledBadge.style.fontWeight = 'bold';
            cancelledBadge.style.color = '#dc3545'; // red
            cancelledBadge.style.border = '3px dashed #dc3545';
            cancelledBadge.style.margin = '10px 0';
            cancelledBadge.style.padding = '5px';
            cancelledBadge.style.letterSpacing = '2px';
            header.appendChild(cancelledBadge);
        }
        body.appendChild(header);
        
        // Items
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'invoice-items';
        
        order.items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'invoice-item-row';
            
            const nameQty = document.createElement('div');
            nameQty.className = 'invoice-item-name';
            nameQty.textContent = `${item.qty} x ${item.name}`;
            
            const price = document.createElement('div');
            price.className = 'invoice-item-price';
            price.textContent = formatCurrency(parseFloat(item.price) * parseInt(item.qty, 10));
            
            row.appendChild(nameQty);
            row.appendChild(price);
            itemsContainer.appendChild(row);
        });
        
        body.appendChild(itemsContainer);
        
        // Totals
        const totalsContainer = document.createElement('div');
        totalsContainer.className = 'invoice-totals';
        
        const totalRow = document.createElement('div');
        totalRow.className = 'invoice-total-row';
        const totalLabel = document.createElement('span');
        totalLabel.textContent = t('orders.modal.total').toUpperCase() || 'TOTAL';
        const totalValue = document.createElement('span');
        totalValue.textContent = formatCurrency(order.total);
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        
        const taxRow = document.createElement('div');
        taxRow.className = 'invoice-total-row tax-row';
        const taxLabel = document.createElement('span');
        taxLabel.textContent = t('orders.modal.tax').toUpperCase() || 'IVA';
        const taxValue = document.createElement('span');
        taxValue.textContent = formatCurrency(order.tax);
        taxRow.appendChild(taxLabel);
        taxRow.appendChild(taxValue);
        
        totalsContainer.appendChild(totalRow);
        totalsContainer.appendChild(taxRow);
        
        // Payment info if available
        if (invoiceData) {
            const methodRow = document.createElement('div');
            methodRow.className = 'invoice-payment-info';
            const methodLabel = document.createElement('span');
            methodLabel.textContent = (t('payment.method') || 'Payment Method').toUpperCase() + ':';
            const methodValue = document.createElement('span');
            methodValue.textContent = (invoiceData.method === 'cash' ? t('payment.cash') : t('payment.card')).toUpperCase();
            methodRow.appendChild(methodLabel);
            methodRow.appendChild(methodValue);
            totalsContainer.appendChild(methodRow);
            
            if (invoiceData.method === 'cash') {
                const receivedRow = document.createElement('div');
                receivedRow.className = 'invoice-payment-info';
                const receivedLabel = document.createElement('span');
                receivedLabel.textContent = (t('payment.amountReceived') || 'Received').toUpperCase() + ':';
                const receivedValue = document.createElement('span');
                receivedValue.textContent = formatCurrency(invoiceData.amountReceived || 0);
                receivedRow.appendChild(receivedLabel);
                receivedRow.appendChild(receivedValue);
                totalsContainer.appendChild(receivedRow);
                
                const changeRow = document.createElement('div');
                changeRow.className = 'invoice-payment-info';
                const changeLabel = document.createElement('span');
                changeLabel.textContent = (t('payment.change') || 'Change').toUpperCase() + ':';
                const changeValue = document.createElement('span');
                changeValue.textContent = formatCurrency(invoiceData.change || 0);
                changeRow.appendChild(changeLabel);
                changeRow.appendChild(changeValue);
                totalsContainer.appendChild(changeRow);
            }
        }
        
        body.appendChild(totalsContainer);
        
        // Footer
        const footer = document.createElement('div');
        footer.className = 'invoice-footer';
        footer.textContent = t('invoice.thanks') || 'GRACIAS';
        body.appendChild(footer);
    };
    
    const printBtn = document.createElement('button');
    printBtn.className = 'floating-print-btn';
    
    const printIcon = document.createElement('i');
    printIcon.className = 'fa-solid fa-print';
    
    printBtn.appendChild(printIcon);
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    modalContainer.appendChild(body);
    
    wrapper.appendChild(overlay);
    wrapper.appendChild(modalContainer);
    wrapper.appendChild(closeBtn);
    wrapper.appendChild(printBtn);
    
    wrapper.style.display = 'none';
    wrapper.classList.add('modal-wrapper', 'invoice-modal-wrapper');
    
    onEvent('openInvoice', (e) => {
        const { order, invoiceData } = e.detail;
        if (!order) return;
        
        // If invoiceData is not provided, try to fetch it from storage
        let invData = invoiceData;
        if (!invData) {
            const allInvoices = getLocal('invoices', true) || {};
            invData = allInvoices[order.id];
        }
        
        renderInvoice(order, invData);
        
        wrapper.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    overlay.addEventListener('click', () => {
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    return wrapper;
};
