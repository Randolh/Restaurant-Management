import KpiGrid from '../components/inventory/KpiGrid.js';
import InventoryTable from '../components/inventory/InventoryTable.js';
import AddItemModal from '../components/inventory/AddItemModal.js';
import AddStockModal from '../components/inventory/AddStockModal.js';
import { INVENTORY_CATEGORIES } from '../utils/constants.js';
import { getLocal, setLocal } from '../utils/storage.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'inventory-wrapper';
        


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

        // KPI Grid Container
        const kpiContainer = document.createElement('div');
        pageContent.appendChild(kpiContainer);

        // Data Table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'data-table-wrapper'; // A wrapper to hold the dynamic table
        tableContainer.style.display = 'flex';
        tableContainer.style.flexDirection = 'column';
        tableContainer.style.flex = '1';
        tableContainer.style.minHeight = '0';

        const updateTable = () => {
            const items = getLocal('inventoryItems', true) || [];
            
            // Filter out soft deleted items
            const activeItems = items.filter(item => !item.deleted);
            
            // Calculate KPIs
            const totalItems = activeItems.length;
            const lowStockItems = activeItems.filter(item => {
                const min = item.minStock !== undefined ? Number(item.minStock) : 50;
                return Number(item.stock || 0) < min;
            }).length;
            const inventoryValue = activeItems.reduce((acc, item) => {
                return acc + (Number(item.stock || 0) * Number(item.cost || 0));
            }, 0);

            kpiContainer.innerHTML = '';
            const kpis = [
                { title: 'Total Items', value: totalItems.toString() },
                { title: 'Low Stock', value: lowStockItems.toString() },
                { title: 'Inventory Value', value: `$${inventoryValue.toFixed(2)}` }
            ];
            kpiContainer.appendChild(KpiGrid(kpis));
            
            const formattedData = activeItems.map(item => {
                const stockVal = Number(item.stock || 0);
                const min = item.minStock !== undefined ? Number(item.minStock) : 50;
                
                // Calculate progress bar info
                let progressClass = 'safe';
                if (stockVal < min) progressClass = 'danger';
                else if (stockVal < min * 2.5) progressClass = 'warning';
                
                const maxTheoretical = min > 0 ? min * 5 : 100;
                const progressWidth = `${Math.min((stockVal / maxTheoretical) * 100, 100)}%`;
                const stockPercent = progressWidth;

                return {
                    original: item, // Pass original data for table actions
                    name: item.name,
                    icon: INVENTORY_CATEGORIES[item.category]?.icon || 'fa-box',
                    stockText: item.stock || '0',
                    stockPercent: stockPercent,
                    progressClass: progressClass,
                    progressWidth: progressWidth, 
                    unit: item.unit
                };
            });

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

        // --- Global Action Listeners ---
        window.addEventListener('openAddStockModal', (e) => {
            const item = e.detail.item;
            const title = document.getElementById('add-stock-modal-title');
            if (title) title.textContent = `Add Stock: ${item.name}`;
            
            const saveBtn = document.getElementById('add-stock-modal-save-btn');
            if (saveBtn) saveBtn.dataset.itemId = item.id;
            
            const toggle = document.getElementById('add-stock-modal-toggle');
            if (toggle) toggle.checked = true;
        });

        window.addEventListener('openEditItemModal', (e) => {
            const item = e.detail.item;
            
            const title = document.getElementById('add-item-modal-title');
            if (title) title.textContent = 'Edit Ingredient';
            
            document.getElementById('item-name').value = item.name;
            
            const catSelect = document.getElementById('category-select');
            if (catSelect) catSelect.value = item.category;
            
            const defaultCheck = document.getElementById('unit-default-checkbox');
            if (defaultCheck) {
                defaultCheck.checked = false; // Disable auto-sync for edit to preserve specific unit
                defaultCheck.dispatchEvent(new Event('change'));
            }
            
            const unitSelect = document.getElementById('unit-select');
            if (unitSelect) unitSelect.value = item.unit;
            
            document.getElementById('item-stock').value = item.stock;
            const minStockInput = document.getElementById('item-min-stock');
            if (minStockInput) minStockInput.value = item.minStock !== undefined ? item.minStock : 50;
            document.getElementById('item-cost').value = item.cost;
            
            const saveBtn = document.getElementById('add-item-modal-save-btn');
            if (saveBtn) {
                saveBtn.dataset.editId = item.id;
                saveBtn.textContent = 'Save Changes';
            }
            
            const toggle = document.getElementById('add-item-modal-toggle');
            if (toggle) toggle.checked = true;
        });

        window.addEventListener('deleteItem', (e) => {
            const id = e.detail.id;
            const items = getLocal('inventoryItems', true) || [];
            const index = items.findIndex(i => i.id == id);
            if (index !== -1) {
                items[index].deleted = true;
                setLocal('inventoryItems', items);
                window.dispatchEvent(new CustomEvent('inventoryUpdated'));
            }
        });

        wrapper.appendChild(pageContent);

        // --- 3. Modals ---
        wrapper.appendChild(AddItemModal());
        wrapper.appendChild(AddStockModal());

        return wrapper;
    }
};
