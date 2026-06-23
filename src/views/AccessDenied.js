export default {
    render(params) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'access-denied-wrapper';

        // Background pattern
        const bgPattern = document.createElement('div');
        bgPattern.className = 'bg-grid-pattern';
        wrapper.appendChild(bgPattern);

        // Main Card
        const mainCard = document.createElement('main');
        mainCard.className = 'error-card';
        mainCard.id = 'errorCard';
        wrapper.appendChild(mainCard);

        // Padlock Icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'error-icon-container';
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-lock';
        iconContainer.appendChild(icon);
        mainCard.appendChild(iconContainer);

        // Title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'error-title';
        const titleText = document.createElement('h1');
        titleText.textContent = 'ACCESS DENIED';
        titleDiv.appendChild(titleText);
        mainCard.appendChild(titleDiv);

        // Message
        const desc = document.createElement('p');
        desc.className = 'error-description';
        desc.textContent = 'You do not have permission to view this page. Please sign in to continue.';
        mainCard.appendChild(desc);

        // Action Buttons
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        const loginLink = document.createElement('a');
        const nextUrl = params.next || '/';
        loginLink.href = `/login?next=${encodeURIComponent(nextUrl)}`;
        loginLink.className = 'btn-primary';
        loginLink.setAttribute('data-link', '');
        
        const loginText = document.createElement('span');
        loginText.textContent = 'Back to Login';
        loginLink.appendChild(loginText);
        
        actionButtons.appendChild(loginLink);
        mainCard.appendChild(actionButtons);

        return wrapper;
    }
};
