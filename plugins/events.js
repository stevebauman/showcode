import emitter from 'tiny-emitter/instance'

export default defineNuxtPlugin(() => {
    const events = {
        $on: (...args) => emitter.on(...args),
        $once: (...args) => emitter.once(...args),
        $off: (...args) => emitter.off(...args),
        $emit: (...args) => emitter.emit(...args)
    };

    return {
      provide: { events },
    };
});
