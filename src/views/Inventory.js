import KpiGrid from '../components/inventory/KpiGrid.js';
import InventoryTable from '../components/inventory/InventoryTable.js';
import AddItemModal from '../components/inventory/AddItemModal.js';
import AddStockModal from '../components/inventory/AddStockModal.js';
import { INVENTORY_CATEGORIES } from '../utils/constants.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { onEvent, emitEvent } from '../utils/events.js';
import { t, formatCurrency } from '../utils/i18n.js';
import SearchBar from '../components/ui/SearchBar.js';
import showToast from '../components/ui/Toast.js';

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
        h1.textContent = t('inventory.title');
        pageHeader.appendChild(h1);
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-primary';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-plus';
        addBtn.appendChild(icon);
        addBtn.appendChild(document.createTextNode(' ' + t('btn.add')));
        addBtn.addEventListener('click', () => {
            emitEvent('openAddItemModal');
        });
        pageHeader.appendChild(addBtn);
        
        pageContent.appendChild(pageHeader);

        // KPI Grid Container
        const kpiContainer = document.createElement('div');
        pageContent.appendChild(kpiContainer);

        // Action Bar
        const actionBar = document.createElement('div');
        actionBar.className = 'action-bar dishes-action-bar';

        let searchQuery = '';
        let filterLowStock = false;
        let filterCategory = 'all';
        
        const searchComponent = SearchBar({
            placeholder: t('inventory.search.placeholder'),
            onChange: (value) => {
                searchQuery = value;
                updateTable();
            }
        });
        searchComponent.style.flex = '1';
        
        const filterSelect = document.createElement('select');
        filterSelect.className = 'form-control filter-select';
        
        const updateFilterOptions = () => {
            filterSelect.textContent = '';
            
            const allOpt = document.createElement('option');
            allOpt.value = 'all';
            allOpt.textContent = t('filter.allCategories') || 'All Categories';
            filterSelect.appendChild(allOpt);

            Object.keys(INVENTORY_CATEGORIES).forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = t('cat.' + cat) || cat;
                filterSelect.appendChild(opt);
            });
            
            filterSelect.value = filterCategory;
        };
        updateFilterOptions();
        onEvent('langChanged', updateFilterOptions);

        filterSelect.addEventListener('change', (e) => {
            filterCategory = e.target.value;
            updateTable();
        });
        
        actionBar.appendChild(searchComponent);
        actionBar.appendChild(filterSelect);
        pageContent.appendChild(actionBar);

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

            kpiContainer.textContent = '';
            const kpis = [
                { title: t('inventory.kpi.total'), value: totalItems.toString() },
                { 
                    title: t('inventory.kpi.lowStock'), 
                    value: lowStockItems.toString(),
                    clickable: true,
                    active: filterLowStock,
                    onClick: () => {
                        filterLowStock = !filterLowStock;
                        updateTable();
                    }
                },
                { title: t('inventory.kpi.value'), value: formatCurrency(inventoryValue) }
            ];
            kpiContainer.appendChild(KpiGrid(kpis));
            
            const filteredItems = activeItems.filter(item => {
                if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                
                if (filterCategory !== 'all' && item.category !== filterCategory) return false;
                
                if (filterLowStock) {
                    const min = item.minStock !== undefined ? Number(item.minStock) : 50;
                    if (Number(item.stock || 0) >= min) return false;
                }
                
                return true;
            });
            
            const formattedData = filteredItems.map(item => {
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

            tableContainer.textContent = '';
            
            if (formattedData.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.style.padding = '20px';
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.color = 'var(--color-text-variant)';
                emptyMessage.textContent = searchQuery ? t('table.searchEmpty') : t('table.empty');
                tableContainer.appendChild(emptyMessage);
            } else {
                tableContainer.appendChild(InventoryTable(formattedData));
            }
        };

        updateTable();
        pageContent.appendChild(tableContainer);

        // Listen for updates from AddItemModal
        onEvent('inventoryUpdated', updateTable);

        // --- Global Action Listeners ---
        onEvent('openAddStockModal', (e) => {
            const item = e.detail.item;
            const title = document.getElementById('add-stock-modal-title');
            if (title) title.textContent = t('stockModal.title', { name: item.name });
            
            const saveBtn = document.getElementById('add-stock-modal-save-btn');
            if (saveBtn) saveBtn.dataset.itemId = item.id;
            
            const toggle = document.getElementById('add-stock-modal-toggle');
            if (toggle) toggle.checked = true;
        });

        onEvent('openAddItemModal', () => {
            const title = document.getElementById('add-item-modal-title');
            if (title) title.textContent = t('itemModal.title.add');
            
            const saveBtn = document.getElementById('add-item-modal-save-btn');
            if (saveBtn) {
                saveBtn.dataset.editId = '';
                saveBtn.textContent = t('btn.add');
            }
            
            const nameInput = document.getElementById('item-name');
            if (nameInput) nameInput.value = '';
            
            const stockInput = document.getElementById('item-stock');
            if (stockInput) stockInput.value = '';
            
            const minStockInput = document.getElementById('item-min-stock');
            if (minStockInput) minStockInput.value = '50';
            
            const costInput = document.getElementById('item-cost');
            if (costInput) costInput.value = '';
            
            const catSelect = document.getElementById('category-select');
            if (catSelect) catSelect.value = 'Other';

            const defaultCheck = document.getElementById('unit-default-checkbox');
            if (defaultCheck) {
                defaultCheck.checked = true;
                defaultCheck.dispatchEvent(new Event('change'));
            }

            const toggle = document.getElementById('add-item-modal-toggle');
            if (toggle) toggle.checked = true;
        });

        onEvent('openEditItemModal', (e) => {
            const item = e.detail.item;
            
            const title = document.getElementById('add-item-modal-title');
            if (title) title.textContent = t('itemModal.title.edit');
            
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
                saveBtn.textContent = t('btn.saveChanges');
            }
            
            const toggle = document.getElementById('add-item-modal-toggle');
            if (toggle) toggle.checked = true;
        });

        onEvent('deleteItem', (e) => {
            const id = e.detail.id;
            const items = getLocal('inventoryItems', true) || [];
            const index = items.findIndex(i => i.id == id);
            
            if (index !== -1) {
                // Check for conflicts with dishes
                const dishes = getLocal('dishesItems', true) || [];
                const affectedDishes = dishes.filter(d => !d.deleted && (d.recipe || []).some(r => r.id == id));
                
                if (affectedDishes.length > 0) {
                    const msg = t('inventory.warning.inUse', { count: affectedDishes.length });
                    showToast(msg, 'warning');
                }
                
                items.splice(index, 1);
                setLocal('inventoryItems', items);
                emitEvent('inventoryUpdated');
                emitEvent('dishesUpdated'); // trigger dish view update to show warnings
            }
        });

        wrapper.appendChild(pageContent);

        // --- 3. Modals ---
        wrapper.appendChild(AddItemModal());
        wrapper.appendChild(AddStockModal());

        return wrapper;
    }
};
