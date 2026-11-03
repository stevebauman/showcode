import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ControlAspectRatios from '~/components/ControlAspectRatios.vue';
import Select from '~/components/ui/select/Select.vue';

describe('ControlAspectRatios', () => {
    it('selects an aspect ratio or returns to custom dimensions', async () => {
        const wrapper = mount(ControlAspectRatios, {
            props: {
                aspectRatio: [16, 9],
                aspectRatios: [
                    [16, 9],
                    [1, 1],
                ],
                lockWindowSize: false,
            },
        });

        await flushPromises();
        expect(wrapper.text()).toContain('16:9');
        wrapper.getComponent(Select).vm.$emit('update:modelValue', '1:1');
        expect(wrapper.emitted('select')).toEqual([[1, 1]]);

        wrapper.getComponent(Select).vm.$emit('update:modelValue', 'custom');
        expect(wrapper.emitted('custom')).toHaveLength(1);

        await wrapper.setProps({ aspectRatio: null });
        expect(wrapper.text()).toContain('Custom');
        wrapper.unmount();
    });

    it('does not render when no aspect ratios are available', () => {
        const wrapper = mount(ControlAspectRatios, {
            props: {
                aspectRatio: null,
                aspectRatios: [],
                lockWindowSize: false,
            },
        });

        expect(wrapper.find('button').exists()).toBe(false);
        expect(wrapper.text()).toBe('');
    });
});
