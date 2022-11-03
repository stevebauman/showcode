import Worker from '~/assets/js/shiki.worker.js';

export default (context, inject) => {
    inject('worker', {
        createWorker() {
            return new Worker();
        },
    });
};
