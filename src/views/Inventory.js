import KpiGrid from '../components/inventory/KpiGrid.js';
import InventoryTable from '../components/inventory/InventoryTable.js';
import AddItemModal from '../components/inventory/AddItemModal.js';
import { INVENTORY_CATEGORIES } from '../utils/constants.js';
import { getLocal } from '../utils/storage.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'inventory-wrapper';
        
        // --- 1. Hidden checkbox for Modal ---
        const modalToggle = document.createElement('input');
        modalToggle.type = 'checkbox';
        modalToggle.id = 'add-item-modal-toggle';
        modalToggle.className = 'modal-toggle';
        modalToggle.hidden = true;
        wrapper.appendChild(modalToggle);

        // --- 2. Page Content ---
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';

        // Page Header
        const pageHeader = document.createElement('div');
        pageHeader.className = 'page-header';

        const h1 = document.createElement('h1');
        h1.textContent = 'Inventory';
        pageHeader.appendChild(h1);
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-primary';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-plus';
        addBtn.appendChild(icon);
        addBtn.appendChild(document.createTextNode(' Add Item'));
        addBtn.addEventListener('click', () => {
            const toggle = document.getElementById('add-item-modal-toggle');
            if (toggle) toggle.checked = true;
        });
        pageHeader.appendChild(addBtn);
        
        pageContent.appendChild(pageHeader);

        // KPI Grid
        const kpis = [
            { title: 'Total Items', value: '123' },
            { title: 'Low Stock', value: '12' },
            { title: 'Inventory Value', value: '$1234' }
        ];
        pageContent.appendChild(KpiGrid(kpis));

        // Data Table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'data-table-wrapper'; // A wrapper to hold the dynamic table
        tableContainer.style.display = 'flex';
        tableContainer.style.flexDirection = 'column';
        tableContainer.style.flex = '1';
        tableContainer.style.minHeight = '0';

        const updateTable = () => {
            const items = getLocal('inventoryItems', true) || [];
            
            const formattedData = items.map(item => ({
                name: item.name,
                icon: INVENTORY_CATEGORIES[item.category]?.icon || 'fa-box',
                stockText: item.stock || '0',
                stockPercent: '',
                progressClass: 'safe',
                progressWidth: '', 
                unit: item.unit
            }));

            tableContainer.innerHTML = '';
            
            if (formattedData.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.style.padding = '20px';
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.color = 'var(--color-text-variant)';
                emptyMessage.textContent = 'No items found in inventory. Click "Add Item" to start.';
                tableContainer.appendChild(emptyMessage);
            } else {
                tableContainer.appendChild(InventoryTable(formattedData));
            }
        };

        updateTable();
        pageContent.appendChild(tableContainer);

        // Listen for updates from AddItemModal
        window.addEventListener('inventoryUpdated', updateTable);

        wrapper.appendChild(pageContent);

        // --- 3. Modal ---
        wrapper.appendChild(AddItemModal());

        return wrapper;
    }
};
