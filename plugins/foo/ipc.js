const ipc = require('electron').ipcRenderer;

export default defineNuxtPlugin((nuxtApp) => {
    return { provide: { ipc } };
});
