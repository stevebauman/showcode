export default defineNuxtPlugin((nuxtApp) => {
    if (nuxtApp.$config.isDesktop) {
        const ipc = {
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

        return { provide: { ipc } };
    }
});
