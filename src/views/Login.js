import { emitEvent, onEvent, offEvent } from '../utils/events.js';
import { getLocal, removeLocal } from '../utils/storage.js';
import { t } from '../utils/i18n.js';

export default {
    render(params) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'login-wrapper';

        // Background pattern
        const bgPattern = document.createElement('div');
        bgPattern.className = 'bg-grid-pattern';
        wrapper.appendChild(bgPattern);

        // Main Card
        const mainCard = document.createElement('main');
        mainCard.className = 'login-card';
        mainCard.id = 'loginCard';
        wrapper.appendChild(mainCard);

        // Header
        const header = document.createElement('header');
        header.className = 'login-header';
        
        const logoDiv = document.createElement('div');
        logoDiv.className = 'login-logo';
        const profile = getLocal('restaurant_profile', true) || {};
        const logoImg = document.createElement('img');
        logoImg.src = profile.logo || './favicon.svg';
        logoImg.alt = 'Restaurant Logo';
        logoImg.style.objectFit = 'cover';
        logoImg.style.borderRadius = '50%';
        logoImg.style.width = '100%';
        logoImg.style.height = '100%';
        logoDiv.appendChild(logoImg);
        
        const title = document.createElement('h1');
        title.textContent = profile.name || t('login.title');
        
        header.appendChild(logoDiv);
        header.appendChild(title);

        if (profile.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.textContent = profile.subtitle;
            subtitle.className = 'login-subtitle';
            subtitle.style.color = 'var(--text-secondary)';
            subtitle.style.marginTop = '-16px';
            subtitle.style.marginBottom = '24px';
            subtitle.style.fontSize = '14px';
            header.appendChild(subtitle);
        }
        mainCard.appendChild(header);

        // Error Message Container
        const errorMessage = document.createElement('div');
        errorMessage.id = 'loginError';
        errorMessage.style.color = 'var(--color-warning)';
        errorMessage.style.fontSize = 'var(--font-size-body-sm)';
        errorMessage.style.visibility = 'hidden';
        errorMessage.style.minHeight = '20px';
        errorMessage.style.marginTop = 'var(--stack-sm)';
        errorMessage.style.textAlign = 'center';
        errorMessage.style.fontWeight = '600';
        mainCard.appendChild(errorMessage);

        // Form
        const form = document.createElement('form');
        form.className = 'login-form';
        form.id = 'loginForm';
        mainCard.appendChild(form);

        // Email Group
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        
        const emailLabel = document.createElement('label');
        emailLabel.htmlFor = 'email';
        emailLabel.textContent = t('login.email');
        
        const emailWrapper = document.createElement('div');
        emailWrapper.className = 'input-wrapper';
        
        const emailIcon = document.createElement('i');
        emailIcon.className = 'fa-solid fa-envelope';
        
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'email';
        emailInput.placeholder = 'name@restaurant.com';
        emailInput.required = true;
        
        emailWrapper.appendChild(emailIcon);
        emailWrapper.appendChild(emailInput);
        emailGroup.appendChild(emailLabel);
        emailGroup.appendChild(emailWrapper);
        form.appendChild(emailGroup);

        // Password Group
        const passwordGroup = document.createElement('div');
        passwordGroup.className = 'form-group';
        
        const passwordHeader = document.createElement('div');
        passwordHeader.className = 'password-header';
        const passwordLabel = document.createElement('label');
        passwordLabel.htmlFor = 'password';
        passwordLabel.textContent = t('login.password');
        passwordHeader.appendChild(passwordLabel);
        
        const passwordWrapper = document.createElement('div');
        passwordWrapper.className = 'input-wrapper';
        
        const passwordIcon = document.createElement('i');
        passwordIcon.className = 'fa-solid fa-lock';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password';
        passwordInput.placeholder = '••••••••';
        passwordInput.required = true;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.id = 'togglePassword';
        toggleBtn.ariaLabel = 'Show password';
        const toggleIcon = document.createElement('i');
        toggleIcon.className = 'fa-solid fa-eye';
        toggleBtn.appendChild(toggleIcon);
        
        passwordWrapper.appendChild(passwordIcon);
        passwordWrapper.appendChild(passwordInput);
        passwordWrapper.appendChild(toggleBtn);
        passwordGroup.appendChild(passwordHeader);
        passwordGroup.appendChild(passwordWrapper);
        form.appendChild(passwordGroup);

        // Remember Me
        const rememberDiv = document.createElement('div');
        rememberDiv.className = 'remember-me';
        
        const rememberInput = document.createElement('input');
        rememberInput.type = 'checkbox';
        rememberInput.id = 'remember';
        
        const rememberLabel = document.createElement('label');
        rememberLabel.htmlFor = 'remember';
        rememberLabel.textContent = t('login.remember');
        
        rememberDiv.appendChild(rememberInput);
        rememberDiv.appendChild(rememberLabel);
        form.appendChild(rememberDiv);

        // Submit Button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn-primary';
        
        const submitText = document.createElement('span');
        submitText.textContent = t('login.btn');
        const submitIcon = document.createElement('i');
        submitIcon.className = 'fa-solid fa-arrow-right';
        
        submitBtn.appendChild(submitText);
        submitBtn.appendChild(submitIcon);
        form.appendChild(submitBtn);

        // Store params on wrapper so mount can read them
        wrapper.dataset.nextUrl = params.next || '/';

        return wrapper;
    },

    async mount(container) {
        const form = container.querySelector('#loginForm');
        const togglePassword = container.querySelector('#togglePassword');
        const passwordInput = container.querySelector('#password');
        const emailInput = container.querySelector('#email');
        const wrapper = container.querySelector('.login-wrapper');
        const nextUrl = wrapper.dataset.nextUrl;

        if (getLocal('first_time_login_alert') === 'true') {
            emailInput.value = 'admin@restaurant.com';
            passwordInput.value = 'password123';
            
            setTimeout(() => {
                alert('¡Bienvenido!\n\nEstas son tus credenciales por defecto para ingresar al sistema:\n\nUsuario: admin@restaurant.com\nContraseña: password123');
                removeLocal('first_time_login_alert');
            }, 500); // Pequeño retraso para que cargue la vista antes del alert
        }

        // Toggle password visibility
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = togglePassword.querySelector('i');
            icon.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
        });

        const loginError = container.querySelector('#loginError');

        const handleLoginError = (e) => {
            loginError.textContent = e.detail.message;
            loginError.style.visibility = 'visible';
        };
        onEvent('auth:login-error', handleLoginError);
        container._loginErrorHandler = handleLoginError;

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // clear previous error
            loginError.style.visibility = 'hidden';
            loginError.textContent = '';
            
            const email = form.querySelector('#email').value;
            const password = passwordInput.value;
            const remember = form.querySelector('#remember').checked;

            emitEvent('auth:login', { email, password, remember, nextUrl });
        });
    },

    unmount() {
        const container = document.getElementById('main-content');
        if (container && container._loginErrorHandler) {
            offEvent('auth:login-error', container._loginErrorHandler);
            delete container._loginErrorHandler;
        }
    }
};
