import showConfirm from '../ui/ConfirmModal.js';

export default function InventoryTable(data) {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'data-table-container';

    const tableResponsive = document.createElement('div');
    tableResponsive.className = 'table-responsive';
    
    const table = document.createElement('table');
    table.className = 'data-table inventory-table';
    
    const thead = document.createElement('thead');
    const theadTr = document.createElement('tr');
    ['Name', 'Stock Level', 'Unit', 'Actions'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        theadTr.appendChild(th);
    });
    thead.appendChild(theadTr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    
    // Pagination container
    const tableFooter = document.createElement('div');
    tableFooter.className = 'table-footer';
    
    let currentPage = 1;
    const itemsPerPage = 12;

    const renderPage = () => {
        tbody.innerHTML = '';
        
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        
        // Ensure current page is valid
        if (currentPage > totalPages) currentPage = totalPages;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = data.slice(startIndex, endIndex);

        currentData.forEach(item => {
            const tr = document.createElement('tr');
            
            // Name
            const tdName = document.createElement('td');
            const itemName = document.createElement('div');
            itemName.className = 'item-name';

            const itemIcon = document.createElement('div');
            itemIcon.className = 'item-icon';
            const iIcon = document.createElement('i');
            iIcon.className = `fa-solid ${item.icon}`;
            itemIcon.appendChild(iIcon);
            
            itemName.appendChild(itemIcon);
            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name;
            itemName.appendChild(nameSpan);

            tdName.appendChild(itemName);
            tr.appendChild(tdName);

            // Stock Level
            const tdStock = document.createElement('td');
            const stockLevel = document.createElement('div');
            stockLevel.className = 'stock-level';
            
            const stockSpan = document.createElement('span');
            stockSpan.className = 'stock-text';
            stockSpan.textContent = item.stockText;
            stockLevel.appendChild(stockSpan);
            
            if (item.progressWidth) {
                const progContainer = document.createElement('div');
                progContainer.className = 'progress-container';
                
                const progFill = document.createElement('div');
                progFill.className = `progress-fill ${item.progressClass}`;
                progFill.style.width = item.progressWidth;
                progContainer.appendChild(progFill);
                stockLevel.appendChild(progContainer);
                
                const percentSpan = document.createElement('span');
                percentSpan.className = 'stock-percent';
                percentSpan.textContent = item.stockPercent;
                stockLevel.appendChild(percentSpan);
            }

            tdStock.appendChild(stockLevel);
            tr.appendChild(tdStock);

            // Unit
            const tdUnit = document.createElement('td');
            tdUnit.textContent = item.unit;
            tr.appendChild(tdUnit);

            // Actions
            const tdActions = document.createElement('td');
            const tableActions = document.createElement('div');
            tableActions.className = 'table-actions';
            
            const btnAdd = document.createElement('button');
            btnAdd.className = 'btn-icon success';
            const iAdd = document.createElement('i');
            iAdd.className = 'fa-solid fa-plus';
            btnAdd.appendChild(iAdd);
            btnAdd.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent('openAddStockModal', { detail: { item: item.original } }));
            });
            tableActions.appendChild(btnAdd);

            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn-icon warning';
            const iEdit = document.createElement('i');
            iEdit.className = 'fa-solid fa-pen';
            btnEdit.appendChild(iEdit);
            btnEdit.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent('openEditItemModal', { detail: { item: item.original } }));
            });
            tableActions.appendChild(btnEdit);
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-icon danger';
            const iDelete = document.createElement('i');
            iDelete.className = 'fa-solid fa-trash';
            btnDelete.appendChild(iDelete);
            btnDelete.addEventListener('click', () => {
                showConfirm(`Are you sure you want to delete ${item.name}?`, () => {
                    window.dispatchEvent(new CustomEvent('deleteItem', { detail: { id: item.original.id } }));
                });
            });
            tableActions.appendChild(btnDelete);
            
            tdActions.appendChild(tableActions);
            tr.appendChild(tdActions);

            tbody.appendChild(tr);
        });

        // Pagination Footer Update
        tableFooter.innerHTML = '';
        
        const tableInfo = document.createElement('span');
        tableInfo.className = 'table-info';
        const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
        const endDisplay = Math.min(endIndex, totalItems);
        tableInfo.textContent = `Showing ${startDisplay}-${endDisplay} of ${totalItems}`;
        tableFooter.appendChild(tableInfo);
        
        const pagination = document.createElement('div');
        pagination.className = 'pagination-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        if (currentPage <= 1) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.addEventListener('click', () => {
                currentPage--;
                renderPage();
            });
        }
        pagination.appendChild(prevBtn);
        
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + 2);
        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderPage();
            });
            pagination.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        if (currentPage >= totalPages) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.addEventListener('click', () => {
                currentPage++;
                renderPage();
            });
        }
        pagination.appendChild(nextBtn);
        
        tableFooter.appendChild(pagination);
    };

    renderPage();

    table.appendChild(tbody);
    tableResponsive.appendChild(table);
    tableContainer.appendChild(tableResponsive);
    tableContainer.appendChild(tableFooter);

    return tableContainer;
}
