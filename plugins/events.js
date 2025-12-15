import mitt from 'mitt';

export default defineNuxtPlugin(() => {
    const emitter = mitt();

    return {
        provide: {
            bus: {
                on: emitter.on,
                off: emitter.off,
                emit: emitter.emit,
            },
        },
    };
});
