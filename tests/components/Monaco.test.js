import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import Monaco from '~/components/Monaco.vue';

const monaco = vi.hoisted(() => {
    let release;
    const loading = new Promise((resolve) => {
        release = resolve;
    });
    const instance = {
        addAction: vi.fn(),
        onDidChangeModelContent: vi.fn(),
        deltaDecorations: vi.fn(() => []),
        layout: vi.fn(),
        dispose: vi.fn(),
    };

    return { loading, release, instance, create: vi.fn(() => instance) };
});

vi.mock('monaco-editor', async () => {
    await monaco.loading;

    return {
        editor: { create: monaco.create, remeasureFonts: vi.fn(), defineTheme: vi.fn() },
        KeyMod: { CtrlCmd: 1, Shift: 2 },
        KeyCode: { KeyA: 1, KeyR: 2, KeyF: 3 },
    };
});
vi.mock('../../app/data/monaco-themes/themelist.json', () => ({ default: {} }));

describe('Monaco', () => {
    it('finishes loading while its tab is cached and reuses the editor on return', async () => {
        const fonts = Object.getOwnPropertyDescriptor(document, 'fonts');
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { ready: Promise.resolve() },
        });
        const showing = ref(true);
        const wrapper = mount(
            defineComponent({
                components: { Monaco },
                setup: () => ({ showing }),
                template: '<KeepAlive><Monaco v-if="showing" value="original code" /></KeepAlive>',
            }),
            { attachTo: document.body }
        );
        const root = wrapper.getComponent(Monaco).element;

        try {
            showing.value = false;
            await nextTick();
            expect(root.isConnected).toBe(false);

            monaco.release();
            await flushPromises();

            await vi.waitFor(() =>
                expect(monaco.create).toHaveBeenCalledExactlyOnceWith(
                    root,
                    expect.objectContaining({ value: 'original code' })
                )
            );
            await flushPromises();

            showing.value = true;
            await nextTick();
            expect(wrapper.getComponent(Monaco).element).toBe(root);
            expect(monaco.create).toHaveBeenCalledTimes(1);

            wrapper.unmount();
            expect(monaco.instance.dispose).toHaveBeenCalledOnce();
        } finally {
            wrapper.unmount();
            if (fonts) Object.defineProperty(document, 'fonts', fonts);
            else delete document.fonts;
        }
    });

    it('does not create an editor after its component is unmounted', async () => {
        monaco.create.mockClear();
        const wrapper = mount(Monaco, { attachTo: document.body });

        wrapper.unmount();
        await flushPromises();

        expect(monaco.create).not.toHaveBeenCalled();
    });
});
