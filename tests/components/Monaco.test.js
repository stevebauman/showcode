import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import Monaco from '~/components/Monaco.client.vue';
import usePreferencesStore from '~/composables/usePreferencesStore';
import useApplicationStore from '~/composables/useApplicationStore';

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
        getModel: vi.fn(() => ({ getAllDecorations: () => [] })),
        updateOptions: vi.fn(),
        getValue: vi.fn(() => 'original code'),
        setValue: vi.fn(),
    };

    const api = {
        editor: {
            create: vi.fn(() => instance),
            remeasureFonts: vi.fn(),
            setTheme: vi.fn(),
            setModelLanguage: vi.fn(),
        },
        KeyMod: { CtrlCmd: 1, Shift: 2 },
        KeyCode: { KeyA: 1, KeyR: 2, KeyF: 3 },
    };

    return {
        loading,
        release,
        instance,
        api,
        create: api.editor.create,
        prepare: vi.fn(async () => {
            await loading;
            return api;
        }),
        loadLanguage: vi.fn(async () => {}),
        loadTheme: vi.fn(async () => {}),
    };
});

vi.mock('~/composables/useMonaco', () => ({
    default: () => ({
        prepare: monaco.prepare,
        loadLanguage: monaco.loadLanguage,
        loadTheme: monaco.loadTheme,
    }),
}));

describe('Monaco', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
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
    it('keeps the latest language when lazy imports resolve out of order', async () => {
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { ready: Promise.resolve() },
        });
        const wrapper = mount(Monaco, { props: { language: 'php' } });
        await flushPromises();
        let release;
        monaco.loadLanguage.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    release = resolve;
                })
        );
        await wrapper.setProps({ language: 'python' });
        await wrapper.setProps({ language: 'json' });
        await flushPromises();
        release();
        await flushPromises();

        expect(monaco.api.editor.setModelLanguage.mock.lastCall[1]).toBe('json');
        expect(monaco.api.editor.setModelLanguage).not.toHaveBeenCalledWith(
            expect.anything(),
            'python'
        );
        wrapper.unmount();
    });

    it('discards pending language and theme updates after unmount', async () => {
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { ready: Promise.resolve() },
        });
        let releaseLanguage;
        let releaseTheme;
        monaco.loadLanguage.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    releaseLanguage = resolve;
                })
        );
        monaco.loadTheme.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    releaseTheme = resolve;
                })
        );
        const wrapper = mount(Monaco);
        await flushPromises();
        wrapper.unmount();
        releaseLanguage();
        releaseTheme();
        await flushPromises();

        expect(monaco.api.editor.setModelLanguage).not.toHaveBeenCalled();
        expect(monaco.api.editor.setTheme).not.toHaveBeenCalled();
    });
    it('loads the current language when it changes before the editor finishes preparing', async () => {
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { ready: Promise.resolve() },
        });
        let release;
        monaco.prepare.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    release = resolve;
                })
        );
        const wrapper = mount(Monaco, { props: { language: 'php' } });
        await wrapper.setProps({ language: 'json' });
        release(monaco.api);
        await flushPromises();

        expect(monaco.loadLanguage).toHaveBeenCalledWith('json');
        expect(monaco.api.editor.setModelLanguage.mock.lastCall[1]).toBe('json');
        wrapper.unmount();
    });

    it('keeps the latest theme when lazy imports resolve out of order', async () => {
        Object.defineProperty(document, 'fonts', {
            configurable: true,
            value: { ready: Promise.resolve() },
        });
        const preferences = usePreferencesStore();
        useApplicationStore().isDarkMode = true;
        const originalTheme = preferences.editorDarkTheme;
        const wrapper = mount(Monaco);
        await flushPromises();
        let release;
        monaco.loadTheme.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    release = resolve;
                })
        );
        preferences.editorDarkTheme = 'monokai';
        await nextTick();
        preferences.editorDarkTheme = 'dracula';
        await flushPromises();
        release();
        await flushPromises();

        expect(monaco.api.editor.setTheme.mock.lastCall[0]).toBe('dracula');
        expect(monaco.api.editor.setTheme).not.toHaveBeenCalledWith('monokai');
        wrapper.unmount();
        preferences.editorDarkTheme = originalTheme;
    });
});
