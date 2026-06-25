import { debounce } from '../../utils/helpers.js';

export default function SearchBar({ placeholder = 'Search...', onChange, delay = 300 }) {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-bar-component input-wrapper';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fa-solid fa-magnifying-glass search-bar-icon';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control search-bar-input';
    searchInput.placeholder = placeholder;
    
    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(searchInput);

    if (onChange) {
        searchInput.addEventListener('input', debounce((e) => {
            onChange(e.target.value.toLowerCase().trim());
        }, delay));
    }

    return searchWrapper;
}
