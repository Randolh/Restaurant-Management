import { emitEvent } from '../utils/events.js';

export default function Header() {
    const header = document.createElement('header');
    
    const nav = document.createElement('nav');
    
    const title = document.createElement('h1');
    title.textContent = 'Restaurant Management';
    nav.appendChild(title);

    const ul = document.createElement('ul');
    
    const homeLi = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.textContent = 'Home';
    homeLink.setAttribute('data-link', '');
    homeLi.appendChild(homeLink);
    
    const logoutLi = document.createElement('li');
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'btn-secondary';
    logoutBtn.style.padding = '4px 12px';
    logoutBtn.addEventListener('click', () => {
        emitEvent('auth:logout');
    });
    logoutLi.appendChild(logoutBtn);

    ul.appendChild(homeLi);
    ul.appendChild(logoutLi);
    nav.appendChild(ul);
    
    header.appendChild(nav);
    return header;
}
