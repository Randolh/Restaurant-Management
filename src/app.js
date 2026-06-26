import { router } from './router.js'
import Sidebar from './components/Sidebar.js'
import BottomNav from './components/BottomNav.js'
import TopBar from './components/TopBar.js'
import FloatingActionButton from './components/FloatingActionButton.js'
import Inventory from './views/Inventory.js'
import Dishes from './views/Dishes.js'
import Orders from './views/Orders.js'
import History from './views/History.js'
import Settings from './views/Settings.js'
import Login from './views/Login.js'
import AccessDenied from './views/AccessDenied.js'
import AddItemModal from './components/inventory/AddItemModal.js'
import AddDishModal from './components/dishes/AddDishModal.js'
import ViewDishModal from './components/dishes/ViewDishModal.js'
import AddOrderModal from './components/orders/AddOrderModal.js'
import { OrderDetailsModal } from './components/orders/OrderDetailsModal.js'
import { PaymentModal } from './components/orders/PaymentModal.js'
import { InvoiceModal } from './components/orders/InvoiceModal.js'
import { getLocal, setLocal, getSession, setSession, removeLocal, removeSession } from './utils/storage.js'
import { onEvent, emitEvent } from './utils/events.js'
import { t } from './utils/i18n.js'

// Define routes with requiresAuth flag
const routes = {
    '/': { component: Login, requiresAuth: false },
    '/inventory': { component: Inventory, requiresAuth: true },
    '/dishes': { component: Dishes, requiresAuth: true },
    '/orders': { component: Orders, requiresAuth: true },
    '/history': { component: History, requiresAuth: true },
    '/settings': { component: Settings, requiresAuth: true },
    '/login': { component: Login, requiresAuth: false },
    '/access-denied': { component: AccessDenied, requiresAuth: false },
}

const appContainer = document.getElementById('app')

const renderLayout = (isProtected) => {
    appContainer.replaceChildren()
    
    if (isProtected) {
        appContainer.appendChild(Sidebar())
        
        const mainContent = document.createElement('main')
        mainContent.id = 'mainContent'
        mainContent.className = 'main-content'

        mainContent.appendChild(TopBar())
        
        const pageContainer = document.createElement('div')
        pageContainer.id = 'page-container'
        mainContent.appendChild(pageContainer)
        
        appContainer.appendChild(mainContent)
        appContainer.appendChild(BottomNav())
        appContainer.appendChild(FloatingActionButton())
        appContainer.appendChild(AddItemModal())
        appContainer.appendChild(AddDishModal())
        appContainer.appendChild(ViewDishModal())
        appContainer.appendChild(AddOrderModal())
        appContainer.appendChild(OrderDetailsModal())
        appContainer.appendChild(PaymentModal())
        appContainer.appendChild(InvoiceModal())
        
        router.container = pageContainer;
    } else {
        const mainContent = document.createElement('main')
        mainContent.id = 'mainContent'
        
        const pageContainer = document.createElement('div')
        pageContainer.id = 'page-container'
        mainContent.appendChild(pageContainer)
        
        appContainer.appendChild(mainContent)
        
        router.container = pageContainer;
    }
}

// Subscribe to route changes to update layout if needed
window.onRouteChanged = (basePath, isProtected) => {
    const hasSidebar = !!document.getElementById('sidebar');
    
    if (isProtected && !hasSidebar) {
        renderLayout(true);
    } else if (!isProtected && hasSidebar) {
        renderLayout(false);
    }
    
    // Set active link states
    if (isProtected) {
        document.querySelectorAll('.fab-container').forEach(fab => {
            if (basePath === '/settings') {
                fab.classList.add('hide-on-desktop');
            } else {
                fab.classList.remove('hide-on-desktop');
            }
        });

        document.querySelectorAll('.nav-item').forEach(el => {
            if(el.getAttribute('href') === '#' + basePath) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        document.querySelectorAll('.bottom-nav-item').forEach(el => {
            if(el.getAttribute('href') === '#' + basePath) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }
}

const initializeSession = () => {
    // Set default credentials if not exists
    if (!getLocal('default_user')) {
        setLocal('default_user', {
            email: 'admin@restaurant.com',
            password: 'password123'
        });
        setLocal('first_time_login_alert', 'true');
    }




}

const setupEventListeners = () => {
    onEvent('auth:login', (e) => {
        const { email, password, nextUrl } = e.detail;
        const defaultUser = getLocal('default_user', true);
        
        if (defaultUser && email === defaultUser.email && password === defaultUser.password) {
            // Success
            setLocal('session_token', 'active');
            router.navigate(nextUrl);
        } else {
            // Failed
            emitEvent('auth:login-error', { message: t('login.error.invalid') });
        }
    });

    onEvent('auth:logout', () => {
        removeLocal('session_token');
        router.navigate('/login');
    });

    onEvent('langChanged', () => {
        const isProtected = !!getLocal('session_token'); // Check if protected to re-render layout
        renderLayout(isProtected);
        const currentPath = window.location.hash.replace('#', '') || '/';
        router.navigate(currentPath, false);
    });

    onEvent('currencyChanged', () => {
        const isProtected = !!getLocal('session_token');
        renderLayout(isProtected);
        const currentPath = window.location.hash.replace('#', '') || '/';
        router.navigate(currentPath, false);
    });
    onEvent('profileUpdated', () => {
        const profile = getLocal('restaurant_profile', true) || {};
        document.title = profile.name || 'Restaurant Management';
        
        const link = document.querySelector("link[rel~='icon']");
        if (link) {
            link.href = profile.logo || './favicon.svg';
        }
        
        const isProtected = !!getLocal('session_token');
        renderLayout(isProtected);
        const currentPath = window.location.hash.replace('#', '') || '/';
        router.navigate(currentPath, false);
    });
}

const initApp = () => {
    initializeSession()
    setupEventListeners()
    
    // Set initial title and favicon if exists
    const profile = getLocal('restaurant_profile', true) || {};
    if (profile.name) {
        document.title = profile.name;
    }
    const link = document.querySelector("link[rel~='icon']");
    if (link && profile.logo) {
        link.href = profile.logo;
    }
    
    // Initial render assumes unprotected layout (no header),  
    // router will update it via onRouteChanged before rendering the view
    renderLayout(false)
    
    const mainContent = document.getElementById('mainContent')
    // We pass router.container which was set by renderLayout
    router.init(routes, router.container)
}

document.addEventListener('DOMContentLoaded', initApp)
