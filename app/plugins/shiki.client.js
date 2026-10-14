import { ref } from 'vue';

export default defineNuxtPlugin(() => {
    const worker = new Worker(new URL('../workers/shiki.worker.js', import.meta.url), {
        type: 'module',
    });

    const pending = new Map();
    const allLanguageIds = ref([]);
    const allThemeIds = ref([]);
    let requestId = 0;
    let failure = null;

    worker.addEventListener('message', ({ data: { id, result, error } }) => {
        const request = pending.get(id);

        if (!request) {
            return;
        }

        pending.delete(id);

        if (error) {
            request.reject(new Error(error));
            return;
        }

        request.resolve(result);
    });

    function failRequests(event) {
        failure = new Error(event.message || 'Unable to communicate with the syntax highlighter.');
        pending.forEach(({ reject }) => reject(failure));
        pending.clear();
        worker.terminate();
    }

    worker.addEventListener('error', failRequests);
    worker.addEventListener('messageerror', failRequests);

    function send(method, payload = {}) {
        if (failure) return Promise.reject(failure);

        const id = ++requestId;

        return new Promise((resolve, reject) => {
            pending.set(id, { resolve, reject });
            worker.postMessage({ id, method, payload });
        });
    }

    const ready = send('initialize').then(({ languages, themes }) => {
        allLanguageIds.value = languages;
        allThemeIds.value = themes;
    });

    return {
        provide: {
            shiki: {
                ready,
                languages: () => allLanguageIds.value,
                themes: () => allThemeIds.value,
                async tokenizeBlocks(payload) {
                    await ready;

                    return send('tokenizeBlocks', payload);
                },
            },
        },
    };
});
