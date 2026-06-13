import { mount } from '@vue/test-utils';
import { describe, expect, it, afterEach } from 'vitest';
import Hotkeys from '~/components/Hotkeys.vue';

describe('Hotkeys', () => {
    afterEach(() => {
        document.dispatchEvent(new KeyboardEvent('keyup'));
    });

    it('emits supported command shortcuts', async () => {
        const wrapper = mount(Hotkeys, {
            props: {
                shortcuts: ['S'],
            },
        });

        document.dispatchEvent(
            new KeyboardEvent('keydown', {
                keyCode: 'S'.charCodeAt(0),
                ctrlKey: true,
                metaKey: true,
            })
        );

        expect(wrapper.emitted('triggered')[0][0]).toMatchObject({
            key: 'S'.charCodeAt(0),
            keyString: 'S',
        });
    });
});
