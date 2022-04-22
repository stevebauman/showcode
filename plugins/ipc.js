const ipc = require('electron').ipcRenderer;

export default function (context, inject) {
    inject('ipc', ipc);
}
