import { t } from '../utils/i18n.js';
import { getLocal } from '../utils/storage.js';
import { emitEvent } from '../utils/events.js';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'history-layout';
        
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';
        
        // Header
        const header = document.createElement('div');
        header.className = 'page-header';
        
        const h1 = document.createElement('h1');
        h1.textContent = t('history.title') || 'Order History';
        
        const controls = document.createElement('div');
        controls.className = 'history-controls';
        
        // Search Input
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'search-wrapper';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control history-search-input';
        searchInput.placeholder = t('history.search') || 'Search orders...';
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fa-solid fa-magnifying-glass history-search-icon';
        
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
        thAction.className = 'history-action-col';
        thAction.textContent = t('history.col.action') || 'Action';
        trHead.appendChild(thAction);

        thead.appendChild(trHead);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        tableResponsive.appendChild(table);
        dataContainer.appendChild(tableResponsive);
        
        pageContent.appendChild(header);
        pageContent.appendChild(dataContainer);
        
        // Append Modal
        const detailsModal = OrderDetailsModal();
        wrapper.appendChild(detailsModal);
        
        let allOrders = [];
        let currentPage = 1;
        const itemsPerPage = 12;
        let currentQuery = '';
        let currentDate = '';
        
        const tableFooter = document.createElement('div');
        tableFooter.className = 'table-footer pagination';
        pageContent.appendChild(tableFooter);
        
        wrapper.appendChild(pageContent);

        const renderPagination = (totalItems) => {
            tableFooter.replaceChildren();

            const tableInfo = document.createElement('span');
            tableInfo.className = 'table-info';
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
            const endDisplay = Math.min(endIndex, totalItems);
            tableInfo.textContent = t('table.showing', { start: startDisplay, end: endDisplay, total: totalItems }) || `Showing ${startDisplay}-${endDisplay} of ${totalItems}`;
            tableFooter.appendChild(tableInfo);

            const paginationControls = document.createElement('div');
            paginationControls.className = 'pagination-controls';

            const totalPages = Math.ceil(totalItems / itemsPerPage);

            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn';
            const prevIcon = document.createElement('i');
            prevIcon.className = 'fa-solid fa-chevron-left';
            prevBtn.appendChild(prevIcon);
            if (currentPage <= 1) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
            } else {
                prevBtn.addEventListener('click', () => {
                    currentPage--;
                    renderTable();
                });
            }
            paginationControls.appendChild(prevBtn);

            let startPage = Math.max(1, currentPage - 1);
            let endPage = Math.min(Math.max(totalPages, 1), startPage + 2);
            if (endPage - startPage < 2 && Math.max(totalPages, 1) >= 3) {
                startPage = Math.max(1, endPage - 2);
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    renderTable();
                });
                paginationControls.appendChild(pageBtn);
            }

            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn';
            const nextIcon = document.createElement('i');
            nextIcon.className = 'fa-solid fa-chevron-right';
            nextBtn.appendChild(nextIcon);
            if (currentPage >= totalPages || totalPages === 0) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'not-allowed';
            } else {
                nextBtn.addEventListener('click', () => {
                    currentPage++;
                    renderTable();
                });
            }
            paginationControls.appendChild(nextBtn);

            tableFooter.appendChild(paginationControls);
        };
        
        const renderTable = () => {
            tbody.replaceChildren();
            
            // Filter completed/cancelled removed, show all orders
            let orders = [...allOrders];
            
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
                td.className = 'history-empty-msg';
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
                
                const badgeClass = (order.status || 'pending').toLowerCase();
                // We use translation or fallback for status label
                const statusLabel = t(`orders.kanban.${order.status}.singular`) || t(`orders.kanban.${order.status}`) || order.status.charAt(0).toUpperCase() + order.status.slice(1);
                
                const tdId = document.createElement('td');
                tdId.textContent = '#' + order.id;
                tdId.className = 'history-order-id-link';
                tdId.title = t('orders.card.btn.ready') || 'View Details'; // Optional tooltip
                tdId.addEventListener('click', () => {
                    emitEvent('openOrderDetails', { order });
                });
                tr.appendChild(tdId);
                
                const tdDate = document.createElement('td');
                tdDate.textContent = dateStr;
                tr.appendChild(tdDate);
                
                const tdCust = document.createElement('td');
                tdCust.textContent = order.customerName || t('orders.modal.anonymous');
                tr.appendChild(tdCust);
                
                const tdTotal = document.createElement('td');
                tdTotal.className = 'history-total-col';
                tdTotal.textContent = '$' + parseFloat(order.total).toFixed(2);
                tr.appendChild(tdTotal);
                
                const tdStatus = document.createElement('td');
                const badge = document.createElement('span');
                badge.className = `status-badge ${badgeClass}`;
                badge.textContent = statusLabel;
                tdStatus.appendChild(badge);
                tr.appendChild(tdStatus);
                
                const actionTd = document.createElement('td');
                actionTd.className = 'history-action-col';
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
