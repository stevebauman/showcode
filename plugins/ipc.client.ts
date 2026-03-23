const fakeIpc = {
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
    const config = useRuntimeConfig().public;

    if (!config.isDesktop) {
        return {
            provide: {
                ipc: fakeIpc,
            },
        };
    }

    const electron = new Function(
        'return typeof require !== "undefined" ? require("electron") : null;'
    )();

    return {
        provide: {
            ipc: electron?.ipcRenderer ?? fakeIpc,
        },
    };
});
