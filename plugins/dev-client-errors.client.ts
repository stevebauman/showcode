export default defineNuxtPlugin((nuxtApp) => {
    if (!import.meta.dev) {
        return;
    }

    const report = (payload) => {
        fetch('/api/__client-error', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
        }).catch(() => {});
    };

    window.addEventListener('error', (event) => {
        report({
            type: 'error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        report({
            type: 'unhandledrejection',
            reason: String(event.reason),
            stack: event.reason?.stack,
        });
    });

    nuxtApp.hook('app:error', (error) => {
        report({
            type: 'app:error',
            message: error?.message,
            stack: error?.stack,
        });
    });
});
