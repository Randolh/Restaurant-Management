export default function TopBar() {
    const header = document.createElement('header');
    header.className = 'top-bar';

    const label = document.createElement('label');
    label.htmlFor = 'sidebar-toggle-checkbox';
    label.className = 'sidebar-toggle';
    
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-chevron-right';
    label.appendChild(icon);

    const settingsLink = document.createElement('a');
    settingsLink.href = '#/settings';
    settingsLink.className = 'top-bar-settings';
    
    const settingsIcon = document.createElement('i');
    settingsIcon.className = 'fa-solid fa-gear';
    settingsLink.appendChild(settingsIcon);

    header.appendChild(label);
    header.appendChild(settingsLink);
    
    return header;
}
