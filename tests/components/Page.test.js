import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import Page from '~/components/Page.vue';
import useProjectStoreFactory from '~/composables/useProjectStoreFactory';
import useSavedProjectStore from '~/composables/useSavedProjectStore';

const EditorStub = {
    name: 'Editor',
    props: ['id', 'modelValue', 'canHide', 'showLineNumbers'],
    emits: ['update:modelValue', 'add', 'up', 'down', 'hide', 'update:show-line-numbers'],
    template: `
        <div :data-editor-id="id" @click="$emit('update:modelValue', 'changed code')">
            {{ modelValue }}
            <button v-if="canHide" aria-label="Hide code editor" @click.stop="$emit('hide')">Hide</button>
        </div>
    `,
};

const PreviewStub = {
    name: 'Preview',
    props: ['settings', 'orientation', 'editorOpen', 'code'],
    emits: ['update:orientation', 'update:editorOpen'],
    template: `
        <div>
            <button v-if="!editorOpen" @click="$emit('update:editorOpen', true)">
                Show code editor
            </button>
        </div>
    `,
};

describe('Page', () => {
    it('remembers line number visibility per editor without changing screenshot settings', async () => {
        const project = useProjectStoreFactory('pages/editor-line-numbers')();
        project.$patch({
            page: {
                editors: [
                    { id: 'first', value: 'first code' },
                    { id: 'second', value: 'second code', showLineNumbers: false },
                ],
            },
            settings: { showLineNumbers: true },
        });
        const wrapper = mount(Page, {
            props: { project },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
        });
        await flushPromises();
        const editors = wrapper.findAllComponents(EditorStub);
        expect(editors[0].props('showLineNumbers')).toBe(true);
        expect(editors[1].props('showLineNumbers')).toBe(false);

        editors[0].vm.$emit('update:show-line-numbers', false);
        await nextTick();
        expect(project.page.editors[0].showLineNumbers).toBe(false);
        expect(project.settings.showLineNumbers).toBe(true);
        wrapper.unmount();

        const restored = mount(Page, {
            props: { project },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
        });
        await flushPromises();
        expect(
            restored.findAllComponents(EditorStub).map((editor) => editor.props('showLineNumbers'))
        ).toEqual([false, false]);
        restored.unmount();
        project.$dispose();
    });

    it('settles on the latest visibility when toggled during the slide', async () => {
        const project = useProjectStoreFactory('pages/reverse-editor-slide')();
        project.$patch({
            page: {
                orientation: 'left',
                sizes: [35, 65],
                editors: [{ id: 'first', value: 'first code' }],
            },
        });
        const wrapper = mount(Page, {
            props: { project },
            attachTo: document.body,
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
        });
        await flushPromises();
        const preview = wrapper.getComponent(PreviewStub);

        await wrapper.get('[aria-label="Hide code editor"]').trigger('click');
        await preview.get('button').trigger('click');
        await vi.waitFor(() => expect(wrapper.get('.editor-content').element.style.width).toBe(''));

        expect(wrapper.get('[aria-label="Code editors"]').isVisible()).toBe(true);
        expect(wrapper.findAll('.gutter')).toHaveLength(1);
        expect(project.page.sizes).toEqual([35, 65]);
        expect(preview.props('editorOpen')).toBe(true);
        wrapper.unmount();
        project.$dispose();
    });

    it.each(['left', 'right', 'top', 'bottom'])(
        'hides and restores the %s editor pane without losing its editors or split sizes',
        async (orientation) => {
            const project = useProjectStoreFactory(`pages/hide-editors-${orientation}`)();
            project.$patch({
                page: {
                    orientation,
                    sizes: [35, 65],
                    editorSizes: [40, 60],
                    editors: [
                        { id: 'first', value: 'first code' },
                        { id: 'second', value: 'second code' },
                    ],
                },
            });
            const wrapper = mount(Page, {
                props: { project },
                attachTo: document.body,
                global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
            });
            await flushPromises();
            const editors = wrapper.findAllComponents(EditorStub).map((editor) => editor.vm);
            const changes = wrapper.emitted('update:touched')?.length ?? 0;
            const preview = wrapper.getComponent(PreviewStub);
            const code = preview.props('code');

            await wrapper.get('[aria-label="Hide code editor"]').trigger('click');
            await vi.waitFor(() => expect(wrapper.findAll('.gutter')).toHaveLength(0));

            expect(wrapper.get('[aria-label="Code editors"]').isVisible()).toBe(false);
            expect(wrapper.get('[aria-label="Code editors"]').attributes('aria-hidden')).toBe(
                'true'
            );
            expect(wrapper.findAll('.gutter')).toHaveLength(0);
            expect(preview.props('code')).toEqual(code);
            expect(preview.element.parentElement.style.width).toBe('');

            await preview.get('button').trigger('click');
            await vi.waitFor(() =>
                expect(wrapper.get('[aria-label="Code editors"]').isVisible()).toBe(true)
            );
            await vi.waitFor(() =>
                expect(wrapper.get('.editor-content').element.style.width).toBe('')
            );

            expect(wrapper.get('[aria-label="Code editors"]').isVisible()).toBe(true);
            expect(wrapper.findAllComponents(EditorStub).map((editor) => editor.vm)).toEqual(
                editors
            );
            expect(wrapper.findAll('.gutter')).toHaveLength(2);
            expect(project.page.sizes).toEqual([35, 65]);
            expect(project.page.editorSizes).toEqual([40, 60]);
            expect(wrapper.emitted('update:touched')?.length ?? 0).toBe(changes);

            wrapper.unmount();
            project.$dispose();
        }
    );

    it('initializes a blank project before creating its editor dividers', async () => {
        const project = useProjectStoreFactory('pages/blank-project')();
        const wrapper = mount(Page, {
            props: { project },
            attachTo: document.body,
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
        });
        await flushPromises();

        expect(wrapper.findAllComponents(EditorStub)).toHaveLength(1);

        wrapper.getComponent(EditorStub).vm.$emit('add');
        await flushPromises();

        expect(wrapper.findAllComponents(EditorStub)).toHaveLength(2);
        const container = wrapper.getComponent(EditorStub).element.parentElement;
        expect(container.querySelectorAll('.gutter')).toHaveLength(1);

        wrapper.unmount();
        project.$dispose();
    });

    it('rebuilds dividers in the new editor order without resetting pane sizes', async () => {
        const project = useProjectStoreFactory('pages/reorder-editors')();
        project.$patch({
            page: {
                orientation: 'left',
                editorSizes: [20, 30, 50],
                editors: [
                    { id: 'first', value: 'first code' },
                    { id: 'second', value: 'second code' },
                    { id: 'third', value: 'third code' },
                ],
            },
        });
        const wrapper = mount(Page, {
            props: { project },
            attachTo: document.body,
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
        });
        await flushPromises();
        const container = wrapper.getComponent(EditorStub).element.parentElement;
        expect(
            Array.from(container.children, (element) => element.dataset.editorId || 'divider')
        ).toEqual(['first', 'divider', 'second', 'divider', 'third']);

        wrapper.findAllComponents(EditorStub)[0].vm.$emit('down', 'first');
        await flushPromises();

        expect(
            Array.from(container.children, (element) => element.dataset.editorId || 'divider')
        ).toEqual(['second', 'divider', 'first', 'divider', 'third']);
        expect(project.page.editorSizes).toEqual([20, 30, 50]);

        wrapper.findAllComponents(EditorStub)[2].vm.$emit('up', 'third');
        await flushPromises();

        expect(
            Array.from(container.children, (element) => element.dataset.editorId || 'divider')
        ).toEqual(['second', 'divider', 'third', 'divider', 'first']);
        expect(project.page.editorSizes).toEqual([20, 30, 50]);
        wrapper.unmount();
        project.$dispose();
    });

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
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
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
            { global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } } }
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
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
        });

        wrapper.getComponent(EditorStub).vm.$emit('update:modelValue', 'last edit');
        wrapper.unmount();

        expect(project.page.editors[0].value).toBe('last edit');
        project.$dispose();
    });
    it('changes the workspace layout through the preview controls', async () => {
        const project = useProjectStoreFactory('pages/preview-layout')();
        project.$patch({
            page: {
                orientation: 'left',
                editors: [{ id: 'editor-1', value: 'code' }],
            },
        });
        const wrapper = mount(Page, {
            props: { project },
            global: { stubs: { Editor: EditorStub, Preview: PreviewStub, Transition: false } },
        });
        const preview = wrapper.getComponent(PreviewStub);
        expect(preview.props('orientation')).toBe('left');

        preview.vm.$emit('update:orientation', 'top');
        await flushPromises();
        expect(preview.props('orientation')).toBe('top');

        preview.vm.$emit('update:orientation', 'bottom');
        await flushPromises();
        expect(preview.props('orientation')).toBe('bottom');
        preview.vm.$emit('update:orientation', 'right');
        await flushPromises();
        expect(preview.props('orientation')).toBe('right');

        wrapper.unmount();
        project.$dispose();
    });
});
