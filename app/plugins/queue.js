import Queue from 'queue';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            queue: new Queue({
                autostart: true,
                concurrency: 1,
            }),
        },
    };
});
