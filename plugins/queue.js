import Queue from 'queue';

export default defineNuxtPlugin(() => {
    const queue = new Queue({
        autostart: true,
        concurrency: 1,
    });

    return { provide: { queue } };
});
