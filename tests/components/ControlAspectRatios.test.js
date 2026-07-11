import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ControlAspectRatios from '~/components/ControlAspectRatios.vue';

describe('ControlAspectRatios', () => {
    it('renders available aspect ratios and custom option', () => {
        const wrapper = mount(ControlAspectRatios, {
            props: {
                aspectRatio: [16, 9],
                aspectRatios: [[16, 9]],
                lockWindowSize: false,
            },
        });

        expect(wrapper.text()).toContain('16:9');
        expect(wrapper.text()).toContain('Custom');
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
