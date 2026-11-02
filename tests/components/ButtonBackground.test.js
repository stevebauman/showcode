import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ButtonBackground from '~/components/ButtonBackground.vue';

describe('ButtonBackground', () => {
    it('deletes a custom background without selecting it', async () => {
        const select = vi.fn();
        const wrapper = mount(ButtonBackground, {
            props: { custom: true },
            attrs: { onClick: select },
        });

        await wrapper.get('button[aria-label="Delete custom background"]').trigger('click');

        expect(wrapper.emitted('delete')).toHaveLength(1);
        expect(select).not.toHaveBeenCalled();
        expect(wrapper.find('button button').exists()).toBe(false);
    });

    it('keeps selection attributes and events on the preview button', async () => {
        const select = vi.fn();
        const wrapper = mount(ButtonBackground, {
            props: {
                attributes: { style: { backgroundColor: 'red' } },
            },
            attrs: { 'data-ref': 'background-test', onClick: select },
        });

        const preview = wrapper.get('button[data-ref="background-test"]');
        await preview.trigger('click');

        expect(preview.element.style.backgroundColor).toBe('red');
        expect(select).toHaveBeenCalledOnce();
        expect(wrapper.find('[aria-label="Delete custom background"]').exists()).toBe(false);
    });
});
