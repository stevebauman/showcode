import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, nextTick, reactive, ref } from 'vue';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import Preview from '~/components/Preview.vue';

const highlighted = { blocks: [], themeType: 'dark', themeBackground: '#000000' };
const buildCodeBlocks = vi.hoisted(() => vi.fn());
const copy = vi.hoisted(() => vi.fn());
const download = vi.hoisted(() => vi.fn());
const toPng = vi.hoisted(() => vi.fn(async () => 'png'));
const toBlob = vi.hoisted(() => vi.fn(async () => new Blob(['image'])));
vi.mock('downloadjs', () => ({ default: download }));
vi.mock('ua-parser-js', () => ({
    UAParser: class {
        getBrowser() {
            return { name: 'Safari' };
        }
    },
}));
vi.mock('~/composables/useClipboard', () => ({ default: () => ({ copy, copied: ref(false) }) }));
const toJpeg = vi.hoisted(() => vi.fn(async () => 'data:image/jpeg;base64,thumbnail'));
vi.mock('html-to-image', () => ({ toJpeg, toPng, toBlob }));
vi.mock('~/composables/useShiki', () => ({ default: () => ({ buildCodeBlocks }) }));
vi.mock('~/composables/usePanZoom', () => ({
    default: () => ({
        zoom: ref(1),
        centerGuides: {},
        createPanZoom: vi.fn(),
    }),
}));

beforeEach(() => buildCodeBlocks.mockResolvedValue(highlighted));

afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
});

