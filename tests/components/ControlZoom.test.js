import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ControlZoom from '~/components/ControlZoom.vue';

// Keep focus behavior explicit so tests also cover committing with the keyboard.
describe('ControlZoom', () => {
    it.each([
        ['800%', 8],
        ['5', 0.05],
        ['0.1%', 0.001],
    ])('accepts a custom percentage %s', async (text, scale) => {
        const wrapper = mount(ControlZoom, { props: { modelValue: 1 } });
        const input = wrapper.get('input');
        await input.setValue(text);
        await input.trigger('blur');
        expect(wrapper.emitted('update:model-value')).toEqual([[scale]]);
        wrapper.unmount();
    });

    it.each(['0', '-10', 'Infinity', 'invalid', ''])(
        'restores the current value for invalid input %s',
        async (text) => {
            const wrapper = mount(ControlZoom, { props: { modelValue: 0.5 } });
            const input = wrapper.get('input');
            await input.setValue(text);
            await input.trigger('blur');
            expect(wrapper.emitted('update:model-value')).toBeUndefined();
            expect(input.element.value).toBe('50%');
            wrapper.unmount();
        }
    );

    it('updates the percentage when the canvas is zoomed using a gesture', async () => {
        const wrapper = mount(ControlZoom, { props: { modelValue: 1 } });
        await wrapper.setProps({ modelValue: 0.0125 });
        expect(wrapper.get('input').element.value).toBe('1.25%');
        wrapper.unmount();
    });

    it('cancels an edit with Escape', async () => {
        const wrapper = mount(ControlZoom, { props: { modelValue: 2 }, attachTo: document.body });
        const input = wrapper.get('input');
        input.element.focus();
        await input.setValue('900');
        await input.trigger('keydown', { key: 'Escape' });
        expect(input.element.value).toBe('200%');
        expect(wrapper.emitted('update:model-value')).toBeUndefined();
        wrapper.unmount();
    });
    it('rounds the displayed percentage while retaining the exact zoom for editing', async () => {
        const scale = 20.70037421;
        const wrapper = mount(ControlZoom, { props: { modelValue: scale } });
        const input = wrapper.get('input');
        expect(input.element.value).toBe('2070.04%');
        expect(input.attributes('title')).toBe(`${scale * 100}%`);

        await input.trigger('focus');
        expect(input.element.value).toBe(`${scale * 100}%`);
        await input.trigger('blur');

        expect(input.element.value).toBe('2070.04%');
        expect(wrapper.emitted('update:model-value')).toBeUndefined();
        wrapper.unmount();
    });

    it('cancels edits without applying the rounded display value', async () => {
        const wrapper = mount(ControlZoom, {
            props: { modelValue: 20.70037421 },
            attachTo: document.body,
        });
        const input = wrapper.get('input');
        input.element.focus();
        await input.setValue('300');
        await input.trigger('keydown', { key: 'Escape' });

        expect(input.element.value).toBe('2070.04%');
        expect(wrapper.emitted('update:model-value')).toBeUndefined();
        wrapper.unmount();
    });

    it('keeps very small zoom values visible', () => {
        const wrapper = mount(ControlZoom, { props: { modelValue: 0.000001 } });
        expect(wrapper.get('input').element.value).toBe('0.0001%');
        wrapper.unmount();
    });
});
