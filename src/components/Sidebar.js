import { emitEvent } from '../utils/events.js';
import { getLocal } from '../utils/storage.js';
import { t } from '../utils/i18n.js';

export default function Sidebar() {
    const fragment = document.createDocumentFragment();

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'sidebar-toggle-checkbox';
    checkbox.className = 'sidebar-toggle-checkbox';
    fragment.appendChild(checkbox);

    const aside = document.createElement('aside');
    aside.className = 'sidebar';
    aside.id = 'sidebar';

    const header = document.createElement('div');
    header.className = 'sidebar-header';
    const logoDiv = document.createElement('div');
    logoDiv.className = 'sidebar-logo';
    const profile = getLocal('restaurant_profile', true) || {};
    
    const logoImg = document.createElement('img');
    logoImg.src = profile.logo || './favicon.svg';
    logoImg.alt = 'Restaurant Logo';
    // Small styling tweak if user uploads a logo to ensure it fits the box:
    logoImg.style.objectFit = 'contain';
    logoDiv.appendChild(logoImg);
    
    const h2 = document.createElement('h2');
    h2.textContent = profile.name || t('app.title');
    const h2Span = document.createElement('span');
    h2Span.textContent = profile.subtitle || t('app.subtitle');
    h2.appendChild(h2Span);
    
    const closeBtn = document.createElement('label');
    closeBtn.htmlFor = 'sidebar-toggle-checkbox';
    closeBtn.className = 'sidebar-close-btn';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-chevron-left';
    closeBtn.appendChild(closeIcon);
    
    header.appendChild(logoDiv);
    header.appendChild(h2);
    header.appendChild(closeBtn);
    aside.appendChild(header);

    const nav = document.createElement('nav');
    nav.className = 'sidebar-nav';

    const links = [
        { path: '/inventory', icon: 'fa-box', text: t('nav.inventory') },
        { path: '/dishes', icon: 'fa-utensils', text: t('nav.dishes') },
        { path: '/orders', icon: 'fa-receipt', text: t('nav.orders') },
        { path: '/history', icon: 'fa-clock-rotate-left', text: t('nav.history') }
    ];

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = '#' + link.path;
        a.className = 'nav-item';
        const i = document.createElement('i');
        i.className = `fa-solid ${link.icon}`;
        
        const span = document.createElement('span');
        span.textContent = link.text;
        
        a.appendChild(i);
        a.appendChild(span);
        
        nav.appendChild(a);
    });

    aside.appendChild(nav);

    const footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    
    const settingsLink = document.createElement('a');
    settingsLink.href = '#/settings';
    settingsLink.className = 'nav-item';
    const settingsIcon = document.createElement('i');
    settingsIcon.className = 'fa-solid fa-gear';
    const settingsSpan = document.createElement('span');
    settingsSpan.textContent = t('nav.settings');
    settingsLink.appendChild(settingsIcon);
    settingsLink.appendChild(settingsSpan);
    footer.appendChild(settingsLink);

    const logoutLink = document.createElement('a');
    logoutLink.href = 'javascript:void(0)';
    logoutLink.className = 'nav-item logout-item';
    const logoutIcon = document.createElement('i');
    logoutIcon.className = 'fa-solid fa-arrow-right-from-bracket';
    const logoutSpan = document.createElement('span');
    logoutSpan.textContent = t('nav.logout');
    logoutLink.appendChild(logoutIcon);
    logoutLink.appendChild(logoutSpan);
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        emitEvent('auth:logout');
    });
    footer.appendChild(logoutLink);

    aside.appendChild(footer);
    fragment.appendChild(aside);

    return fragment;
}
