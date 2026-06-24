import { t } from '../../utils/i18n.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { emitEvent } from '../../utils/events.js';
import showToast from '../ui/Toast.js';

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
    
    let isLogoValid = true;
    const avatarBox = document.createElement('div');
    avatarBox.className = 'settings-avatar';

    const renderAvatarPreview = (url) => {
        avatarBox.textContent = '';
        if (url) {
            const img = document.createElement('img');
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '8px';
            
            img.onload = () => {
                isLogoValid = true;
                avatarBox.appendChild(img);
            };
            
            img.onerror = () => {
                isLogoValid = false;
                const errorIcon = document.createElement('i');
                errorIcon.className = 'fa-solid fa-triangle-exclamation';
                errorIcon.style.color = 'var(--color-warning)';
                avatarBox.appendChild(errorIcon);
            };
            
            img.src = url;
        } else {
            isLogoValid = true;
            const avatarIcon = document.createElement('i');
            avatarIcon.className = 'fa-solid fa-shop';
            avatarBox.appendChild(avatarIcon);
        }
    };
    
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
    nameInput.maxLength = 16;
    
    const subtitleGroup = document.createElement('div');
    subtitleGroup.className = 'form-group';
    const subtitleLabel = document.createElement('label');
    subtitleLabel.className = 'form-label';
    subtitleLabel.textContent = t('settings.profile.subtitle');
    const subtitleInput = document.createElement('input');
    subtitleInput.type = 'text';
    subtitleInput.className = 'form-control';
    subtitleInput.placeholder = t('settings.profile.subtitle.placeholder');
    subtitleInput.maxLength = 18;
    
    // Set initial values
    const profile = getLocal('restaurant_profile', true) || {};
    nameInput.value = profile.name || '';
    subtitleInput.value = profile.subtitle || '';
    logoInput.value = profile.logo || '';
    
    renderAvatarPreview(profile.logo || '');
    
    logoInput.addEventListener('input', (e) => {
        renderAvatarPreview(e.target.value.trim());
    });
    
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    
    subtitleGroup.appendChild(subtitleLabel);
    subtitleGroup.appendChild(subtitleInput);
    
    const profileActions = document.createElement('div');
    profileActions.style.display = 'flex';
    profileActions.style.justifyContent = 'flex-end';
    profileActions.style.marginTop = 'auto';
    const profileSaveBtn = document.createElement('button');
    profileSaveBtn.className = 'btn-primary';
    profileSaveBtn.textContent = t('btn.save');
    
    profileSaveBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const subtitle = subtitleInput.value.trim();
        const logo = logoInput.value.trim();
        
        if (logo && !isLogoValid) {
            showToast(t('settings.profile.logo.error'), 'error');
            return;
        }
        
        setLocal('restaurant_profile', { name, subtitle, logo }, true);
        showToast(t('settings.profile.success'), 'success');
        emitEvent('profileUpdated');
    });
    
    profileActions.appendChild(profileSaveBtn);
    
    profileCard.appendChild(profileHeader);
    profileCard.appendChild(avatarUpload);
    profileCard.appendChild(nameGroup);
    profileCard.appendChild(subtitleGroup);
    profileCard.appendChild(profileActions);

    return profileCard;
};
