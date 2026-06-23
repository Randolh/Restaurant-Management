export default function BottomNav() {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    const links = [
        { path: '/', icon: 'fa-house', text: 'Home' },
        { path: '/orders', icon: 'fa-receipt', text: 'Orders' },
        { path: '/dishes', icon: 'fa-utensils', text: 'Dishes' },
        { path: '/inventory', icon: 'fa-box', text: 'Inventory' },
        { path: '/settings', icon: 'fa-gear', text: 'Settings' }
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
