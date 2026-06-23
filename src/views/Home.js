export default {
    render(params) {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-content';

        const header = document.createElement('div');
        header.className = 'page-header';
        
        const title = document.createElement('h1');
        title.textContent = 'Welcome to Restaurant Management';
        
        header.appendChild(title);
        wrapper.appendChild(header);

        const content = document.createElement('p');
        content.textContent = 'You are logged in. This is the protected home page.';
        wrapper.appendChild(content);

        return wrapper;
    }
};
