import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
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
});
