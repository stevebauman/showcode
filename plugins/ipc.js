export default function (context, inject) {
    inject('ipc', require('electron').ipcRenderer);
}
