import { router } from './router.js'
import Header from './components/Header.js'
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
    
    // Only show header on protected routes
    if (isProtected) {
        appContainer.appendChild(Header())
    }
    
    const mainContent = document.createElement('main')
    mainContent.id = 'main-content'
    appContainer.appendChild(mainContent)
}

// Subscribe to route changes to update layout if needed
window.onRouteChanged = (basePath, isProtected) => {
    const currentHeader = document.querySelector('header');
    const hasHeader = !!currentHeader;
    
    if (isProtected && !hasHeader) {
        renderLayout(true);
        router.container = document.getElementById('main-content');
    } else if (!isProtected && hasHeader) {
        renderLayout(false);
        router.container = document.getElementById('main-content');
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
    
    const mainContent = document.getElementById('main-content')
    router.init(routes, mainContent)
}

document.addEventListener('DOMContentLoaded', initApp)
