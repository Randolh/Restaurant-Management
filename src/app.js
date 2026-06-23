import { router } from './router.js'
import Sidebar from './components/Sidebar.js'
import BottomNav from './components/BottomNav.js'
import TopBar from './components/TopBar.js'
import Home from './views/Home.js'
import Login from './views/Login.js'
import AccessDenied from './views/AccessDenied.js'
import { getLocal, setLocal, setSession, removeLocal, removeSession } from './utils/storage.js'
import { onEvent, emitEvent } from './utils/events.js'

// Define routes with requiresAuth flag
const routes = {
    '/': { component: Home, requiresAuth: true },
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
        
        router.container = pageContainer;
    } else {
        const mainContent = document.createElement('main')
        mainContent.id = 'mainContent'
        appContainer.appendChild(mainContent)
        
        router.container = mainContent;
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
    }

    // Check if user requested to stay logged in
    if (getLocal('keep_logged_in') === 'true') {
        setSession('session_token', 'active');
    }
}

const setupEventListeners = () => {
    onEvent('auth:login', (e) => {
        const { email, password, remember, nextUrl } = e.detail;
        const defaultUser = getLocal('default_user', true);
        
        if (defaultUser && email === defaultUser.email && password === defaultUser.password) {
            // Success
            setSession('session_token', 'active');
            if (remember) {
                setLocal('keep_logged_in', 'true');
            }
            router.navigate(nextUrl);
        } else {
            // Failed
            emitEvent('auth:login-error', { message: 'Invalid email or password.' });
        }
    });

    onEvent('auth:logout', () => {
        removeSession('session_token');
        removeLocal('keep_logged_in');
        router.navigate('/login');
    });
}

const initApp = () => {
    initializeSession()
    setupEventListeners()
    
    // Initial render assumes unprotected layout (no header), 
    // router will update it via onRouteChanged before rendering the view
    renderLayout(false)
    
    const mainContent = document.getElementById('mainContent')
    // We pass router.container which was set by renderLayout
    router.init(routes, router.container)
}

document.addEventListener('DOMContentLoaded', initApp)
