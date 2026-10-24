import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
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
    it('flushes recent appearance changes when switching away from a cached tab', async () => {
        vi.useFakeTimers();
        const showing = ref(true);
        const updates = vi.fn();
        const wrapper = mount(
            defineComponent({
                components: { Preview },
                setup: () => ({ showing, updates }),
                template:
                    '<KeepAlive><Preview v-if="showing" :code="[]" :defaults="{}" :viewport="{}" :languages="[]" @update:settings="updates" /></KeepAlive>',
            }),
            { shallow: true, global: { stubs: { Preview: false, KeepAlive: false } } }
        );
        const preview = wrapper.getComponent(Preview);
        preview.vm.$.setupState.settings.showShadow = false;
        await nextTick();
        expect(updates).not.toHaveBeenCalled();

        showing.value = false;
        await nextTick();

        expect(updates.mock.lastCall[0].showShadow).toBe(false);
        wrapper.unmount();
    });

    it('cancels queued tokenization before saving an explicit preview', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Preview, {
            shallow: true,
            props: { code: [], defaults: {}, viewport: {}, languages: [] },
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
        const saving = wrapper.vm.flushProjectPreview();
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
            props: { code: [], defaults: {}, viewport: {}, languages: [] },
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
            props: { code: [], defaults: {}, viewport: {}, languages: [] },
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
            props: { code: [], defaults: {}, viewport: {}, languages: [] },
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
