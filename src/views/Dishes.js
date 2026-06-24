import DishGrid from '../components/dishes/DishGrid.js';
import AddDishModal from '../components/dishes/AddDishModal.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { onEvent, emitEvent } from '../utils/events.js';
import { t } from '../utils/i18n.js';
import SearchBar from '../components/ui/SearchBar.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'dishes-wrapper';

        // --- Page Content ---
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';

        // Page Header
        const pageHeader = document.createElement('div');
        pageHeader.className = 'page-header';

        const h1 = document.createElement('h1');
        h1.textContent = t('dishes.title');
        pageHeader.appendChild(h1);
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-primary';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-plus';
        addBtn.appendChild(icon);
        addBtn.appendChild(document.createTextNode(' ' + t('btn.add')));
        addBtn.addEventListener('click', () => {
            emitEvent('openAddDishModal');
        });
        pageHeader.appendChild(addBtn);
        
        pageContent.appendChild(pageHeader);

        // Action Bar
        const actionBar = document.createElement('div');
        actionBar.className = 'action-bar';
        actionBar.style.display = 'flex';
        actionBar.style.marginBottom = 'var(--stack-md)';

        let searchQuery = '';
        
        const searchComponent = SearchBar({
            placeholder: t('dishes.search.placeholder'),
            onChange: (value) => {
                searchQuery = value;
                updateView();
            }
        });
        
        actionBar.appendChild(searchComponent);
        pageContent.appendChild(actionBar);

        // Data Container
        const dataContainer = document.createElement('div');
        dataContainer.style.display = 'flex';
        dataContainer.style.flexDirection = 'column';
        dataContainer.style.flex = '1';

        const updateView = () => {
            const dishes = getLocal('dishesItems', true) || [];
            
            const activeDishes = dishes.filter(d => !d.deleted);
            
            const filteredDishes = activeDishes.filter(dish => {
                if (searchQuery && !dish.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
            });
            
            dataContainer.innerHTML = '';
            
            if (filteredDishes.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.style.padding = '20px';
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.color = 'var(--color-text-variant)';
                emptyMessage.textContent = searchQuery ? t('table.searchEmpty') : t('table.empty');
                dataContainer.appendChild(emptyMessage);
            } else {
                dataContainer.appendChild(DishGrid(filteredDishes));
            }
        };

        updateView();
        pageContent.appendChild(dataContainer);

        // Listen for updates from AddDishModal
        onEvent('dishesUpdated', updateView);

        // --- Global Action Listeners ---
        onEvent('openAddDishModal', () => {
            const title = document.getElementById('add-dish-modal-title');
            if (title) title.textContent = t('dishModal.title.add');
            
            const saveBtn = document.getElementById('add-dish-modal-save-btn');
            if (saveBtn) {
                saveBtn.dataset.editId = '';
                saveBtn.textContent = t('btn.add');
            }
            
            document.getElementById('dish-name').value = '';
            document.getElementById('dish-category').value = 'Main Courses';
            document.getElementById('dish-price').value = '';
            document.getElementById('dish-image').value = '';
            document.getElementById('dish-desc').value = '';
            document.getElementById('dish-available').checked = true;

            const toggle = document.getElementById('add-dish-modal-toggle');
            if (toggle) toggle.checked = true;
        });

        onEvent('openEditDishModal', (e) => {
            const dish = e.detail.dish;
            
            const title = document.getElementById('add-dish-modal-title');
            if (title) title.textContent = t('dishModal.title.edit');
            
            document.getElementById('dish-name').value = dish.name;
            document.getElementById('dish-category').value = dish.category;
            document.getElementById('dish-price').value = dish.price;
            document.getElementById('dish-image').value = dish.image || '';
            document.getElementById('dish-desc').value = dish.description || '';
            document.getElementById('dish-available').checked = dish.isAvailable;
            
            const saveBtn = document.getElementById('add-dish-modal-save-btn');
            if (saveBtn) {
                saveBtn.dataset.editId = dish.id;
                saveBtn.textContent = t('btn.saveChanges');
            }
            
            const toggle = document.getElementById('add-dish-modal-toggle');
            if (toggle) toggle.checked = true;
        });

        onEvent('deleteDish', (e) => {
            const id = e.detail.id;
            const dishes = getLocal('dishesItems', true) || [];
            const index = dishes.findIndex(d => d.id == id);
            if (index !== -1) {
                dishes[index].deleted = true;
                setLocal('dishesItems', dishes, true);
                emitEvent('dishesUpdated');
            }
        });

        wrapper.appendChild(pageContent);
        wrapper.appendChild(AddDishModal());

        return wrapper;
    }
};
