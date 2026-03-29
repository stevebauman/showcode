const fake = {
    on: () => null,
    once: () => null,
    removeListener: () => null,
    addListener: () => null,
    send: () => null,
    invoke: () => null,
    sendSync: () => null,
    postMessage: () => null,
    sendTo: () => null,
    sendToHost: () => null,
};

export default defineNuxtPlugin(() => {
    return {
        provide: {
            ipc: window.require?.('electron')?.ipcRenderer ?? fake,
        },
    };
});
