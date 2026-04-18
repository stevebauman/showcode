export default defineNuxtPlugin(() => {
    if (!('serviceWorker' in navigator)) return;

    if (import.meta.dev) {
        navigator.serviceWorker
            .getRegistrations()
            .then((regs) => regs.forEach((reg) => reg.unregister()));
        return;
    }

    navigator.serviceWorker.register('/sw.js', { scope: '/' });
});

