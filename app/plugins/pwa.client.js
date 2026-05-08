export default defineNuxtPlugin(() => {
    if (!('serviceWorker' in navigator)) return;

    const config = useRuntimeConfig();

    // Unregister any existing SWs and skip registration in dev or desktop.
    // Desktop is served from a local protocol — offline caching is unnecessary
    // and the self-destroying SW causes a forced reload on every cold launch.
    if (import.meta.dev || config.public.isDesktop) {
        navigator.serviceWorker
            .getRegistrations()
            .then((regs) => regs.forEach((reg) => reg.unregister()));
        return;
    }

    navigator.serviceWorker.register('/sw.js', { scope: '/' });
});
