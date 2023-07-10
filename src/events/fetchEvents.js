import { FETCH_END_EVENT, FETCH_FAILED_EVENT, FETCH_START_EVENT } from "../constants";

function registerFetchListener() {
    const loadingBar = document.querySelector('#loadingBar');
    window.addEventListener(FETCH_START_EVENT, () => {
        loadingBar.classList.remove('hidden');
    });

    window.addEventListener(FETCH_END_EVENT, () => {
        loadingBar.classList.remove('hidden');
        loadingBar.classList.add('hidden');
    });

    window.addEventListener(FETCH_FAILED_EVENT, () => {
        loadingBar.classList.remove('hidden');
        loadingBar.classList.add('hidden');
    });
}

function dispatchFetchEvent(name) {
    const event = new Event(name);
    window.dispatchEvent(event);
}

export {
    registerFetchListener,
    dispatchFetchEvent
}