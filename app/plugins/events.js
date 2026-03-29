import mitt from 'mitt';

export default defineNuxtPlugin(() => {
    const emitter = mitt();

    return {
        provide: {
            bus: {
                $on: emitter.on,
                $emit: emitter.emit,
                $off: emitter.off,
            },
        },
    };
});
