import { useNuxtApp } from '#app';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Editor from '~/components/Editor.vue';

const MonacoStub = {
    name: 'Monaco',
    props: ['value', 'language', 'tabSize', 'added', 'removed', 'focused', 'showLineNumbers'],
    template: '<div data-editor />',
};

afterEach(() => vi.restoreAllMocks());

describe('Editor', () => {
    it('toggles line numbers from editor settings without changing the code', async () => {
        const wrapper = mount(Editor, {
            props: { id: 'first', modelValue: 'original code' },
            attachTo: document.body,
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();
        expect(wrapper.getComponent(MonacoStub).props('showLineNumbers')).toBe(true);
        await wrapper.get('[aria-label="Editor settings"]').trigger('click');
        await flushPromises();
        const panel = new DOMWrapper(document.querySelector('[role="dialog"]'));
        await panel.get('[aria-label="Editor line numbers"]').trigger('click');
        expect(wrapper.emitted('update:show-line-numbers')).toEqual([[false]]);

        await wrapper.setProps({ showLineNumbers: false });
        expect(wrapper.getComponent(MonacoStub).props('showLineNumbers')).toBe(false);
        expect(wrapper.getComponent(MonacoStub).props('value')).toBe('original code');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    it('places the hide action in its own editor visibility pill', async () => {
        const wrapper = mount(Editor, {
            props: { id: 'last', canHide: true, paneId: 'code-pane' },
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();
        const pill = wrapper.get('[aria-label="Editor visibility"]');
        const hide = pill.get('[aria-label="Hide code editor"]');
        expect(pill.findAll('button')).toHaveLength(1);
        expect(
            wrapper
                .get('[aria-label="Editor tools"]')
                .find('[aria-label="Hide code editor"]')
                .exists()
        ).toBe(false);
        expect(hide.attributes('aria-controls')).toBe('code-pane');
        await hide.trigger('click');
        expect(wrapper.emitted('hide')).toEqual([[]]);
        expect(wrapper.emitted('remove')).toBeUndefined();
        wrapper.unmount();
    });

    it('shows the language, settings, and add controls in a compact dock', async () => {
        const wrapper = mount(Editor, {
            props: { id: 'first', language: 'php' },
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();

        const dock = wrapper.get('[aria-label="Editor tools"]');
        expect(dock.findAll('button')).toHaveLength(3);
        expect(dock.get('[aria-label="Code language"]').text()).toBe('php');
        expect(dock.get('[aria-label="Editor settings"]').exists()).toBe(true);
        expect(wrapper.find('.workspace-statusbar').exists()).toBe(false);

        await dock.get('[aria-label="Add editor"]').trigger('click');
        expect(wrapper.emitted('add')).toEqual([[]]);
        wrapper.unmount();
    });

    it('searches languages from the upward-opening dropdown', async () => {
        vi.spyOn(useNuxtApp().$shiki, 'languages').mockReturnValue(['php', 'javascript']);
        const wrapper = mount(Editor, {
            props: { id: 'first', language: 'php' },
            attachTo: document.body,
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();
        await wrapper.get('[aria-label="Code language"]').trigger('click');
        await flushPromises();

        const search = new DOMWrapper(
            document.querySelector('[placeholder="Search languages..."]')
        );
        await search.setValue('javascript');
        await search.trigger('keydown', { key: 'Enter' });
        await flushPromises();

        expect(wrapper.emitted('update:language')).toEqual([['javascript']]);
        expect(document.querySelector('[placeholder="Search languages..."]')).toBeNull();
        wrapper.unmount();
    });

    it('places reorder and removal actions in the dock and tab size in settings', async () => {
        const wrapper = mount(Editor, {
            props: {
                id: 'middle',
                canRemove: true,
                canMoveUp: true,
                canMoveDown: true,
                tabSize: 4,
            },
            attachTo: document.body,
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();

        const dock = wrapper.get('[aria-label="Editor tools"]');
        await dock.get('[aria-label="Move editor up"]').trigger('click');
        await dock.get('[aria-label="Move editor down"]').trigger('click');
        await dock.get('[aria-label="Remove editor"]').trigger('click');

        await wrapper.get('[aria-label="Editor settings"]').trigger('click');
        await flushPromises();

        const panel = new DOMWrapper(document.querySelector('[role="dialog"]'));
        expect(panel.get('[aria-label="Editor tab size"]').text()).toBe('4');
        wrapper.getComponent({ name: 'Select' }).vm.$emit('update:modelValue', '2');
        expect(wrapper.emitted('update:tab-size')).toEqual([['2']]);

        expect(panel.find('[aria-label="Move editor up"]').exists()).toBe(false);
        expect(panel.find('[aria-label="Move editor down"]').exists()).toBe(false);
        expect(panel.find('[aria-label="Remove editor"]').exists()).toBe(false);

        expect(wrapper.emitted('up')).toEqual([['middle']]);
        expect(wrapper.emitted('down')).toEqual([['middle']]);
        expect(wrapper.emitted('remove')).toEqual([['middle']]);
        wrapper.unmount();
    });

    it('uses horizontal reorder arrows for side-by-side editors and omits unavailable moves', async () => {
        const wrapper = mount(Editor, {
            props: {
                id: 'first',
                orientation: 'top',
                canRemove: true,
                canMoveUp: false,
                canMoveDown: true,
            },
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();

        const dock = wrapper.get('[aria-label="Editor tools"]');
        expect(dock.find('[aria-label="Move editor left"]').exists()).toBe(false);
        expect(dock.get('[aria-label="Move editor right"] svg').classes()).toContain('-rotate-90');
        await dock.get('[aria-label="Move editor right"]').trigger('click');
        expect(wrapper.emitted('down')).toEqual([['first']]);

        await wrapper.setProps({ canMoveUp: true, canMoveDown: false });
        expect(dock.find('[aria-label="Move editor right"]').exists()).toBe(false);
        await dock.get('[aria-label="Move editor left"]').trigger('click');
        expect(wrapper.emitted('up')).toEqual([['first']]);
        wrapper.unmount();
    });

    it('omits actions that are unavailable for the only editor', async () => {
        const wrapper = mount(Editor, {
            props: { id: 'only' },
            attachTo: document.body,
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();
        expect(wrapper.find('[aria-label="Remove editor"]').exists()).toBe(false);
        await wrapper.get('[aria-label="Editor settings"]').trigger('click');
        await flushPromises();

        const panel = new DOMWrapper(document.querySelector('[role="dialog"]'));
        expect(panel.find('[aria-label="Remove editor"]').exists()).toBe(false);
        expect(panel.find('[aria-label="Move editor up"]').exists()).toBe(false);
        expect(panel.find('[aria-label="Move editor down"]').exists()).toBe(false);
        expect(panel.find('[aria-label="Toggle editor layout"]').exists()).toBe(false);
        wrapper.unmount();
    });

    it('keeps Monaco bindings and code updates intact', async () => {
        const wrapper = mount(Editor, {
            props: { id: 'first', language: 'blade', tabSize: 2, modelValue: 'original' },
            global: { stubs: { Monaco: MonacoStub }, directives: { tooltip: {} } },
        });
        await flushPromises();
        const monaco = wrapper.getComponent(MonacoStub);
        expect(monaco.props()).toMatchObject({ language: 'html', tabSize: 2, value: 'original' });
        monaco.vm.$emit('update:modelValue', 'edited');
        monaco.vm.$emit('update:added', [1]);
        expect(wrapper.emitted('update:modelValue')).toEqual([['edited']]);
        expect(wrapper.emitted('update:added')).toEqual([[[1]]]);
        wrapper.unmount();
    });
});
