// Emit event
export const emitEvent = (eventName, detail = {}) => {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
};

// Listen event
export const onEvent = (eventName, callback) => {
    document.addEventListener(eventName, callback);
};

// Stop listening event
export const offEvent = (eventName, callback) => {
    document.removeEventListener(eventName, callback);
};
