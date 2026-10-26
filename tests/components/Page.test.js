import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import Page from '~/components/Page.vue';
import useProjectStoreFactory from '~/composables/useProjectStoreFactory';
import useSavedProjectStore from '~/composables/useSavedProjectStore';

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
    props: ['settings'],
    template: '<div />',
};

describe('Page', () => {
    it('saves the latest editor content directly from the project without a component flush', async () => {
        const project = useProjectStoreFactory('pages/immediate-save')();
        project.$patch({
            page: { editors: [{ id: 'editor-1', value: 'original code' }] },
        });
        const savedProjects = useSavedProjectStore();
        savedProjects.$reset();
        const wrapper = mount(Page, {
            props: { project },
            attrs: { 'onUpdate:touched': () => (project.modified = true) },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub } },
        });

        wrapper.getComponent(EditorStub).vm.$emit('update:modelValue', 'changed code');

        expect(project.page.editors[0].value).toBe('changed code');
        expect(project.modified).toBe(true);
        expect(wrapper.getComponent(PreviewStub).props('settings')).toBe(project.settings);

        const saved = savedProjects.save(project);
        expect(saved.page.editors[0].value).toBe('changed code');
        expect(project.modified).toBe(false);
        await nextTick();
        expect(project.modified).toBe(false);
        wrapper.unmount();
        project.$dispose();
    });

    it('keeps cached pages bound to their own projects across tab switches', async () => {
        const first = useProjectStoreFactory('pages/cached-first')();
        const second = useProjectStoreFactory('pages/cached-second')();
        first.$patch({ page: { editors: [{ id: 'first-editor', value: 'first code' }] } });
        second.$patch({ page: { editors: [{ id: 'second-editor', value: 'second code' }] } });
        const active = ref(first);
        const wrapper = mount(
            defineComponent({
                components: { Page },
                setup: () => ({ active }),
                template: '<KeepAlive><Page :key="active.$id" :project="active" /></KeepAlive>',
            }),
            { global: { stubs: { Editor: EditorStub, Preview: PreviewStub } } }
        );

        await wrapper.getComponent(EditorStub).trigger('click');
        active.value = second;
        await nextTick();
        expect(wrapper.getComponent(EditorStub).props('modelValue')).toBe('second code');

        first.page.editors[0].value = 'updated while inactive';
        active.value = first;
        await nextTick();
        expect(wrapper.getComponent(EditorStub).props('modelValue')).toBe('updated while inactive');
        expect(second.page.editors[0].value).toBe('second code');

        wrapper.unmount();
        first.$dispose();
        second.$dispose();
    });

    it('retains recent edits when a page is unmounted', async () => {
        const project = useProjectStoreFactory('pages/unmounted-editor')();
        project.$patch({ page: { editors: [{ id: 'editor-1', value: 'original code' }] } });
        const wrapper = mount(Page, {
            props: { project },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub } },
        });

        wrapper.getComponent(EditorStub).vm.$emit('update:modelValue', 'last edit');
        wrapper.unmount();

        expect(project.page.editors[0].value).toBe('last edit');
        project.$dispose();
    });
});
