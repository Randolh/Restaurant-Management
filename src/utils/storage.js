export const setLocal = (key, value) => {
    try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
    } catch (error) {
        console.error(`Error saving ${key} to localStorage`, error);
    }
};


export const getLocal = (key, parse = false) => {
    try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        return parse ? JSON.parse(value) : value;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return null;
    }
};


export const removeLocal = (key) => {
    localStorage.removeItem(key);
};


export const clearLocal = () => {
    localStorage.clear();
};



export const setSession = (key, value) => {
    try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        sessionStorage.setItem(key, serialized);
    } catch (error) {
        console.error(`Error saving ${key} to sessionStorage`, error);
    }
};


export const getSession = (key, parse = false) => {
    try {
        const value = sessionStorage.getItem(key);
        if (!value) return null;
        return parse ? JSON.parse(value) : value;
    } catch (error) {
        console.error(`Error reading ${key} from sessionStorage`, error);
        return null;
    }
};


export const removeSession = (key) => {
    sessionStorage.removeItem(key);
};


export const clearSession = () => {
    sessionStorage.clear();
};
