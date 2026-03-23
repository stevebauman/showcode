import mitt from 'mitt';

export default defineNuxtPlugin(() => {
    const emitter = mitt();

    const bus = {
        $on: emitter.on,
        $off: emitter.off,
        $emit: emitter.emit,
    };

    return {
        provide: {
            bus,
        },
    };
});
