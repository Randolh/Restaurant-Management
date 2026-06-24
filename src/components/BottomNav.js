import { t } from '../utils/i18n.js';

export default function BottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    const links = [
        { path: '/', icon: 'fa-house', text: t('nav.home') },
        { path: '/orders', icon: 'fa-receipt', text: t('nav.orders') },
        { path: '/dishes', icon: 'fa-utensils', text: t('nav.dishes') },
        { path: '/inventory', icon: 'fa-box', text: t('nav.inventory') },
        { path: '/settings', icon: 'fa-gear', text: t('nav.settings') }
    ];

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = '#' + link.path;
        a.className = 'bottom-nav-item';
        
        const i = document.createElement('i');
        i.className = `fa-solid ${link.icon}`;
        
        const span = document.createElement('span');
        span.textContent = link.text;
        
        a.appendChild(i);
        a.appendChild(span);
        
        nav.appendChild(a);
    });

    return nav;
}
