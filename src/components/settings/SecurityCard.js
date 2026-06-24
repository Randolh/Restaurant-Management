import { t } from '../../utils/i18n.js';

export const SecurityCard = () => {
    const securityCard = document.createElement('div');
    securityCard.className = 'settings-card';
    
    const securityHeader = document.createElement('div');
    securityHeader.className = 'settings-card-header';
    const secH3 = document.createElement('h3');
    secH3.textContent = t('settings.security.title');
    const secP = document.createElement('p');
    secP.textContent = t('settings.security.desc');
    securityHeader.appendChild(secH3);
    securityHeader.appendChild(secP);
    
    const curPassGroup = document.createElement('div');
    curPassGroup.className = 'form-group';
    const curPassLabel = document.createElement('label');
    curPassLabel.className = 'form-label';
    curPassLabel.textContent = t('settings.security.current');
    const curPassInput = document.createElement('input');
    curPassInput.type = 'password';
    curPassInput.className = 'form-control';
    curPassInput.placeholder = '••••••••';
    curPassGroup.appendChild(curPassLabel);
    curPassGroup.appendChild(curPassInput);
    
    const newPassGroup = document.createElement('div');
    newPassGroup.className = 'form-group';
    const newPassLabel = document.createElement('label');
    newPassLabel.className = 'form-label';
    newPassLabel.textContent = t('settings.security.new');
    const newPassInput = document.createElement('input');
    newPassInput.type = 'password';
    newPassInput.className = 'form-control';
    newPassInput.placeholder = 'New Password';
    newPassGroup.appendChild(newPassLabel);
    newPassGroup.appendChild(newPassInput);
    
    const confPassGroup = document.createElement('div');
    confPassGroup.className = 'form-group';
    const confPassLabel = document.createElement('label');
    confPassLabel.className = 'form-label';
    confPassLabel.textContent = t('settings.security.confirm');
    const confPassInput = document.createElement('input');
    confPassInput.type = 'password';
    confPassInput.className = 'form-control';
    confPassInput.placeholder = 'Confirm Password';
    confPassGroup.appendChild(confPassLabel);
    confPassGroup.appendChild(confPassInput);
    
    const secActions = document.createElement('div');
    secActions.style.display = 'flex';
    secActions.style.justifyContent = 'flex-end';
    secActions.style.marginTop = 'auto';
    const secSaveBtn = document.createElement('button');
    secSaveBtn.className = 'btn-primary';
    secSaveBtn.textContent = t('btn.save');
    secActions.appendChild(secSaveBtn);
    
    securityCard.appendChild(securityHeader);
    securityCard.appendChild(curPassGroup);
    securityCard.appendChild(newPassGroup);
    securityCard.appendChild(confPassGroup);
    securityCard.appendChild(secActions);

    return securityCard;
};
