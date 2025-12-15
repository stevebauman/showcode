export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    // For desktop (Electron), use the real IPC
    if (config.public.isDesktop) {
        const ipc = window.require?.('electron')?.ipcRenderer;

        return {
            provide: {
                ipc: ipc || null,
            },
        };
    }

    // For web app mode, provide a fake IPC proxy
    return {
        provide: {
            ipc: {
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
            },
        },
    };
});
