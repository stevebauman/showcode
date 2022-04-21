export default function (context, inject) {
    const ipc = {
        instance: null,

        send(...args) {
            if (context.$config.isDesktop) {
                this.getInstance().send(...args);
            }
        },

        getInstance() {
            return this.instance ?? (this.instance = require('electron').ipcRenderer);
        },
    };

    inject('ipc', ipc);
}
