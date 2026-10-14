import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import usePreviewCapture from '~/composables/usePreviewCapture';

const toPng = vi.hoisted(() => vi.fn(async () => 'png'));
const toJpeg = vi.hoisted(() => vi.fn(async () => 'jpeg'));
vi.mock('html-to-image', () => ({ toPng, toJpeg }));
afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
});

describe('usePreviewCapture', () => {
    it('waits for highlighting and its DOM update before exporting', async () => {
        let finish;
        const text = ref('old');
        const prepare = vi.fn(
            () =>
                new Promise((resolve) => {
                    finish = () => {
                        text.value = 'latest';
                        resolve();
                    };
                })
        );
        let capture;
        const wrapper = mount(
            defineComponent({
                setup() {
                    const canvas = ref(null);
                    capture = usePreviewCapture(() => ({ $el: canvas.value }), {
                        prepare,
                        onThumbnail: vi.fn(),
                    });
                    return { canvas, text };
                },
                template: '<div ref="canvas">{{ text }}</div>',
            }),
            { attachTo: document.body }
        );
        toPng.mockImplementationOnce(async (element) => element.textContent);
        const exporting = capture.capture('toPng', 2);
        await flushPromises();
        await vi.dynamicImportSettled();
        expect(toPng).not.toHaveBeenCalled();
        finish();

        await expect(exporting).resolves.toBe('latest');
        expect(toPng).toHaveBeenCalledWith(
            wrapper.element,
            expect.objectContaining({ pixelRatio: 2 })
        );
        wrapper.unmount();
    });

    it('does not publish a thumbnail after switching away from its tab', async () => {
        let finish;
        toJpeg.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve;
                })
        );
        const showing = ref(true);
        const update = vi.fn();
        let capture;
        const Child = defineComponent({
            setup() {
                const canvas = ref(null);
                capture = usePreviewCapture(() => ({ $el: canvas.value }), {
                    prepare: async () => {},
                    onThumbnail: update,
                });
                return { canvas };
            },
            template: '<div ref="canvas" />',
        });
        const wrapper = mount(
            defineComponent({
                components: { Child },
                setup: () => ({ showing }),
                template: '<KeepAlive><Child v-if="showing" /></KeepAlive>',
            }),
            { attachTo: document.body }
        );
        const pending = capture.captureThumbnail();
        await flushPromises();
        showing.value = false;
        await nextTick();
        finish('stale image');
        await pending;

        expect(update).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it('cancels scheduled thumbnails when an explicit capture runs', async () => {
        vi.useFakeTimers();
        let capture;
        const wrapper = mount(
            defineComponent({
                setup() {
                    const canvas = ref(null);
                    capture = usePreviewCapture(() => ({ $el: canvas.value }), {
                        prepare: async () => {},
                        onThumbnail: vi.fn(),
                    });
                    return { canvas };
                },
                template: '<div ref="canvas" />',
            }),
            { attachTo: document.body }
        );
        capture.scheduleThumbnail();
        await capture.capture('toPng');
        await vi.advanceTimersByTimeAsync(10000);

        expect(toPng).toHaveBeenCalledOnce();
        expect(toJpeg).not.toHaveBeenCalled();
        wrapper.unmount();
    });
});
