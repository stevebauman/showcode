import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TabBackgrounds from '~/components/TabBackgrounds.vue';

const { scrollRefIntoView } = vi.hoisted(() => ({
    scrollRefIntoView: vi.fn(),
}));

vi.mock('~/composables/useScrollRefIntoView', () => ({
    default: () => ({ scrollRefIntoView }),
}));

const passthroughStub = {
    template: '<div><slot /></div>',
};

describe('TabBackgrounds', () => {
    afterEach(() => {
        scrollRefIntoView.mockReset();
    });

    it('positions the selected background only when the tab mounts', async () => {
        const wrapper = mount(TabBackgrounds, {
            props: {
                background: 'background-20',
                backgroundColor: null,
                backgrounds: Array.from({ length: 30 }, (_, index) => ({
                    id: `background-${index}`,
                    style: { backgroundColor: '#000' },
                })),
            },
            global: {
                directives: {
                    tooltip: {},
                },
                stubs: {
                    Button: passthroughStub,
                    ButtonBackground: {
                        props: ['active', 'attributes', 'custom', 'thumbnail', 'title'],
                        template: '<button v-bind="$attrs">{{ title }}</button>',
                    },
                    ColorPicker: passthroughStub,
                    ScrollArea: passthroughStub,
                },
            },
        });

        await wrapper.vm.$nextTick();

        expect(scrollRefIntoView).toHaveBeenCalledOnce();
        expect(scrollRefIntoView).toHaveBeenCalledWith('button-background-background-20');

        await wrapper.setProps({ background: 'background-21' });

        expect(scrollRefIntoView).toHaveBeenCalledOnce();
    });
});
