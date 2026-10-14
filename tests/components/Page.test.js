import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import Page from '~/components/Page.vue';

const EditorStub = {
    name: 'Editor',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `
        <button type="button" @click="$emit('update:modelValue', 'changed code')">
            {{ modelValue }}
        </button>
    `,
};

const PreviewStub = {
    name: 'Preview',
    emits: ['update:settings'],
    setup(_, { emit, expose }) {
        expose({
            flushProjectPreview: () => emit('update:settings', { image: 'fresh-preview' }),
        });
    },
    template: '<div />',
};

function mountPage() {
    return mount(Page, {
        props: {
            project: {
                tab: { name: 'Test Project' },
                viewport: {},
                settings: {},
                page: {
                    editors: [
                        {
                            id: 'editor-1',
                            added: [],
                            removed: [],
                            focused: [],
                            language: 'php',
                            tabSize: 4,
                            value: 'original code',
                        },
                    ],
                },
            },
        },
        global: {
            stubs: {
                Editor: EditorStub,
                Preview: PreviewStub,
            },
        },
    });
}

describe('Page', () => {
    it('forwards unsaved appearance changes', () => {
        const wrapper = mount(Page, {
            props: {
                project: {
                    tab: { name: 'Test Project' },
                    viewport: {},
                    settings: {},
                    page: { editors: [] },
                },
            },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub } },
        });

        wrapper.getComponent(PreviewStub).vm.$emit('update:touched');

        expect(wrapper.emitted('update:touched')).toHaveLength(1);
        wrapper.unmount();
    });

    it('flushes pending page changes immediately', async () => {
        const wrapper = mountPage();

        await wrapper.getComponent(EditorStub).trigger('click');

        await wrapper.vm.flushProjectState();

        const pageUpdates = wrapper.emitted('update:page');
        const latestPage = pageUpdates[pageUpdates.length - 1][0];

        expect(latestPage.editors[0].value).toBe('changed code');
        expect(wrapper.emitted('update:touched')).toHaveLength(1);
        expect(wrapper.emitted('update:settings')[0][0]).toEqual({ image: 'fresh-preview' });
    });

    it('persists recent edits when a cached page is deactivated', async () => {
        const showing = ref(true);
        const updates = vi.fn();
        const touched = vi.fn();
        const wrapper = mount(
            defineComponent({
                components: { Page },
                setup: () => ({
                    showing,
                    updates,
                    touched,
                    project: {
                        tab: { name: 'Test Project' },
                        viewport: {},
                        settings: {},
                        page: { editors: [{ id: 'editor-1', value: 'original code' }] },
                    },
                }),
                template:
                    '<KeepAlive><Page v-if="showing" :project="project" @update:page="updates" @update:touched="touched" /></KeepAlive>',
            }),
            { global: { stubs: { Editor: EditorStub, Preview: PreviewStub } } }
        );

        await wrapper.getComponent(EditorStub).trigger('click');
        showing.value = false;
        await nextTick();

        expect(updates.mock.lastCall[0].editors[0].value).toBe('changed code');
        expect(touched).toHaveBeenCalled();
        wrapper.unmount();
    });

    it('persists recent edits before a page is unmounted', async () => {
        const wrapper = mount(Page, {
            props: {
                project: {
                    tab: { name: 'Test Project' },
                    viewport: {},
                    settings: {},
                    page: { editors: [{ id: 'editor-1', value: 'original code' }] },
                },
            },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub } },
        });

        await wrapper.getComponent(EditorStub).trigger('click');
        wrapper.unmount();

        expect(wrapper.emitted('update:page').at(-1)[0].editors[0].value).toBe('changed code');
        expect(wrapper.emitted('update:touched')).toHaveLength(1);
    });

    it('emits detached snapshots and cancels pending dirty notifications when flushed', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Page, {
            props: {
                project: {
                    tab: { name: 'Test Project' },
                    viewport: {},
                    settings: {},
                    page: { editors: [{ id: 'editor-1', value: 'original code' }] },
                },
            },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub } },
        });

        try {
            await wrapper.getComponent(EditorStub).trigger('click');
            await vi.advanceTimersByTimeAsync(5000);
            const snapshot = wrapper.emitted('update:page').at(-1)[0];

            wrapper.getComponent(EditorStub).vm.$emit('update:modelValue', 'another edit');
            await nextTick();
            expect(snapshot.editors[0].value).toBe('changed code');

            await wrapper.vm.flushProjectState();
            const notifications = wrapper.emitted('update:touched').length;
            await vi.advanceTimersByTimeAsync(5000);
            expect(wrapper.emitted('update:touched')).toHaveLength(notifications);
        } finally {
            wrapper.unmount();
            vi.useRealTimers();
        }
    });
});
