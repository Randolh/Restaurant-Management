import { t, formatCurrency } from '../../utils/i18n.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { onEvent, emitEvent } from '../../utils/events.js';
import showToast from '../ui/Toast.js';

export const PaymentModal = () => {
    const wrapper = document.createElement('div');
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    const title = document.createElement('h2');
    title.textContent = t('payment.title') || 'Payment Details';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-icon';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeBtn.appendChild(closeIcon);
    closeBtn.addEventListener('click', () => {
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    const body = document.createElement('div');
    body.className = 'modal-body payment-modal-body';
    
    let currentOrder = null;
    let selectedMethod = 'cash'; // 'cash' or 'card'
    let successCallback = null;
    
    const methodContainer = document.createElement('div');
    methodContainer.className = 'form-group';
    const methodLabel = document.createElement('label');
    methodLabel.className = 'form-label';
    methodLabel.textContent = t('payment.method') || 'Payment Method';
    
    const methodSelector = document.createElement('div');
    methodSelector.className = 'payment-method-selector';
    
    // Cash Radio
    const cashInput = document.createElement('input');
    cashInput.type = 'radio';
    cashInput.name = 'payment-method';
    cashInput.id = 'pay-cash';
    cashInput.value = 'cash';
    cashInput.checked = true;
    
    const cashLabel = document.createElement('label');
    cashLabel.htmlFor = 'pay-cash';
    const cashIcon = document.createElement('i');
    cashIcon.className = 'fa-solid fa-money-bill-wave method-icon';
    const cashText = document.createElement('div');
    cashText.textContent = t('payment.cash') || 'Cash';
    cashLabel.appendChild(cashIcon);
    cashLabel.appendChild(cashText);
    
    // Card Radio
    const cardInput = document.createElement('input');
    cardInput.type = 'radio';
    cardInput.name = 'payment-method';
    cardInput.id = 'pay-card';
    cardInput.value = 'card';
    
    const cardLabel = document.createElement('label');
    cardLabel.htmlFor = 'pay-card';
    const cardIcon = document.createElement('i');
    cardIcon.className = 'fa-solid fa-credit-card method-icon';
    const cardText = document.createElement('div');
    cardText.textContent = t('payment.card') || 'Card';
    cardLabel.appendChild(cardIcon);
    cardLabel.appendChild(cardText);
    
    methodSelector.appendChild(cashInput);
    methodSelector.appendChild(cashLabel);
    methodSelector.appendChild(cardInput);
    methodSelector.appendChild(cardLabel);
    
    methodContainer.appendChild(methodLabel);
    methodContainer.appendChild(methodSelector);
    
    // Dynamic Fields Container
    const dynamicFields = document.createElement('div');
    dynamicFields.className = 'form-group';
    
    const updateDynamicFields = () => {
        dynamicFields.replaceChildren();
        if (!currentOrder) return;
        
        if (selectedMethod === 'cash') {
            const receivedLabel = document.createElement('label');
            receivedLabel.className = 'form-label';
            receivedLabel.textContent = t('payment.amountReceived') || 'Amount Received';
            
            const receivedInput = document.createElement('input');
            receivedInput.type = 'number';
            receivedInput.className = 'form-control payment-amount-input';
            receivedInput.min = currentOrder.total;
            receivedInput.step = '0.01';
            receivedInput.placeholder = parseFloat(currentOrder.total).toFixed(2);
            
            const changeDisplay = document.createElement('div');
            changeDisplay.className = 'payment-change-display';
            changeDisplay.textContent = `${t('payment.change') || 'Change'}: ${formatCurrency(0)}`;
            
            receivedInput.addEventListener('input', (e) => {
                const received = parseFloat(e.target.value) || 0;
                const change = Math.max(0, received - parseFloat(currentOrder.total));
                changeDisplay.textContent = `${t('payment.change') || 'Change'}: ${formatCurrency(change)}`;
            });
            
            dynamicFields.appendChild(receivedLabel);
            dynamicFields.appendChild(receivedInput);
            dynamicFields.appendChild(changeDisplay);
        }
        // If card, we don't ask for any digits anymore
    };
    
    cashInput.addEventListener('change', () => { selectedMethod = 'cash'; updateDynamicFields(); });
    cardInput.addEventListener('change', () => { selectedMethod = 'card'; updateDynamicFields(); });
    
    // Total Display
    const totalDisplay = document.createElement('div');
    totalDisplay.className = 'payment-total-display';
    
    body.appendChild(methodContainer);
    body.appendChild(dynamicFields);
    body.appendChild(totalDisplay);
    
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = t('btn.cancel') || 'Cancel';
    cancelBtn.addEventListener('click', () => {
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-primary';
    confirmBtn.textContent = t('payment.confirm') || 'Confirm & Generate Invoice';
    
    confirmBtn.addEventListener('click', () => {
        if (!currentOrder) return;
        
        let invoiceData = {
            method: selectedMethod,
            timestamp: new Date().toISOString()
        };
        
        if (selectedMethod === 'cash') {
            const input = dynamicFields.querySelector('input');
            const received = parseFloat(input.value);
            const total = parseFloat(currentOrder.total);
            if (isNaN(received) || received < total) {
                showToast(t('payment.insufficient') || 'Amount received is invalid or insufficient.', 'error');
                return;
            }
            invoiceData.amountReceived = received;
            invoiceData.change = received - total;
        }
        
        // Save to invoices
        const invoices = getLocal('invoices', true) || {};
        invoices[currentOrder.id] = invoiceData;
        setLocal('invoices', invoices, true);
        
        if (successCallback) {
            successCallback();
        } else {
            // Update Order Status (fallback for old flow)
            const currentOrders = getLocal('ordersItems', true) || [];
            const index = currentOrders.findIndex(o => o.id === currentOrder.id);
            if (index !== -1) {
                currentOrders[index].status = 'completed';
                setLocal('ordersItems', currentOrders, true);
                emitEvent('ordersUpdated');
            }
        }
        
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
        
        // Show Invoice
        emitEvent('openInvoice', { order: currentOrder, invoiceData });
    });
    
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    
    modalContainer.appendChild(header);
    modalContainer.appendChild(body);
    modalContainer.appendChild(footer);
    
    wrapper.appendChild(overlay);
    wrapper.appendChild(modalContainer);
    
    wrapper.style.display = 'none';
    wrapper.classList.add('modal-wrapper');
    
    onEvent('openPayment', (e) => {
        const order = e.detail.order;
        if (!order) return;
        
        currentOrder = order;
        successCallback = e.detail.onSuccess || null;
        selectedMethod = 'cash';
        cashInput.checked = true;
        totalDisplay.textContent = `Total: ${formatCurrency(order.total)}`;
        updateDynamicFields();
        
        wrapper.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    return wrapper;
};
