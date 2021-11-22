import Queue from 'queue';

export default function (context, inject) {
    const queue = new Queue({
        autostart: true,
        concurrency: 1,
    });

    inject('queue', queue);
}
