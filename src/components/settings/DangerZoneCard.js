import { t } from '../../utils/i18n.js';
import { removeLocal, setLocal } from '../../utils/storage.js';
import { getDummyData } from '../../utils/dummyData.js';
import { DEFAULT_PROFIT_MARGIN, DEFAULT_TAX_RATE } from '../../utils/constants.js';
import showToast from '../ui/Toast.js';
import showConfirm from '../ui/ConfirmModal.js';

export const DangerZoneCard = () => {
    const dangerCard = document.createElement('div');
    dangerCard.className = 'settings-card danger-zone';
    
    const dangerHeader = document.createElement('div');
    dangerHeader.className = 'settings-card-header';
    const dangerH3 = document.createElement('h3');
    dangerH3.textContent = t('settings.data.title');
    const dangerP = document.createElement('p');
    dangerP.textContent = t('settings.data.desc');
    dangerHeader.appendChild(dangerH3);
    dangerHeader.appendChild(dangerP);
    
    const devToolsBox = document.createElement('div');
    devToolsBox.style.display = 'flex';
    devToolsBox.style.flexDirection = 'column';
    devToolsBox.style.gap = '12px';
    devToolsBox.style.marginTop = '8px';
    

    const loadDumBtn = document.createElement('button');
    loadDumBtn.className = 'btn-secondary';
    loadDumBtn.style.justifyContent = 'flex-start';
    loadDumBtn.style.gap = '12px';
    const dbIcon = document.createElement('i');
    dbIcon.className = 'fa-solid fa-database';
    dbIcon.style.width = '24px';
    loadDumBtn.appendChild(dbIcon);
    loadDumBtn.appendChild(document.createTextNode(' ' + t('settings.data.loadDummy')));
    
    devToolsBox.appendChild(loadDumBtn);
    
    loadDumBtn.addEventListener('click', () => {
        showConfirm(t('settings.data.warning') + ' (Load Dummy Data)', () => {
            const { dummyInventory, dummyDishes, dummyOrders } = getDummyData();
            setLocal('inventoryItems', dummyInventory);
            setLocal('dishesItems', dummyDishes);
            setLocal('ordersItems', dummyOrders);
            setLocal('appProfitMargin', DEFAULT_PROFIT_MARGIN.toString());
            setLocal('appTaxRate', DEFAULT_TAX_RATE.toString());
            showToast('Datos de prueba cargados', 'success');
            setTimeout(() => window.location.reload(), 1000);
        });
    });
    
    const divider = document.createElement('hr');
    divider.className = 'form-divider';
    divider.style.margin = '16px 0';
    divider.style.borderColor = 'rgba(220, 20, 60, 0.2)';
    
    const wipeBox = document.createElement('div');
    wipeBox.style.display = 'flex';
    wipeBox.style.flexDirection = 'column';
    wipeBox.style.gap = '12px';
    
    const wipeWarning = document.createElement('p');
    wipeWarning.textContent = t('settings.data.warning');
    wipeWarning.style.fontSize = '13px';
    wipeWarning.style.color = 'var(--color-text-variant)';
    wipeWarning.style.margin = '0';
    
    const wipeBtn = document.createElement('button');
    wipeBtn.className = 'btn-danger';
    const wipeIcon = document.createElement('i');
    wipeIcon.className = 'fa-solid fa-triangle-exclamation';
    wipeBtn.appendChild(wipeIcon);
    wipeBtn.appendChild(document.createTextNode(' ' + t('settings.data.wipe')));
    
    wipeBox.appendChild(wipeWarning);
    wipeBox.appendChild(wipeBtn);
    
    wipeBtn.addEventListener('click', () => {
        showConfirm(t('settings.data.warning'), () => {
            removeLocal('inventoryItems');
            removeLocal('dishesItems');
            removeLocal('ordersItems');
            removeLocal('appProfitMargin');
            removeLocal('appTaxRate');
            showToast('Datos eliminados', 'success');
            setTimeout(() => window.location.reload(), 1000);
        });
    });
    
    dangerCard.appendChild(dangerHeader);
    dangerCard.appendChild(devToolsBox);
    dangerCard.appendChild(divider);
    dangerCard.appendChild(wipeBox);

    return dangerCard;
};
