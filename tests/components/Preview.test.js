import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Preview from '~/components/Preview.vue';

const buildCodeBlocks = vi.hoisted(() => vi.fn(async () => {}));
const toJpeg = vi.hoisted(() => vi.fn(async () => 'data:image/jpeg;base64,thumbnail'));
vi.mock('html-to-image', () => ({ toJpeg }));
vi.mock('~/composables/useShiki', () => ({ default: () => ({ buildCodeBlocks }) }));
vi.mock('~/composables/usePanZoom', () => ({
    default: () => ({
        zoom: ref(1),
        centerGuides: {},
        createPanZoom: vi.fn(),
    }),
}));

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
        finish();
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
});
