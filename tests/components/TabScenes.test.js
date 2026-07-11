import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TabScenes from '~/components/TabScenes.vue';

const { scrollRefIntoView } = vi.hoisted(() => ({
    scrollRefIntoView: vi.fn(),
}));

vi.mock('~/composables/useScrollRefIntoView', () => ({
    default: () => ({ scrollRefIntoView }),
}));

describe('TabScenes', () => {
    afterEach(() => {
        scrollRefIntoView.mockReset();
    });

    it('positions the selected scene only when the tab mounts', async () => {
        const wrapper = mount(TabScenes, {
            props: {
                activeScene: 'scene-2',
                scenes: [
                    {
                        id: 'scene-1',
                        title: 'Scene 1',
                        preview: { accent: '#fff', background: '#000', window: '#111' },
                    },
                    {
                        id: 'scene-2',
                        title: 'Scene 2',
                        preview: { accent: '#fff', background: '#000', window: '#111' },
                    },
                ],
            },
            global: {
                stubs: {
                    ScrollArea: {
                        template: '<div><slot /></div>',
                    },
                },
            },
        });

        await wrapper.vm.$nextTick();

        expect(scrollRefIntoView).toHaveBeenCalledOnce();
        expect(scrollRefIntoView).toHaveBeenCalledWith('button-scene-scene-2');

        await wrapper.setProps({ activeScene: 'scene-1' });

        expect(scrollRefIntoView).toHaveBeenCalledOnce();
    });
});
