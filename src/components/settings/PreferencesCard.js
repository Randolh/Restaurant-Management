import { t, getLang, setLang, getCurrency, setCurrency } from '../../utils/i18n.js';
import { CURRENCIES, DEFAULT_PROFIT_MARGIN, DEFAULT_TAX_RATE } from '../../utils/constants.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import showToast from '../ui/Toast.js';

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
    formRow.style.display = 'flex';
    formRow.style.flexDirection = 'column';
    formRow.style.gap = 'var(--stack-md)';
    formRow.style.marginBottom = 'var(--stack-md)';
    
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
    
    CURRENCIES.forEach(curr => {
        const opt = document.createElement('option');
        opt.value = curr.code;
        opt.textContent = curr.label;
        currSelect.appendChild(opt);
    });
    
    currSelect.value = getCurrency();
    
    currGroup.appendChild(currLabel);
    currGroup.appendChild(currSelect);
    currCol.appendChild(currGroup);
    
    formRow.appendChild(langCol);
    formRow.appendChild(currCol);
    
    // Profit Margin Col
    const marginCol = document.createElement('div');
    marginCol.className = 'form-col';
    const marginGroup = document.createElement('div');
    marginGroup.className = 'form-group';
    const marginLabel = document.createElement('label');
    marginLabel.className = 'form-label';
    marginLabel.textContent = t('settings.profitMargin') || 'Profit Margin (%)';
    
    const marginInput = document.createElement('input');
    marginInput.type = 'number';
    marginInput.className = 'form-control';
    marginInput.min = '0';
    marginInput.step = '1';
    
    const savedMargin = getLocal('appProfitMargin', false);
    const currentMargin = savedMargin !== null ? parseFloat(savedMargin) : DEFAULT_PROFIT_MARGIN;
    marginInput.value = Math.round(currentMargin * 100);
    
    marginGroup.appendChild(marginLabel);
    marginGroup.appendChild(marginInput);
    marginCol.appendChild(marginGroup);
    
    formRow.appendChild(marginCol);
    
    // Tax Rate Col
    const taxCol = document.createElement('div');
    taxCol.className = 'form-col';
    const taxGroup = document.createElement('div');
    taxGroup.className = 'form-group';
    const taxLabel = document.createElement('label');
    taxLabel.className = 'form-label';
    taxLabel.textContent = t('settings.taxRate') || 'Tax Rate (%)';
    
    const taxInput = document.createElement('input');
    taxInput.type = 'number';
    taxInput.className = 'form-control';
    taxInput.min = '0';
    taxInput.step = '1';
    
    const savedTax = getLocal('appTaxRate', false);
    const currentTax = savedTax !== null ? parseFloat(savedTax) : DEFAULT_TAX_RATE;
    taxInput.value = Math.round(currentTax * 100);
    
    taxGroup.appendChild(taxLabel);
    taxGroup.appendChild(taxInput);
    taxCol.appendChild(taxGroup);
    
    formRow.appendChild(taxCol);
    
    const prefsActions = document.createElement('div');
    prefsActions.style.display = 'flex';
    prefsActions.style.justifyContent = 'flex-end';
    prefsActions.style.marginTop = 'auto';
    const prefsSaveBtn = document.createElement('button');
    prefsSaveBtn.className = 'btn-primary';
    prefsSaveBtn.textContent = t('btn.save');
    
    prefsSaveBtn.addEventListener('click', () => {
        setLang(langSelect.value);
        setCurrency(currSelect.value);
        
        const marginVal = parseFloat(marginInput.value) / 100;
        const taxVal = parseFloat(taxInput.value) / 100;
        
        let saved = false;
        if (!isNaN(marginVal) && marginVal >= 0) {
            setLocal('appProfitMargin', marginVal.toString(), false);
            saved = true;
        }
        if (!isNaN(taxVal) && taxVal >= 0) {
            setLocal('appTaxRate', taxVal.toString(), false);
            saved = true;
        }
        
        if (saved) {
            showToast(t('settings.profile.success') || 'Settings saved successfully');
        }
    });
    
    prefsActions.appendChild(prefsSaveBtn);
    
    prefsCard.appendChild(prefsHeader);
    prefsCard.appendChild(formRow);
    prefsCard.appendChild(prefsActions);

    return prefsCard;
};
