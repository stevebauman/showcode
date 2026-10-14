import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Window from '~/components/Window.vue';
import useSettings from '~/composables/useSettings';

describe('Window', () => {
    it.each([
        { zoom: 0.5, scale: 1, scene: 'none' },
        { zoom: 1, scale: 1, scene: 'none' },
        { zoom: 2, scale: 1, scene: 'none' },
        { zoom: 0.5, scale: 1.5, scene: 'none' },
        { zoom: 2, scale: 1.5, scene: 'none' },
        { zoom: 2, scale: 1.5, scene: 'gemini' },
    ])(
        'measures layout dimensions at zoom $zoom, scale $scale, and scene $scene',
        ({ zoom, scale, scene }) => {
            const { settings } = useSettings({ scale, scene });
            const wrapper = mount(Window, {
                props: { zoom, settings, preview: true },
                global: { stubs: { FauxMenu: true } },
            });
            const root = wrapper.element;
            const child = document.createElement('div');
            root.append(child);
            const control = document.createElement('div');
            control.setAttribute('data-hide', '');
            const handle = document.createElement('button');
            control.append(handle);
            root.append(control);
            const transform = zoom * (scene === 'none' ? scale : 1);

            vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
                left: 100,
                top: 50,
                width: 300 * transform,
                height: 100 * transform,
            });
            Object.defineProperties(root, {
                clientWidth: { value: 300 },
                scrollWidth: { value: 1000 },
                clientHeight: { value: 100 },
                scrollHeight: { value: 1000 },
            });
            vi.spyOn(root, 'querySelectorAll').mockReturnValue([control, handle, child]);
            vi.spyOn(child, 'getBoundingClientRect').mockReturnValue({
                left: 100 + 40 * transform,
                top: 50 + 20 * transform,
                width: 300 * transform,
                height: 110 * transform,
            });
            Object.defineProperties(child, {
                scrollWidth: { value: 360 },
                scrollHeight: { value: 140 },
            });

            expect(wrapper.vm.actualWidth()).toBe(400);
            expect(wrapper.vm.actualHeight()).toBe(160);
            wrapper.unmount();
        }
    );
});
