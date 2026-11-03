import useDesktop from './useDesktop';

export default function () {
    return async (message, options = {}) => {
        const desktop = useDesktop();

        return desktop
            ? desktop.invoke('confirm-action', { message, ...options })
            : window.confirm(message);
    };
}
