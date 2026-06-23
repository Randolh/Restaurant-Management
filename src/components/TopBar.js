export default function TopBar() {
    const header = document.createElement('header');
    header.className = 'top-bar';

    const label = document.createElement('label');
    label.htmlFor = 'sidebar-toggle-checkbox';
    label.className = 'sidebar-toggle';
    
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-chevron-right';
    label.appendChild(icon);

    header.appendChild(label);
    return header;
}
