export default function ({ app }, inject) {
    if (!app.$config.isDesktop) {
        inject('ipc', {
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
        });
    }
}
