import { mount } from '@vue/test-utils';
import { onMounted, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import usePanZoom from '~/composables/usePanZoom';

// Use the browser ESM build so these tests exercise real Panzoom gestures.
vi.mock('@panzoom/panzoom', () => import('@panzoom/panzoom/dist/panzoom.es.js'));

describe('canvas zoom gestures', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Happy DOM's WheelEvent omits the inherited mouse coordinates and modifiers.
        vi.stubGlobal(
            'WheelEvent',
            class extends MouseEvent {
                constructor(type, options) {
                    super(type, options);
                    this.deltaY = options.deltaY ?? 0;
                }
            }
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('zooms smoothly around the pointer and saves the resulting viewport', async () => {
        const viewport = { x: 0, y: 0, zoom: 1 };
        const wrapper = mount(
            {
                setup() {
                    const preview = ref(null);
                    const controls = usePanZoom(viewport);
                    onMounted(() => controls.createPanZoom(preview));
                    return { preview, ...controls };
                },
                template: '<div><div ref="preview" /></div>',
            },
            { attachTo: document.body }
        );
        vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            right: 600,
            bottom: 400,
            width: 600,
            height: 400,
        });
        await vi.advanceTimersByTimeAsync(350);

        const pinch = new WheelEvent('wheel', {
            ctrlKey: true,
            deltaY: -10,
            clientX: 200,
            clientY: 100,
            bubbles: true,
            cancelable: true,
        });
        wrapper.element.dispatchEvent(pinch);
        await vi.advanceTimersByTimeAsync(350);

        const enlarged = wrapper.vm.panzoom.getScale();
        expect(pinch.defaultPrevented).toBe(true);
        expect(enlarged).toBeGreaterThan(1);
        expect(enlarged).toBeLessThan(1.2);
        expect(wrapper.vm.zoom).toBe(enlarged);
        expect(viewport).toEqual({ ...wrapper.vm.panzoom.getPan(), zoom: enlarged });
        expect(viewport.x).not.toBe(0);
        expect(viewport.y).not.toBe(0);

        wrapper.element.firstElementChild.dispatchEvent(
            new WheelEvent('wheel', {
                ctrlKey: true,
                deltaY: 10,
                clientX: 200,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            })
        );
        await vi.advanceTimersByTimeAsync(350);

        expect(wrapper.vm.zoom).toBeCloseTo(1);
        expect(viewport.zoom).toBeCloseTo(1);
        wrapper.unmount();
    });

    it('leaves ordinary scrolling and gestures outside the canvas alone and removes its listener', async () => {
        const viewport = { zoom: 1 };
        const wrapper = mount(
            {
                setup() {
                    const preview = ref(null);
                    const controls = usePanZoom(viewport);
                    onMounted(() => controls.createPanZoom(preview));
                    return { preview, ...controls };
                },
                template: '<div><div ref="preview" /></div>',
            },
            { attachTo: document.body }
        );
        await vi.advanceTimersByTimeAsync(350);
        const scroll = new WheelEvent('wheel', { deltaY: 10, bubbles: true, cancelable: true });
        const outsidePinch = new WheelEvent('wheel', {
            ctrlKey: true,
            deltaY: -10,
            bubbles: true,
            cancelable: true,
        });

        wrapper.element.dispatchEvent(scroll);
        document.body.dispatchEvent(outsidePinch);

        expect(scroll.defaultPrevented).toBe(false);
        expect(outsidePinch.defaultPrevented).toBe(false);
        expect(wrapper.vm.panzoom.getScale()).toBe(1);

        const surface = wrapper.element;
        wrapper.unmount();
        const pinch = new WheelEvent('wheel', { ctrlKey: true, deltaY: -10, cancelable: true });
        surface.dispatchEvent(pinch);
        expect(pinch.defaultPrevented).toBe(false);
    });

    it.each([
        [-1000, 2],
        [1000, 0.2],
    ])('clamps a pinch delta of %s to scale %s', async (deltaY, scale) => {
        const viewport = { zoom: 1 };
        const wrapper = mount(
            {
                setup() {
                    const preview = ref(null);
                    const controls = usePanZoom(viewport, { minScale: 0.2, maxScale: 2 });
                    onMounted(() => controls.createPanZoom(preview));
                    return { preview, ...controls };
                },
                template: '<div><div ref="preview" /></div>',
            },
            { attachTo: document.body }
        );
        vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            right: 600,
            bottom: 400,
            width: 600,
            height: 400,
        });
        await vi.advanceTimersByTimeAsync(350);

        wrapper.element.dispatchEvent(
            new WheelEvent('wheel', {
                ctrlKey: true,
                deltaY,
                clientX: 200,
                clientY: 100,
                cancelable: true,
            })
        );
        await vi.advanceTimersByTimeAsync(350);

        expect(wrapper.vm.panzoom.getScale()).toBe(scale);
        expect(wrapper.vm.zoom).toBe(scale);
        expect(viewport.zoom).toBe(scale);
        wrapper.unmount();
    });

    it('keeps the zoom controls and saved viewport in sync with a two-finger touch pinch', async () => {
        const viewport = { zoom: 1 };
        const wrapper = mount(
            {
                setup() {
                    const preview = ref(null);
                    const controls = usePanZoom(viewport);
                    onMounted(() => controls.createPanZoom(preview));
                    return { preview, ...controls };
                },
                template: '<div><div ref="preview" /></div>',
            },
            { attachTo: document.body }
        );
        vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            right: 600,
            bottom: 400,
            width: 600,
            height: 400,
        });
        await vi.advanceTimersByTimeAsync(350);
        const element = wrapper.element.firstElementChild;

        element.dispatchEvent(
            new PointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'touch',
                clientX: 100,
                clientY: 100,
                bubbles: true,
            })
        );
        element.dispatchEvent(
            new PointerEvent('pointerdown', {
                pointerId: 2,
                pointerType: 'touch',
                clientX: 200,
                clientY: 100,
                bubbles: true,
            })
        );
        document.dispatchEvent(
            new PointerEvent('pointermove', {
                pointerId: 2,
                pointerType: 'touch',
                clientX: 250,
                clientY: 100,
            })
        );
        await vi.advanceTimersByTimeAsync(350);

        expect(wrapper.vm.panzoom.getScale()).toBeGreaterThan(1);
        expect(wrapper.vm.zoom).toBe(wrapper.vm.panzoom.getScale());
        expect(viewport.zoom).toBe(wrapper.vm.panzoom.getScale());
        wrapper.unmount();
    });
});
