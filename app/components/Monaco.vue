<template>
    <div ref="root" :style="{ height: `${height}px` }" v-bind="$attrs"></div>
</template>

<script setup>
import { ref, watch, unref, toRefs, computed, onMounted, onBeforeUnmount, shallowRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useResizeObserver } from '@vueuse/core';
import { uniq, get, range, union, difference } from 'lodash';
import { VimMode } from 'monaco-vim';
import useFonts from '@/composables/useFonts';
import useApplicationStore from '@/composables/useApplicationStore';
import usePreferencesStore from '@/composables/usePreferencesStore';

const props = defineProps({
    value: { type: String, default: '' },
    added: { type: Array, default: () => [] },
    removed: { type: Array, default: () => [] },
    focused: { type: Array, default: () => [] },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    language: { type: String, default: 'php' },
    heightOffset: { type: Number, default: 0 },
    tabSize: { type: [String, Number], default: 4 },
});

const emit = defineEmits(['update:modelValue', 'update:added', 'update:removed', 'update:focused']);

const { language, tabSize, value, width, height, added, removed, focused } = toRefs(props);

const { $bus } = useNuxtApp();

const root = ref(null);
const editor = shallowRef(null);
const monacoRef = shallowRef(null);

const { fontFamilies } = useFonts();

const vimMode = shallowRef(null);

const addedLineDecos = ref([]);
const removedLineDecos = ref([]);
const focusedLineDecos = ref([]);

const { isDarkMode } = storeToRefs(useApplicationStore());

const {
    editorDarkTheme,
    editorLightTheme,
    editorLineHeight,
    editorFontFamily,
    editorFontLigatures,
    editorFontSize: fontSize,
    editorVimMode,
} = storeToRefs(usePreferencesStore());

function updateLayout() {
    if (root.value && root.value.offsetParent && editor.value) {
        editor.value.layout({
            width: root.value.clientWidth,
            height: height.value || root.value.clientHeight,
        });
    }
}

function makeDecoration(range, type) {
    return {
        options: {
            stickiness: 1,
            marginClassName: `line ${type}`,
        },
        range: range,
    };
}

function selectionToRange(selection) {
    return range(selection.startLineNumber, selection.endLineNumber + 1);
}

useResizeObserver(document.body, updateLayout);

const fontFamily = computed(() => {
    const font = fontFamilies.value.find((font) => font.name === editorFontFamily.value);
    return get(font, 'attributes.style.fontFamily');
});

const makeHighlightCallback = (className, ref) => () => {
    let selected = selectionToRange(editor.value.getSelection());
    const alreadySelected = unref(ref).filter((line) => selected.includes(line));

    if (difference(selected, alreadySelected).length === 0) {
        selected = unref(ref).filter((line) => !alreadySelected.includes(line));
    } else {
        selected = union(unref(ref), selected);
    }

    emit(`update:${className}`, selected);
};

const makeDecosCallback = (className, decoRef) => (lines) => {
    decoRef.value = editor.value.deltaDecorations(
        decoRef.value,
        lines.map((line) =>
            makeDecoration(
                {
                    startColumn: 0,
                    endColumn: 0,
                    startLineNumber: line,
                    endLineNumber: line,
                },
                className
            )
        )
    );
};

