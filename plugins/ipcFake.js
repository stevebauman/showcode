// @see https://www.electronjs.org/docs/latest/api/ipc-renderer
export default function (context, inject) {
    inject('ipc', {
        on(...args) {},
        once(...args) {},
        send(...args) {},
        invoke(...args) {},
        sendSync(...args) {},
        postMessage(...args) {},
        sendTo(...args) {},
        sendToHost(...args) {},
        removeAllListeners(...args) {},
    });
}