describe('Preview', () => {
    it('only offers reopening the code editor when its pane is hidden', async () => {
        const wrapper = mount(Preview, {
            shallow: true,
            attachTo: document.body,
            props: { code: [], settings: {}, viewport: {}, languages: [], editorId: 'code-pane' },
            global: { stubs: { Button: false, Primitive: false }, directives: { tooltip: {} } },
        });
        await flushPromises();
        expect(wrapper.find('[aria-label="Hide code editor"]').exists()).toBe(false);
        expect(wrapper.find('[aria-label="Show code editor"]').exists()).toBe(false);

        await wrapper.setProps({ editorOpen: false });
        const button = wrapper.get('button[aria-label="Show code editor"]');

        expect(
            wrapper.get('[aria-label="Editor visibility"]').element.contains(button.element)
        ).toBe(true);
        expect(wrapper.get('[aria-label="Preview tools"]').element.contains(button.element)).toBe(
            false
        );
        expect(button.attributes('aria-controls')).toBe('code-pane');
        expect(wrapper.get('[aria-label="Editor visibility"]').findAll('button')).toHaveLength(1);
        expect(button.attributes('aria-expanded')).toBe('false');
        wrapper.vm.focusEditorToggle();
        expect(document.activeElement).toBe(button.element);
        await button.trigger('click');
        expect(wrapper.emitted('update:editorOpen')).toEqual([[true]]);
        await wrapper.setProps({ editorOpen: true });
        expect(wrapper.find('[aria-label="Show code editor"]').exists()).toBe(false);
        wrapper.unmount();
    });

    it('keeps the selected inspector panel when collapsed without changing the document', async () => {
        const wrapper = mount(Preview, {
            shallow: true,
            attachTo: document.body,
            props: { code: [], settings: {}, viewport: {}, languages: [] },
            global: {
                mocks: { $shiki: { themes: () => ['github-dark'] } },
                stubs: { Button: false, ControlTabs: false, ControlTab: false },
                directives: { tooltip: {} },
            },
        });
        await flushPromises();
        const panels = wrapper.get('[aria-label="Inspector panels"]');
        await panels.findAll('[role="tab"]')[1].trigger('click');
        const changes = wrapper.emitted('update:touched')?.length ?? 0;

        expect(wrapper.findAll('[aria-label="Hide inspector"]')).toHaveLength(1);
        expect(
            wrapper
                .get('[aria-label="Inspector controls"]')
                .find('[aria-label="Inspector panels"]')
                .exists()
        ).toBe(true);
        expect(
            wrapper
                .get('[aria-label="Inspector controls"]')
                .find('[aria-label="Hide inspector"]')
                .exists()
        ).toBe(true);
        expect(wrapper.find('[aria-label="Show inspector"]').exists()).toBe(false);

        await wrapper.get('button[aria-label="Hide inspector"]').trigger('click');

        expect(wrapper.get('aside').isVisible()).toBe(false);
        expect(wrapper.get('aside').attributes('aria-hidden')).toBe('true');
        expect(wrapper.get('.inspector-shell').attributes('data-open')).toBe('false');
        expect(wrapper.get('[aria-label="Show inspector"]').attributes('aria-expanded')).toBe(
            'false'
        );
        expect(document.activeElement).toBe(wrapper.get('[aria-label="Show inspector"]').element);

        await wrapper.get('[aria-label="Show inspector"]').trigger('click');

        expect(wrapper.get('aside').isVisible()).toBe(true);
        expect(wrapper.get('aside').attributes('aria-hidden')).toBe('false');
        expect(wrapper.get('.inspector-shell').attributes('data-open')).toBe('true');
        expect(wrapper.find('[aria-label="Show inspector"]').exists()).toBe(false);
        expect(document.activeElement).toBe(wrapper.get('[aria-label="Hide inspector"]').element);
        expect(panels.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true');
        expect(wrapper.emitted('update:touched')?.length ?? 0).toBe(changes);
        wrapper.unmount();
    });

    it('keeps appearance changes in the supplied settings when switching tabs', async () => {
        const showing = ref(true);
        const settings = reactive({});
        const wrapper = mount(
            defineComponent({
                components: { Preview },
                setup: () => ({ showing, settings }),
                template:
                    '<KeepAlive><Preview v-if="showing" :code="[]" :settings="settings" :viewport="{}" :languages="[]" /></KeepAlive>',
            }),
            { shallow: true, global: { stubs: { Preview: false, KeepAlive: false } } }
        );
        const preview = wrapper.getComponent(Preview);
        preview.vm.$.setupState.settings.showShadow = false;

        expect(settings.showShadow).toBe(false);

        showing.value = false;
        await nextTick();
        showing.value = true;
        await nextTick();

        expect(wrapper.getComponent(Preview).vm.$.setupState.settings).toBe(settings);
        expect(settings.showShadow).toBe(false);
        wrapper.unmount();
    });

    it('cancels queued tokenization before saving an explicit preview', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Preview, {
            shallow: true,
            props: { code: [], settings: {}, viewport: {}, languages: [] },
        });
        await flushPromises();
        buildCodeBlocks.mockClear();
        await wrapper.setProps({ code: [{ id: 'editor', value: 'latest code' }] });
        let finish;
        buildCodeBlocks.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve;
                })
        );
        const saving = wrapper.vm.captureThumbnail();
        await vi.advanceTimersByTimeAsync(200);

        expect(buildCodeBlocks).toHaveBeenCalledOnce();
        expect(buildCodeBlocks.mock.lastCall[0].code[0].value).toBe('latest code');
        finish(highlighted);
        await saving;
        wrapper.unmount();
    });
    it('does not schedule another thumbnail when the generated image changes', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Preview, {
            shallow: true,
            attachTo: document.body,
            props: { code: [], settings: {}, viewport: {}, languages: [] },
        });
        wrapper.vm.$.setupState.settings.showShadow = false;
        await nextTick();
        await vi.advanceTimersByTimeAsync(7000);
        await vi.dynamicImportSettled();

        expect(toJpeg).toHaveBeenCalledOnce();
        await vi.advanceTimersByTimeAsync(15000);
        expect(toJpeg).toHaveBeenCalledOnce();
        wrapper.unmount();
    });
    it('waits for freshly highlighted code before exporting an image', async () => {
        const wrapper = mount(Preview, {
            shallow: true,
            attachTo: document.body,
            props: { code: [], settings: {}, viewport: {}, languages: [] },
        });
        await flushPromises();
        let finish;
        buildCodeBlocks.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve;
                })
        );
        await wrapper.setProps({ code: [{ id: 'editor', value: 'latest code' }] });
        wrapper.vm.$.setupState.saveAs('toPng');
        await flushPromises();
        expect(download).not.toHaveBeenCalled();
        expect(toPng).not.toHaveBeenCalled();
        finish({ ...highlighted, blocks: ['latest tokens'] });
        await flushPromises();

        expect(wrapper.vm.$.setupState.blocks).toEqual(['latest tokens']);
        expect(toPng).toHaveBeenCalledOnce();
        expect(download).toHaveBeenCalledWith('png', 'Untitled-1.png');
        wrapper.unmount();
    });

    it('gives Safari its clipboard promise immediately while waiting for fresh highlighting', async () => {
        copy.mockImplementation((content) => Promise.resolve(content));
        const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {} });
        const wrapper = mount(Preview, {
            shallow: true,
            attachTo: document.body,
            props: { code: [], settings: {}, viewport: {}, languages: [] },
        });
        await flushPromises();
        let finish;
        buildCodeBlocks.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve;
                })
        );
        await wrapper.setProps({ code: [{ id: 'editor', value: 'latest code' }] });
        const copying = wrapper.vm.$.setupState.copyToClipboard();
        expect(copy).toHaveBeenCalledExactlyOnceWith(expect.any(Promise));
        expect(toBlob).not.toHaveBeenCalled();
        expect(wrapper.vm.$.setupState.copying).toBe(true);
        wrapper.vm.$.setupState.copyToClipboard();
        expect(copy).toHaveBeenCalledOnce();
        await vi.waitFor(() => expect(finish).toBeTypeOf('function'));
        finish(highlighted);
        await expect(copy.mock.lastCall[0]).resolves.toBeInstanceOf(Blob);
        await copying;
        expect(wrapper.vm.$.setupState.copying).toBe(false);
        expect(toBlob).toHaveBeenCalledOnce();
        wrapper.unmount();
        if (clipboard) Object.defineProperty(navigator, 'clipboard', clipboard);
        else delete navigator.clipboard;
    });
});
