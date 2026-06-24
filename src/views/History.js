import { t } from '../utils/i18n.js';
import { getLocal } from '../utils/storage.js';
import { emitEvent } from '../utils/events.js';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-content history-page';
        
        // Header
        const header = document.createElement('div');
        header.className = 'page-header';
        
        const h1 = document.createElement('h1');
        h1.textContent = t('history.title') || 'Order History';
        
        const controls = document.createElement('div');
        controls.className = 'history-controls';
        
        // Search Input
        const searchWrapper = document.createElement('div');
        searchWrapper.style.position = 'relative';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control history-search-input';
        searchInput.placeholder = t('history.search') || 'Search orders...';
        searchInput.style.paddingLeft = '36px';
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fa-solid fa-magnifying-glass';
        searchIcon.style.position = 'absolute';
        searchIcon.style.left = '12px';
        searchIcon.style.top = '14px';
        searchIcon.style.color = 'var(--color-text-variant)';
        
        searchWrapper.appendChild(searchInput);
        searchWrapper.appendChild(searchIcon);
        
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'form-control';
        
        controls.appendChild(searchWrapper);
        controls.appendChild(dateInput);
        
        header.appendChild(h1);
        header.appendChild(controls);
        
        // Table Container
        const dataContainer = document.createElement('div');
        dataContainer.className = 'data-table-container';
        
        const tableResponsive = document.createElement('div');
        tableResponsive.className = 'table-responsive';
        
        const table = document.createElement('table');
        table.className = 'data-table history-table';
        
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        const thOrder = document.createElement('th');
        thOrder.textContent = t('history.col.order') || 'Order #';
        trHead.appendChild(thOrder);

        const thDate = document.createElement('th');
        thDate.textContent = t('history.col.date') || 'Date & Time';
        trHead.appendChild(thDate);

        const thCustomer = document.createElement('th');
        thCustomer.textContent = t('history.col.customer') || 'Customer';
        trHead.appendChild(thCustomer);

        const thTotal = document.createElement('th');
        thTotal.textContent = t('history.col.total') || 'Total Amount';
        trHead.appendChild(thTotal);

        const thStatus = document.createElement('th');
        thStatus.textContent = t('history.col.status') || 'Status';
        trHead.appendChild(thStatus);

        const thAction = document.createElement('th');
        thAction.textContent = t('history.col.action') || 'Action';
        trHead.appendChild(thAction);

        thead.appendChild(trHead);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        tableResponsive.appendChild(table);
        dataContainer.appendChild(tableResponsive);
        
        wrapper.appendChild(header);
        wrapper.appendChild(dataContainer);
        
        // Append Modal
        const detailsModal = OrderDetailsModal();
        wrapper.appendChild(detailsModal);
        
        let allOrders = [];
        let currentPage = 1;
        const itemsPerPage = 8;
        let currentQuery = '';
        let currentDate = '';
        
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';
        wrapper.appendChild(paginationContainer);

        const renderPagination = (totalItems) => {
            paginationContainer.replaceChildren();
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (totalPages <= 1) return;

            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn';
            const prevIcon = document.createElement('i');
            prevIcon.className = 'fa-solid fa-chevron-left';
            prevBtn.appendChild(prevIcon);
            prevBtn.disabled = currentPage === 1;
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();
                }
            });
            paginationContainer.appendChild(prevBtn);

            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    renderTable();
                });
                paginationContainer.appendChild(pageBtn);
            }

            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn';
            const nextIcon = document.createElement('i');
            nextIcon.className = 'fa-solid fa-chevron-right';
            nextBtn.appendChild(nextIcon);
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable();
                }
            });
            paginationContainer.appendChild(nextBtn);
        };
        
        const renderTable = () => {
            tbody.replaceChildren();
            
            // Filter completed/cancelled
            let orders = allOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');
            
            // Sort by date desc
            orders.sort((a, b) => b.createdAt - a.createdAt);
            
            // Apply search filter
            if (currentQuery.trim() !== '') {
                const lowerQ = currentQuery.toLowerCase();
                orders = orders.filter(o => 
                    (o.customerName && o.customerName.toLowerCase().includes(lowerQ)) ||
                    (o.id && o.id.toLowerCase().includes(lowerQ))
                );
            }

            // Apply date filter
            if (currentDate) {
                orders = orders.filter(o => {
                    const d = new Date(o.createdAt);
                    const oDate = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                    return oDate === currentDate;
                });
            }
            
            const totalItems = orders.length;
            
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);
            
            renderPagination(totalItems);
            
            if (paginatedOrders.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 6;
                td.style.textAlign = 'center';
                td.style.padding = 'var(--stack-xl)';
                td.style.color = 'var(--color-text-variant)';
                td.textContent = t('history.empty') || 'No completed orders found.';
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }
            
            paginatedOrders.forEach(order => {
                const tr = document.createElement('tr');
                
                // Format Date
                const d = new Date(order.createdAt);
                const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                const badgeClass = order.status === 'completed' ? 'completed' : 'cancelled';
                const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                
                const tdId = document.createElement('td');
                tdId.textContent = '#' + order.id;
                tr.appendChild(tdId);
                
                const tdDate = document.createElement('td');
                tdDate.textContent = dateStr;
                tr.appendChild(tdDate);
                
                const tdCust = document.createElement('td');
                tdCust.textContent = order.customerName || t('orders.modal.anonymous');
                tr.appendChild(tdCust);
                
                const tdTotal = document.createElement('td');
                tdTotal.style.fontWeight = '600';
                tdTotal.textContent = '$' + parseFloat(order.total).toFixed(2);
                tr.appendChild(tdTotal);
                
                const tdStatus = document.createElement('td');
                const badge = document.createElement('span');
                badge.className = `status-badge ${badgeClass}`;
                badge.textContent = statusLabel;
                tdStatus.appendChild(badge);
                tr.appendChild(tdStatus);
                
                const actionTd = document.createElement('td');
                const viewBtn = document.createElement('button');
                viewBtn.className = 'btn-icon';
                viewBtn.title = 'View Details';
                const eyeIcon = document.createElement('i');
                eyeIcon.className = 'fa-regular fa-eye';
                viewBtn.appendChild(eyeIcon);
                
                viewBtn.addEventListener('click', () => {
                    emitEvent('openOrderDetails', { order });
                });
                
                actionTd.appendChild(viewBtn);
                tr.appendChild(actionTd);
                
                tbody.appendChild(tr);
            });
        };
        
        // Search listener with debounce
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentQuery = e.target.value;
                currentPage = 1;
                renderTable();
            }, 300);
        });

        // Date filter listener
        dateInput.addEventListener('change', (e) => {
            currentDate = e.target.value;
            currentPage = 1;
            renderTable();
        });
        
        // Initial load
        allOrders = getLocal('ordersItems', true) || [];
        renderTable();

        return wrapper;
    }
}
