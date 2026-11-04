import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, onMounted } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ModalCustomBackground from '~/components/ModalCustomBackground.vue';

const { addCustomBackground, openFile, toDataURL } = vi.hoisted(() => ({
    addCustomBackground: vi.fn(() => 'custom-background'),
    openFile: vi.fn(),
    toDataURL: vi.fn(() => 'data:image/png;base64,cropped'),
}));
vi.mock('~/composables/useBackgrounds', () => ({ default: () => ({ addCustomBackground }) }));
vi.mock('~/composables/useFileDialogs', () => ({ default: () => ({ openFile }) }));

const stubs = {
    Dialog: { template: '<div><slot /></div>' },
    DialogContent: { template: '<div><slot /></div>' },
    DialogHeader: { template: '<header><slot /></header>' },
    DialogTitle: { template: '<h2><slot /></h2>' },
    DialogDescription: { template: '<p><slot /></p>' },
    Monaco: {
        props: ['value'],
        emits: ['update:modelValue'],
        template:
            '<textarea aria-label="CSS editor" :value="value" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    },
    Canvas: {
        props: ['backgroundAttributes'],
        template: '<div class="canvas-preview"><slot /></div>',
    },
    Window: { template: '<div class="code-preview">Code</div>' },
    Cropper: defineComponent({
        name: 'Cropper',
        props: ['src'],
        emits: ['change'],
        setup(_, { emit, expose }) {
            expose({
                getResult: () => ({ canvas: { toDataURL } }),
                refresh: vi.fn(),
                reset: vi.fn(),
            });
            onMounted(() => emit('change', { canvas: {} }));
        },
        template: '<div class="cropper" />',
    }),
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
        'Image',
        class {
            naturalWidth = 1200;
            naturalHeight = 800;
            decode() {
                return Promise.resolve();
            }
        }
    );
});
afterEach(() => vi.unstubAllGlobals());

describe('ModalCustomBackground', () => {
    it('saves valid CSS on the background layer without fading the code preview', async () => {
        const wrapper = mount(ModalCustomBackground, {
            props: {
                modelValue: true,
                blocks: [],
                settings: { width: 500, height: 300, scene: 'none' },
            },
            global: { stubs },
        });
        await flushPromises();
        await wrapper.get('textarea').setValue('el { background: red; opacity: 0.5; }');

        expect(wrapper.findComponent(stubs.Canvas).props('backgroundAttributes').style).toContain(
            'opacity: 0.5'
        );
        expect(wrapper.get('.code-preview').attributes('style')).toBeUndefined();
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Add background')
            .trigger('click');

        expect(addCustomBackground).toHaveBeenCalledWith({
            style: expect.stringContaining('background: red'),
        });
        expect(wrapper.emitted('saved')).toEqual([['custom-background']]);
        wrapper.unmount();
    });

    it('retains invalid CSS while switching tabs and prevents saving it', async () => {
        const wrapper = mount(ModalCustomBackground, {
            props: { modelValue: true, blocks: [], settings: { width: 500, height: 300 } },
            global: { stubs },
        });
        await flushPromises();
        await wrapper.get('textarea').setValue('body { color: red; }');
        await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'Enter' });
        await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'Enter' });

        expect(wrapper.get('textarea').element.value).toBe('body { color: red; }');
        expect(wrapper.get('[role="alert"]').text()).toContain('el');
        expect(
            wrapper
                .findAll('button')
                .find((button) => button.text() === 'Add background')
                .attributes('disabled')
        ).toBeDefined();
        expect(addCustomBackground).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it('preserves an uploaded image on picker cancellation and saves crops as PNG', async () => {
        openFile
            .mockResolvedValueOnce(new File(['image'], 'transparent.png', { type: 'image/png' }))
            .mockResolvedValueOnce(null);
        const wrapper = mount(ModalCustomBackground, {
            props: { modelValue: true, blocks: [], settings: { width: 500, height: 300 } },
            global: { stubs },
        });
        await flushPromises();
        await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'Enter' });
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Choose image')
            .trigger('click');
        await vi.waitFor(() => expect(wrapper.text()).toContain('transparent.png'));
        await flushPromises();
        expect(wrapper.find('.cropper').exists()).toBe(true);
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Replace image')
            .trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('transparent.png');
        expect(
            wrapper
                .findAll('button')
                .find((button) => button.text() === 'Add background')
                .attributes('disabled')
        ).toBeUndefined();
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Add background')
            .trigger('click');

        expect(toDataURL).toHaveBeenCalledWith('image/png');
        expect(addCustomBackground).toHaveBeenCalledWith({
            style: expect.objectContaining({
                backgroundImage: 'url(data:image/png;base64,cropped)',
            }),
        });
        wrapper.unmount();
    });

    it('ignores a file selection returned after closing and reopening the dialog', async () => {
        let chooseFile;
        openFile.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    chooseFile = resolve;
                })
        );
        const wrapper = mount(ModalCustomBackground, {
            props: { modelValue: true, blocks: [], settings: { width: 500, height: 300 } },
            global: { stubs },
        });
        await flushPromises();
        await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'Enter' });
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Choose image')
            .trigger('click');
        await wrapper.setProps({ modelValue: false });
        await wrapper.setProps({ modelValue: true });
        chooseFile(new File(['image'], 'stale.png', { type: 'image/png' }));
        await flushPromises();

        expect(wrapper.find('.cropper').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('stale.png');
        wrapper.unmount();
    });
});
