import { t } from '../../utils/i18n.js';

export const ProfileCard = () => {
    const profileCard = document.createElement('div');
    profileCard.className = 'settings-card';
    
    const profileHeader = document.createElement('div');
    profileHeader.className = 'settings-card-header';
    const profileH3 = document.createElement('h3');
    profileH3.textContent = t('settings.profile.title');
    const profileP = document.createElement('p');
    profileP.textContent = t('settings.profile.desc');
    profileHeader.appendChild(profileH3);
    profileHeader.appendChild(profileP);
    
    const avatarUpload = document.createElement('div');
    avatarUpload.className = 'settings-avatar-upload';
    
    const avatarBox = document.createElement('div');
    avatarBox.className = 'settings-avatar';
    const avatarIcon = document.createElement('i');
    avatarIcon.className = 'fa-solid fa-shop';
    avatarBox.appendChild(avatarIcon);
    
    const avatarInputGroup = document.createElement('div');
    avatarInputGroup.style.flex = '1';
    
    const logoLabel = document.createElement('label');
    logoLabel.className = 'form-label';
    logoLabel.textContent = t('settings.profile.logo');
    
    const logoInput = document.createElement('input');
    logoInput.type = 'url';
    logoInput.className = 'form-control';
    logoInput.placeholder = 'https://example.com/logo.png';
    
    const logoHint = document.createElement('p');
    logoHint.textContent = t('settings.profile.logo.hint');
    logoHint.style.fontSize = '12px';
    logoHint.style.color = 'var(--color-text-variant)';
    logoHint.style.margin = '4px 0 0 0';
    
    avatarInputGroup.appendChild(logoLabel);
    avatarInputGroup.appendChild(logoInput);
    avatarInputGroup.appendChild(logoHint);
    
    avatarUpload.appendChild(avatarBox);
    avatarUpload.appendChild(avatarInputGroup);
    
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    const nameLabel = document.createElement('label');
    nameLabel.className = 'form-label';
    nameLabel.textContent = t('settings.profile.name');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'form-control';
    nameInput.placeholder = t('settings.profile.name.placeholder');
    nameInput.value = 'My Awesome Restaurant'; // Can keep a default value, or set value from storage later
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    
    const profileActions = document.createElement('div');
    profileActions.style.display = 'flex';
    profileActions.style.justifyContent = 'flex-end';
    profileActions.style.marginTop = 'auto';
    const profileSaveBtn = document.createElement('button');
    profileSaveBtn.className = 'btn-primary';
    profileSaveBtn.textContent = t('btn.save');
    profileActions.appendChild(profileSaveBtn);
    
    profileCard.appendChild(profileHeader);
    profileCard.appendChild(avatarUpload);
    profileCard.appendChild(nameGroup);
    profileCard.appendChild(profileActions);

    return profileCard;
};