onMounted(async () => {
    self.MonacoEnvironment = {
        getWorker: () =>
            new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
                type: 'module',
            }),
    };

    const monaco = await import('monaco-editor');
    monacoRef.value = monaco;

    // Load themes
    const themeList = (await import('../data/monaco-themes/themelist.json')).default;

    const themeLoaders = import.meta.glob(
        ['../data/monaco-themes/*.json', '!../data/monaco-themes/themelist.json'],
        { import: 'default' }
    );

    await Promise.all(
        Object.keys(themeList).map(async (theme) => {
            const loader = themeLoaders[`../data/monaco-themes/${themeList[theme]}.json`];
            if (loader) {
                monaco.editor.defineTheme(theme, await loader());
            }
        })
    );

    editor.value = monaco.editor.create(root.value, {
        value: value.value,
        tabSize: tabSize.value,
        fontSize: fontSize.value,
        fontFamily: fontFamily.value,
        lineHeight: editorLineHeight.value,
        fontLigatures: editorFontLigatures.value,
        language: language.value,
        insertSpaces: true,
        padding: { top: 16, bottom: 56 },
        minimap: { enabled: false },
        fixedOverflowWidgets: true,
        renderLineHighlight: false,
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 6,
        theme: isDarkMode.value ? editorDarkTheme.value : editorLightTheme.value,
    });

    vimMode.value = new VimMode(editor.value);

    if (editorVimMode.value) {
        vimMode.value.attach();
    }

    watch(editorVimMode, (enabled) => {
        if (enabled) {
            vimMode.value.attach();
        } else {
            VimMode.keyMap.vim.detach(vimMode.value);
            vimMode.value.leaveVimMode();
        }
    });

    editor.value.addAction({
        id: 'add',
        label: 'Added Line',
        contextMenuGroupId: 'actions',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyA],
        run: makeHighlightCallback('added', added),
    });

    editor.value.addAction({
        id: 'remove',
        label: 'Removed Line',
        contextMenuGroupId: 'actions',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR],
        run: makeHighlightCallback('removed', removed),
    });

    editor.value.addAction({
        id: 'focus',
        label: 'Focused Line',
        contextMenuGroupId: 'actions',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
        run: makeHighlightCallback('focused', focused),
    });

    editor.value.onDidChangeModelContent((event) => {
        const currentValue = editor.value.getValue();
        if (currentValue !== value.value) {
            emit('update:modelValue', currentValue, event);
        }
    });

    $bus.$on('editors:refresh', updateLayout);

    watch(isDarkMode, (enabled) => {
        monaco.editor.setTheme(enabled ? editorDarkTheme.value : editorLightTheme.value);
    });

    watch(language, (lang) => {
        monaco.editor.setModelLanguage(editor.value.getModel(), lang);
    });

    watch(tabSize, (size) => editor.value.updateOptions({ tabSize: parseInt(size) }));
    watch(fontSize, (size) => editor.value.updateOptions({ fontSize: parseInt(size) }));
    watch(fontFamily, (family) => editor.value.updateOptions({ fontFamily: family }));
    watch(editorLineHeight, (h) => editor.value.updateOptions({ lineHeight: h }));
    watch(editorFontLigatures, (enabled) => editor.value.updateOptions({ fontLigatures: enabled }));

    watch(value, () => {
        if (value.value !== editor.value.getValue()) {
            editor.value.setValue(value.value);
        }
    });

    watch(value, () => {
        const decos = editor.value
            .getModel()
            .getAllDecorations()
            .filter((deco) => deco.options.marginClassName?.includes('line'));

        ['added', 'removed', 'focused'].forEach((className) => {
            const lines = decos
                .filter((deco) => deco.options.marginClassName?.includes(className))
                .map((deco) => deco.range.startLineNumber);

            emit(`update:${className}`, uniq(lines));
        });
    });

    watch([width, height], updateLayout);

    watch(editorDarkTheme, (theme) => {
        if (isDarkMode.value) monaco.editor.setTheme(theme);
    });

    watch(editorLightTheme, (theme) => {
        if (!isDarkMode.value) monaco.editor.setTheme(theme);
    });

    watch(added, makeDecosCallback('added', addedLineDecos), { immediate: true });
    watch(removed, makeDecosCallback('removed', removedLineDecos), { immediate: true });
    watch(focused, makeDecosCallback('focused', focusedLineDecos), { immediate: true });
});

onBeforeUnmount(() => {
    if (editor.value) {
        vimMode.value?.dispose();
        editor.value.dispose();
    }
});
</script>

<style>
.monaco-editor textarea {
    @apply focus:ring-0;
}

.monaco-editor .line.focused::before {
    @apply ml-1 h-1.5 w-1.5 whitespace-pre rounded bg-blue-500;
    content: ' ';
}

.monaco-editor .line.added::before {
    @apply ml-3 h-1.5 w-1.5 whitespace-pre rounded bg-green-500;
    content: ' ';
}

.monaco-editor .line.removed::before {
    @apply ml-5 h-1.5 w-1.5 whitespace-pre rounded bg-red-500;
    content: ' ';
}

.monaco-editor .line {
    @apply flex items-center justify-start;
}

.monaco-editor .parameter-hints-widget {
    border: 0;
}

.monaco-editor .parameter-hints-widget .signature {
    padding: 0;
}

.monaco-editor .suggest-widget {
    border: 0;
}

.monaco-editor.vs-dark .suggest-widget {
    border: 0;
}

.monaco-editor.rename-box,
.monaco-hover {
    top: 0;
}

.monaco-editor .decorationsOverviewRuler {
    display: none !important;
}

.monaco-scrollable-element > .scrollbar > .slider {
    border-radius: 9999px;
}

.monaco-scrollable-element > .scrollbar {
    background: transparent !important;
}

.monaco-scrollable-element > .scrollbar.vertical {
    width: 10px !important;
    right: 2px !important;
}

.monaco-scrollable-element > .scrollbar.vertical > .slider {
    width: 4px !important;
    left: 3px !important;
}

.monaco-scrollable-element > .scrollbar.horizontal {
    height: 10px !important;
    bottom: 2px !important;
}

.monaco-scrollable-element > .scrollbar.horizontal > .slider {
    height: 4px !important;
    top: 3px !important;
}
</style>
