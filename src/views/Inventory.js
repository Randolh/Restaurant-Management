import KpiGrid from '../components/inventory/KpiGrid.js';
import InventoryTable from '../components/inventory/InventoryTable.js';
import AddItemModal from '../components/inventory/AddItemModal.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        
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
        const dummyData = [
            { name: 'Tomato', icon: 'fa-apple-whole', stockText: '800/1000', stockPercent: '80%', progressClass: 'safe', progressWidth: '80%', unit: 'units' },
            { name: 'Sauce', icon: 'fa-bottle-droplet', stockText: '12/60', stockPercent: '20%', progressClass: 'danger', progressWidth: '20%', unit: 'kg' },
            { name: 'Cheese', icon: 'fa-cheese', stockText: '150/300', stockPercent: '50%', progressClass: 'warning', progressWidth: '50%', unit: 'Portions' },
            { name: 'Noodles', icon: 'fa-bowl-food', stockText: '5/8', stockPercent: '62%', progressClass: 'warning', progressWidth: '62%', unit: 'Pack' }
        ];
        pageContent.appendChild(InventoryTable(dummyData));

        wrapper.appendChild(pageContent);

        // --- 3. Modal ---
        wrapper.appendChild(AddItemModal());

        return wrapper;
    }
};
