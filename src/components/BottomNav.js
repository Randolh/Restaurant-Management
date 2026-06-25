import { t } from '../utils/i18n.js';
import FloatingActionButton from './FloatingActionButton.js';

export default function BottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    const links = [
        { path: '/orders', icon: 'fa-receipt', text: t('nav.orders') },
        { path: '/history', icon: 'fa-clock-rotate-left', text: t('nav.history') },
        { path: '/dishes', icon: 'fa-utensils', text: t('nav.dishes') },
        { path: '/inventory', icon: 'fa-box', text: t('nav.inventory') }
    ];

    links.forEach((link, index) => {
        // Insert FAB exactly in the middle
        if (index === 2) {
            nav.appendChild(FloatingActionButton());
        }

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
