import DishGrid from '../components/dishes/DishGrid.js';
import AddDishModal from '../components/dishes/AddDishModal.js';
import ViewDishModal from '../components/dishes/ViewDishModal.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { onEvent, emitEvent } from '../utils/events.js';
import { DISH_CATEGORIES } from '../utils/constants.js';
import { t } from '../utils/i18n.js';
import SearchBar from '../components/ui/SearchBar.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'dishes-wrapper';

        // --- Page Content ---
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';

        // Sticky Container for Header and Actions
        const stickyHeader = document.createElement('div');
        stickyHeader.className = 'sticky-header';

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
        addBtn.appendChild(document.createTextNode(' ' + t('dishes.btn.add')));
        addBtn.addEventListener('click', () => {
            emitEvent('openAddDishModal');
        });
        pageHeader.appendChild(addBtn);
        
        stickyHeader.appendChild(pageHeader);

        // Action Bar
        const actionBar = document.createElement('div');
        actionBar.className = 'action-bar dishes-action-bar';

        let searchQuery = '';
        let filterStatus = 'all';
        let filterCategory = 'all';
        
        const searchComponent = SearchBar({
            placeholder: t('dishes.search.placeholder'),
            onChange: (value) => {
                searchQuery = value;
                updateView();
            }
        });
        searchComponent.style.flex = '1';
        
        const filterStatusSelect = document.createElement('select');
        filterStatusSelect.className = 'form-control filter-select';
        
        const filterCatSelect = document.createElement('select');
        filterCatSelect.className = 'form-control filter-select';
        
        const updateFilterOptions = () => {
            // Status Options
            filterStatusSelect.textContent = '';
            const statusOptions = [
                { value: 'all', text: t('filter.all') || 'All Dishes' },
                { value: 'available', text: t('dishes.kpi.available') || 'Available' },
                { value: 'unavailable', text: t('dishes.kpi.unavailable') || 'Out of Stock' },
                { value: 'alert', text: t('filter.alert') || 'With Warnings' }
            ];
            statusOptions.forEach(opt => {
                const optionEl = document.createElement('option');
                optionEl.value = opt.value;
                optionEl.textContent = opt.text;
                filterStatusSelect.appendChild(optionEl);
            });
            filterStatusSelect.value = filterStatus;
            
            // Category Options
            filterCatSelect.textContent = '';
            const allCatOpt = document.createElement('option');
            allCatOpt.value = 'all';
            allCatOpt.textContent = t('filter.allCategories') || 'All Categories';
            filterCatSelect.appendChild(allCatOpt);
            
            Object.keys(DISH_CATEGORIES).forEach(key => {
                const catInfo = DISH_CATEGORIES[key];
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = t(catInfo.labelKey) || key;
                filterCatSelect.appendChild(opt);
            });
            filterCatSelect.value = filterCategory;
        };
        updateFilterOptions();
        
        onEvent('langChanged', updateFilterOptions);
        
        filterStatusSelect.addEventListener('change', (e) => {
            filterStatus = e.target.value;
            updateView();
        });
        
        filterCatSelect.addEventListener('change', (e) => {
            filterCategory = e.target.value;
            updateView();
        });
        
        actionBar.appendChild(searchComponent);
        actionBar.appendChild(filterCatSelect);
        actionBar.appendChild(filterStatusSelect);
        
        stickyHeader.appendChild(actionBar);
        pageContent.appendChild(stickyHeader);

        // Data Container
        const dataContainer = document.createElement('div');
        dataContainer.className = 'dishes-data-container';

        const updateView = () => {
            const dishes = getLocal('dishesItems', true) || [];
            const inventoryItems = getLocal('inventoryItems', true) || [];
            
            const activeDishes = dishes.filter(d => !d.deleted);
            
            const filteredDishes = activeDishes.filter(dish => {
                if (searchQuery && !dish.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                
                if (filterCategory !== 'all' && dish.category !== filterCategory) return false;
                
                if (filterStatus === 'available' && !dish.isAvailable) return false;
                if (filterStatus === 'unavailable' && dish.isAvailable) return false;
                
                if (filterStatus === 'alert') {
                    const hasWarning = (dish.recipe || []).some(recipeItem => {
                        const invItem = inventoryItems.find(i => i.id === recipeItem.id);
                        return !invItem || invItem.deleted;
                    });
                    if (!hasWarning) return false;
                }
                
                return true;
            });
            
            dataContainer.textContent = '';
            
            if (filteredDishes.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
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

        onEvent('deleteDish', (e) => {
            const id = e.detail.id;
            const dishes = getLocal('dishesItems', true) || [];
            const index = dishes.findIndex(d => d.id == id);
            if (index !== -1) {
                dishes.splice(index, 1);
                setLocal('dishesItems', dishes, true);
                emitEvent('dishesUpdated');
            }
        });

        wrapper.appendChild(pageContent);


        return wrapper;
    }
};
