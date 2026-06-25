import { t } from '../utils/i18n.js';
import { ProfileCard } from '../components/settings/ProfileCard.js';
import { AccountCard } from '../components/settings/AccountCard.js';
import { PreferencesCard } from '../components/settings/PreferencesCard.js';
import { SecurityCard } from '../components/settings/SecurityCard.js';
import { DangerZoneCard } from '../components/settings/DangerZoneCard.js';

export default {
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-content';
        
        const header = document.createElement('div');
        header.className = 'page-header';
        const h1 = document.createElement('h1');
        h1.textContent = t('settings.title');
        header.appendChild(h1);

        const grid = document.createElement('div');
        grid.className = 'settings-grid';

        // Assemble Grid with modular components
        grid.appendChild(ProfileCard());
        grid.appendChild(PreferencesCard());
        grid.appendChild(SecurityCard());
        grid.appendChild(DangerZoneCard());
        grid.appendChild(AccountCard());

        wrapper.appendChild(header);
        wrapper.appendChild(grid);

        return wrapper;
    }
}
