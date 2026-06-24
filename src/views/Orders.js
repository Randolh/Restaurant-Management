import { t } from '../utils/i18n.js';
import { emitEvent, onEvent } from '../utils/events.js';
import OrderKanban from '../components/orders/OrderKanban.js';
import AddOrderModal from '../components/orders/AddOrderModal.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'orders-wrapper';

        // Page Content
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';

        // Page Header
        const pageHeader = document.createElement('div');
        pageHeader.className = 'page-header';

        const h1 = document.createElement('h1');
        h1.textContent = t('orders.title');
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-primary';
        
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-plus';
        addBtn.appendChild(icon);
        addBtn.appendChild(document.createTextNode(' ' + t('orders.btn.new')));
        
        addBtn.addEventListener('click', () => {
            emitEvent('openAddOrderModal');
        });

        pageHeader.appendChild(h1);
        pageHeader.appendChild(addBtn);
        pageContent.appendChild(pageHeader);

        // Container for Kanban that can be re-rendered
        const kanbanWrapper = document.createElement('div');
        kanbanWrapper.className = 'kanban-wrapper';
        
        const updateView = () => {
            kanbanWrapper.replaceChildren(OrderKanban());
        };

        onEvent('ordersUpdated', updateView);
        
        // Initial render
        updateView();
        
        pageContent.appendChild(kanbanWrapper);
        wrapper.appendChild(pageContent);
        
        // Modal
        wrapper.appendChild(AddOrderModal());

        return wrapper;
    }
};
