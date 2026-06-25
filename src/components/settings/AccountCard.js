import { t } from '../../utils/i18n.js';
import { getLocal } from '../../utils/storage.js';
import { emitEvent } from '../../utils/events.js';
import { showLoader, hideLoader } from '../ui/GlobalLoader.js';

export const AccountCard = () => {
    const accountCard = document.createElement('div');
    accountCard.className = 'settings-card';
    
    const accountHeader = document.createElement('div');
    accountHeader.className = 'settings-card-header';
    const accountH3 = document.createElement('h3');
    accountH3.textContent = t('settings.account');
    const accountP = document.createElement('p');
    
    const defaultUser = getLocal('default_user', true);
    accountP.textContent = defaultUser ? defaultUser.email : 'user@restaurant.com';
    
    accountHeader.appendChild(accountH3);
    accountHeader.appendChild(accountP);
    
    const accountActionsBox = document.createElement('div');
    accountActionsBox.style.display = 'flex';
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-secondary';
    logoutBtn.style.display = 'inline-flex';
    logoutBtn.style.alignItems = 'center';
    logoutBtn.style.gap = '8px';
    const logoutIcon = document.createElement('i');
    logoutIcon.className = 'fa-solid fa-arrow-right-from-bracket';
    logoutBtn.appendChild(logoutIcon);
    logoutBtn.appendChild(document.createTextNode(' ' + t('nav.logout')));
    
    logoutBtn.addEventListener('click', () => {
        showLoader(t('nav.logout') + '...');
        
        setTimeout(() => {
            emitEvent('auth:logout');
            hideLoader();
        }, 800);
    });
    
    accountActionsBox.appendChild(logoutBtn);
    accountCard.appendChild(accountHeader);
    accountCard.appendChild(accountActionsBox);

    const developerInfo = document.createElement('div');
    developerInfo.style.marginTop = '16px';
    developerInfo.style.paddingTop = '16px';
    developerInfo.style.borderTop = '1px solid var(--elevation-border-color)';
    developerInfo.style.fontSize = '12px';
    developerInfo.style.color = 'var(--color-text-variant)';
    developerInfo.style.textAlign = 'center';
    developerInfo.appendChild(document.createTextNode('Developed by '));
    
    const devLink = document.createElement('a');
    devLink.href = 'https://github.com/Randolh';
    devLink.target = '_blank';
    devLink.style.color = 'var(--brand-primary)';
    devLink.style.textDecoration = 'none';
    devLink.style.fontWeight = '600';
    devLink.textContent = 'Randolh';
    
    developerInfo.appendChild(devLink);
    
    accountCard.appendChild(developerInfo);

    return accountCard;
};
