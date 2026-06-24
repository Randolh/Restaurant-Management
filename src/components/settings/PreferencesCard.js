import { t, getLang, setLang } from '../../utils/i18n.js';

export const PreferencesCard = () => {
    const prefsCard = document.createElement('div');
    prefsCard.className = 'settings-card';
    
    const prefsHeader = document.createElement('div');
    prefsHeader.className = 'settings-card-header';
    const prefsH3 = document.createElement('h3');
    prefsH3.textContent = t('settings.preferences');
    const prefsP = document.createElement('p');
    prefsP.textContent = t('settings.preferences.desc');
    prefsHeader.appendChild(prefsH3);
    prefsHeader.appendChild(prefsP);
    
    const formRow = document.createElement('div');
    formRow.className = 'form-row';
    
    // Language Col
    const langCol = document.createElement('div');
    langCol.className = 'form-col';
    const langGroup = document.createElement('div');
    langGroup.className = 'form-group';
    const langLabel = document.createElement('label');
    langLabel.className = 'form-label';
    langLabel.textContent = t('settings.language');
    
    const langSelect = document.createElement('select');
    langSelect.className = 'form-select';
    langSelect.style.padding = '10px';
    langSelect.style.borderRadius = '8px';
    langSelect.style.border = '1px solid var(--elevation-border-color)';
    langSelect.style.background = 'var(--elevation-2-bg)';
    langSelect.style.color = 'var(--color-text)';
    
    const enOpt = document.createElement('option');
    enOpt.value = 'en';
    enOpt.textContent = 'English';
    const esOpt = document.createElement('option');
    esOpt.value = 'es';
    esOpt.textContent = 'Español';
    langSelect.appendChild(enOpt);
    langSelect.appendChild(esOpt);
    
    langSelect.value = getLang();
    langSelect.addEventListener('change', (e) => {
        setLang(e.target.value);
    });
    
    langGroup.appendChild(langLabel);
    langGroup.appendChild(langSelect);
    langCol.appendChild(langGroup);
    
    // Currency Col
    const currCol = document.createElement('div');
    currCol.className = 'form-col';
    const currGroup = document.createElement('div');
    currGroup.className = 'form-group';
    const currLabel = document.createElement('label');
    currLabel.className = 'form-label';
    currLabel.textContent = t('settings.currency');
    
    const currSelect = document.createElement('select');
    currSelect.className = 'form-select';
    currSelect.style.padding = '10px';
    currSelect.style.borderRadius = '8px';
    currSelect.style.border = '1px solid var(--elevation-border-color)';
    currSelect.style.background = 'var(--elevation-2-bg)';
    currSelect.style.color = 'var(--color-text)';
    
    const usdOpt = document.createElement('option');
    usdOpt.textContent = 'USD ($)';
    const eurOpt = document.createElement('option');
    eurOpt.textContent = 'EUR (€)';
    const gbpOpt = document.createElement('option');
    gbpOpt.textContent = 'GBP (£)';
    const mxnOpt = document.createElement('option');
    mxnOpt.textContent = 'MXN ($)';
    
    currSelect.appendChild(usdOpt);
    currSelect.appendChild(eurOpt);
    currSelect.appendChild(gbpOpt);
    currSelect.appendChild(mxnOpt);
    
    currGroup.appendChild(currLabel);
    currGroup.appendChild(currSelect);
    currCol.appendChild(currGroup);
    
    formRow.appendChild(langCol);
    formRow.appendChild(currCol);
    
    const prefsActions = document.createElement('div');
    prefsActions.style.display = 'flex';
    prefsActions.style.justifyContent = 'flex-end';
    prefsActions.style.marginTop = 'auto';
    const prefsSaveBtn = document.createElement('button');
    prefsSaveBtn.className = 'btn-primary';
    prefsSaveBtn.textContent = t('btn.save');
    prefsActions.appendChild(prefsSaveBtn);
    
    prefsCard.appendChild(prefsHeader);
    prefsCard.appendChild(formRow);
    prefsCard.appendChild(prefsActions);

    return prefsCard;
};
