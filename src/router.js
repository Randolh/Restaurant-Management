import { getSession } from './utils/storage.js';

export const router = {
    routes: {},
    container: null,
    currentView: null,

    init(routes, container) {
        this.routes = routes;
        this.container = container;

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.navigate(this.getPath(), false));
        
        document.body.addEventListener('click', e => {
            const target = e.target.closest('[data-link]');
            if (target) {
                e.preventDefault();
                this.navigate(target.getAttribute('href'));
            }
        });
        
        // Initial load
        this.navigate(this.getPath(), false);
    },

    // Get current path from hash
    getPath() {
        return window.location.hash.slice(1) || '/';
    },

    isAuthenticated() {
        return getSession('session_token') === 'active';
    },

    async navigate(path, pushState = true) {
        // Normalize path to remove leading '#' if present
        if (path.startsWith('#')) {
            path = path.slice(1);
        }

        if (pushState) {
            window.location.hash = path;
            // The hashchange event will trigger and handle the actual rendering
            return;
        }

        // Separate base path from search parameters
        const [basePath, searchString] = path.split('?');
        const searchParams = new URLSearchParams(searchString || '');
        let routeObj = this.routes[basePath];
        let params = Object.fromEntries(searchParams.entries());

        // Find matches for dynamic routes with parameters
        if (!routeObj) {
            for (const route in this.routes) {
                if (route.includes('/:')) {
                    const regexPath = route.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)');
                    const regex = new RegExp('^' + regexPath + '$');
                    const match = basePath.match(regex);
                    if (match) {
                        routeObj = this.routes[route];
                        const paramNames = [...route.matchAll(/:([a-zA-Z0-9_]+)/g)].map(m => m[1]);
                        paramNames.forEach((name, index) => {
                            params[name] = match[index + 1];
                        });
                        break;
                    }
                }
            }
        }

        // Use root route as default if no match is found
        routeObj = routeObj || this.routes['/'];

        // AUTHENTICATION GUARD
        if (routeObj.requiresAuth && !this.isAuthenticated()) {
            // Redirect to login with 'next' parameter
            this.navigate(`/login?next=${encodeURIComponent(path)}`);
            return;
        }

        // Redirect away from login if already authenticated
        if (basePath === '/login' && this.isAuthenticated()) {
            this.navigate('/');
            return;
        }

        const ViewComponent = routeObj.component;

        // Unmount active view before changing
        if (this.currentView && typeof this.currentView.unmount === 'function') {
            this.currentView.unmount();
        }

        this.currentView = ViewComponent;

        // If there's an app layout hook, we can notify it so it can show/hide headers
        if (window.onRouteChanged) {
            window.onRouteChanged(basePath, routeObj.requiresAuth);
        }

        // Fade out animation
        this.container.classList.add('page-exit');
        await new Promise(resolve => setTimeout(resolve, 250)); // Wait for animation

        // Clear container and render new view
        this.container.replaceChildren(ViewComponent.render(params));

        // Execute component initialization if it exists
        if (typeof ViewComponent.mount === 'function') {
            await ViewComponent.mount(this.container, params);
        }

        // Trigger reflow and fade in
        void this.container.offsetWidth;
        this.container.classList.remove('page-exit');
    }
}
