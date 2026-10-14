import { debounce } from 'lodash';
import { nextTick, onActivated, onDeactivated, onMounted, onScopeDispose, toValue } from 'vue';

let htmlToImagePromise;

export default function (canvas, { prepare, onThumbnail }) {
    let idle = null;
    let idleType = null;
    let revision = 0;
    let active = false;
    const schedule = debounce(queueIdleCapture, 5000);

    function cancel() {
        revision++;
        schedule.cancel();
        if (idle !== null) {
            if (idleType === 'idle') cancelIdleCallback(idle);
            else clearTimeout(idle);
        }
        idle = null;
        idleType = null;
    }

    async function renderImage(method, pixelRatio) {
        cancel();
        htmlToImagePromise ??= import('html-to-image');
        const htmlToImage = await htmlToImagePromise;
        await nextTick();
        await prepare();
        await nextTick();

        cancel();
        const current = revision;
        const element = toValue(canvas)?.$el;
        if (!element?.isConnected) return {};

        const image = await htmlToImage[method](element, {
            pixelRatio,
            filter: (node) => !node.dataset || !Object.hasOwn(node.dataset, 'hide'),
        });
        return { image, revision: current };
    }

    async function capture(method, pixelRatio = 3) {
        const { image } = await renderImage(method, pixelRatio);
        return image;
    }

    async function captureThumbnail() {
        const { image, revision: current } = await renderImage('toJpeg', 1);
        if (current === revision && image && toValue(canvas)?.$el.isConnected) onThumbnail(image);
    }

    function queueIdleCapture() {
        const generate = () => {
            idle = null;
            idleType = null;
            captureThumbnail().catch((error) =>
                console.error('Unable to generate template image.', error)
            );
        };
        if (typeof requestIdleCallback === 'function') {
            idleType = 'idle';
            idle = requestIdleCallback(generate, { timeout: 2500 });
        } else {
            idleType = 'timeout';
            idle = setTimeout(generate, 1500);
        }
    }

    function scheduleThumbnail() {
        cancel();
        if (active) schedule();
    }

    function activate() {
        active = true;
        cancel();
        queueIdleCapture();
    }

    function deactivate() {
        active = false;
        cancel();
    }

    onMounted(activate);
    onActivated(activate);
    onDeactivated(deactivate);
    onScopeDispose(deactivate);

    return { capture, captureThumbnail, scheduleThumbnail, cancel };
}
