import { t, getLang, setLang } from '../utils/i18n.js';
import { getLocal } from '../utils/storage.js';
import { emitEvent } from '../utils/events.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-content';
        
        wrapper.innerHTML = `
      <div class="page-header">
        <h1>${t('settings.title')}</h1>
      </div>

      <div class="settings-grid">
        
        <!-- General Profile -->
        <div class="settings-card">
          <div class="settings-card-header">
            <h3>${t('settings.profile.title')}</h3>
            <p>${t('settings.profile.desc')}</p>
          </div>
          
          <div class="settings-avatar-upload">
            <div class="settings-avatar">
              <i class="fa-solid fa-shop"></i>
            </div>
            <div style="flex: 1;">
              <label class="form-label">${t('settings.profile.logo')}</label>
              <input type="url" class="form-control" placeholder="https://example.com/logo.png">
              <p style="font-size: 12px; color: var(--color-text-variant); margin: 4px 0 0 0;">Paste a valid image URL (JPG, PNG)</p>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">${t('settings.profile.name')}</label>
            <input type="text" class="form-control" value="My Awesome Restaurant">
          </div>
          
          <div style="display: flex; justify-content: flex-end; margin-top: auto;">
            <button class="btn-primary">${t('btn.save')}</button>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="settings-card">
          <div class="settings-card-header">
            <h3>${t('settings.account')}</h3>
            <p>${getLocal('default_user', true)?.email || 'user@restaurant.com'}</p>
          </div>
          <div style="display: flex;">
            <button id="logout-btn" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> ${t('nav.logout')}
            </button>
          </div>
        </div>

        <!-- Preferences -->
        <div class="settings-card">
          <div class="settings-card-header">
            <h3>${t('settings.preferences')}</h3>
            <p>${t('settings.preferences.desc')}</p>
          </div>
          
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label class="form-label">${t('settings.language')}</label>
                <select id="lang-select" class="form-select" style="padding: 10px; border-radius: 8px; border: 1px solid var(--elevation-border-color); background: var(--elevation-2-bg); color: var(--color-text);">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label class="form-label">${t('settings.currency')}</label>
                <select class="form-select" style="padding: 10px; border-radius: 8px; border: 1px solid var(--elevation-border-color); background: var(--elevation-2-bg); color: var(--color-text);">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>MXN ($)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: flex-end; margin-top: auto;">
            <button class="btn-primary">${t('btn.save')}</button>
          </div>
        </div>

        <!-- Security -->
        <div class="settings-card">
          <div class="settings-card-header">
            <h3>${t('settings.security.title')}</h3>
            <p>${t('settings.security.desc')}</p>
          </div>
          
          <div class="form-group">
            <label class="form-label">${t('settings.security.current')}</label>
            <input type="password" class="form-control" placeholder="••••••••">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.security.new')}</label>
            <input type="password" class="form-control" placeholder="New Password">
          </div>
          <div class="form-group">
            <label class="form-label">${t('settings.security.confirm')}</label>
            <input type="password" class="form-control" placeholder="Confirm Password">
          </div>
          
          <div style="display: flex; justify-content: flex-end; margin-top: auto;">
            <button class="btn-primary">${t('btn.save')}</button>
          </div>
        </div>

        <!-- Data Management (Danger Zone) -->
        <div class="settings-card danger-zone">
          <div class="settings-card-header">
            <h3>${t('settings.data.title')}</h3>
            <p>${t('settings.data.desc')}</p>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
            <button class="btn-secondary" style="justify-content: flex-start; gap: 12px;">
              <i class="fa-solid fa-tags" style="width: 24px;"></i> ${t('settings.data.loadDefault')}
            </button>
            <button class="btn-secondary" style="justify-content: flex-start; gap: 12px;">
              <i class="fa-solid fa-database" style="width: 24px;"></i> ${t('settings.data.loadDummy')}
            </button>
          </div>
          
          <hr class="form-divider" style="margin: 16px 0; border-color: rgba(220, 20, 60, 0.2);">
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 13px; color: var(--color-text-variant); margin: 0;">${t('settings.data.warning')}</p>
            <button class="btn-danger">
              <i class="fa-solid fa-triangle-exclamation"></i> ${t('settings.data.wipe')}
            </button>
          </div>
        </div>

      </div>
        `;

        // Attach listeners
        const langSelect = wrapper.querySelector('#lang-select');
        if (langSelect) {
            langSelect.value = getLang();
            langSelect.addEventListener('change', (e) => {
                setLang(e.target.value);
            });
        }

        const logoutBtn = wrapper.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                emitEvent('auth:logout');
            });
        }

        return wrapper;
    }
}
