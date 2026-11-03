import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ButtonColorPicker from '~/components/ButtonColorPicker.vue';

// The surrounding property label targets the button inside the dropdown.
describe('ButtonColorPicker', () => {
    it('forwards labels to its button and color changes to the parent', async () => {
        const wrapper = mount(ButtonColorPicker, {
            attrs: { id: 'title-color' },
            props: { modelValue: { red: 0, green: 0, blue: 0, alpha: 1 } },
            global: {
                stubs: {
                    ColorPicker: {
                        name: 'ColorPicker',
                        emits: ['change'],
                        template: '<div><slot solid="rgb(0, 0, 0)" /></div>',
                    },
                },
            },
        });
        expect(wrapper.get('button').attributes('id')).toBe('title-color');
        expect(wrapper.get('button').text()).toBe('#000000');
        const color = { red: 255, green: 0, blue: 0, alpha: 0.5 };
        wrapper.findComponent({ name: 'ColorPicker' }).vm.$emit('change', color);
        expect(wrapper.emitted('change')).toEqual([[color]]);
        wrapper.unmount();
    });
});
