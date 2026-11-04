<template>
    <div ref="root" class="w-full" :style="{ height: height ? `${height}px` : '100%' }"></div>
</template>

<script setup>
import {
    ref,
    watch,
    unref,
    toRefs,
    computed,
    onMounted,
    onBeforeUnmount,
    shallowRef,
    effectScope,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useMutationObserver, usePreferredReducedMotion, useResizeObserver } from '@vueuse/core';
import { uniq, get, range, union, difference } from 'lodash';
import useFonts from '@/composables/useFonts';
import useMonaco from '@/composables/useMonaco';
import useApplicationStore from '@/composables/useApplicationStore';
import usePreferencesStore from '@/composables/usePreferencesStore';
import '@/assets/css/monaco-menu.css';
import monacoMenuStyles from '@/assets/css/monaco-menu.css?inline';

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
    compact: { type: Boolean, default: false },
    showLineNumbers: { type: Boolean, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'update:added', 'update:removed', 'update:focused']);

const { language, tabSize, value, height, added, removed, focused } = toRefs(props);

const { $bus } = useNuxtApp();

const root = ref(null);
const editor = shallowRef(null);
const monacoRef = shallowRef(null);
let focusWhenReady = false;

function focus() {
    focusWhenReady = true;
    editor.value?.focus();
}

defineExpose({ focus });

const { fontFamilies } = useFonts();
const { prepare, loadLanguage, loadTheme } = useMonaco();

const addedLineDecos = ref([]);
const removedLineDecos = ref([]);
const focusedLineDecos = ref([]);
const isEditorTyping = ref(false);

const { isDarkMode } = storeToRefs(useApplicationStore());

const {
    editorDarkTheme,
    editorLightTheme,
    editorLineHeight,
    editorFontFamily,
    editorFontLigatures,
    editorFontSize: fontSize,
} = storeToRefs(usePreferencesStore());

const editorScope = effectScope();
const showLineNumbers = computed(() => props.showLineNumbers ?? !props.compact);
const reducedMotion = usePreferredReducedMotion();
const motionOptions = computed(() => ({
    cursorBlinking: reducedMotion.value === 'reduce' ? 'solid' : 'smooth',
    cursorSmoothCaretAnimation: reducedMotion.value === 'reduce' ? 'off' : 'explicit',
    smoothScrolling: reducedMotion.value !== 'reduce',
}));
const activeTheme = computed(() =>
    isDarkMode.value ? editorDarkTheme.value : editorLightTheme.value
);

let layoutFrame = null;

function updateLayout() {
    layoutFrame = null;

    if (root.value && root.value.offsetParent && editor.value) {
        editor.value.layout({
            width: root.value.clientWidth,
            height: height.value || root.value.clientHeight,
        });
    }
}

function scheduleLayout() {
    if (layoutFrame) {
        cancelAnimationFrame(layoutFrame);
    }

    layoutFrame = requestAnimationFrame(updateLayout);
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

useResizeObserver(root, scheduleLayout);

// Monaco's context menus live in a shadow root, outside the page's styles.
useMutationObserver(
    root,
    (mutations) => {
        for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
                if (!node.shadowRoot) continue;

                const style = document.createElement('style');
                style.textContent = monacoMenuStyles;
                node.shadowRoot.append(style);
            }
        }
    },
    { childList: true, subtree: true }
);

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
    const initialTheme = activeTheme.value;
    const monaco = await prepare({ language: language.value, theme: initialTheme });
    monacoRef.value = monaco;

    if (!root.value) return;

    editor.value = monaco.editor.create(root.value, {
        value: value.value,
        tabSize: tabSize.value,
        fontSize: fontSize.value,
        fontFamily: fontFamily.value,
        lineHeight: editorLineHeight.value,
        fontLigatures: editorFontLigatures.value,
        language: language.value,
        insertSpaces: true,
        padding: props.compact ? { top: 12, bottom: 12 } : { top: 20, bottom: 64 },
        minimap: { enabled: false },
        fixedOverflowWidgets: !props.compact,
        renderLineHighlight: 'line',
        renderLineHighlightOnlyWhenFocus: true,
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 3,
        lineNumbers: showLineNumbers.value ? 'on' : 'off',
        lineDecorationsWidth: props.compact ? 12 : 24,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        ariaLabel: props.compact ? 'Background CSS' : 'Editor content',
        ...motionOptions.value,
        theme: initialTheme,
    });

    if (focusWhenReady) editor.value.focus();

    document.fonts.ready.then(() => monaco.editor.remeasureFonts());

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
            isEditorTyping.value = true;
            emit('update:modelValue', currentValue, event);
        }
    });

    $bus.$on('editors:refresh', scheduleLayout);

    editorScope.run(() => {
        watch(showLineNumbers, (visible) =>
            editor.value.updateOptions({ lineNumbers: visible ? 'on' : 'off' })
        );
        watch(motionOptions, (options) => editor.value.updateOptions(options));
        watch(
            activeTheme,
            async (theme, _, onCleanup) => {
                let cancelled = false;
                onCleanup(() => {
                    cancelled = true;
                });

                await loadTheme(theme);
                if (!cancelled) monaco.editor.setTheme(theme);
            },
            { immediate: true }
        );

        watch(
            language,
            async (lang, _, onCleanup) => {
                let cancelled = false;
                onCleanup(() => {
                    cancelled = true;
                });

                await loadLanguage(lang);
                if (!cancelled) monaco.editor.setModelLanguage(editor.value.getModel(), lang);
            },
            { immediate: true }
        );

        watch(tabSize, (size) => editor.value.updateOptions({ tabSize: parseInt(size) }));
        watch(fontSize, (size) => editor.value.updateOptions({ fontSize: parseInt(size) }));
        watch(fontFamily, (family) => {
            editor.value.updateOptions({ fontFamily: family });
            document.fonts.ready.then(() => monaco.editor.remeasureFonts());
        });
        watch(editorLineHeight, (h) => editor.value.updateOptions({ lineHeight: h }));
        watch(editorFontLigatures, (enabled) =>
            editor.value.updateOptions({ fontLigatures: enabled })
        );

        watch(value, () => {
            if (isEditorTyping.value) {
                isEditorTyping.value = false;
                return;
            }

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

        watch(height, scheduleLayout);

        watch(added, makeDecosCallback('added', addedLineDecos), { immediate: true });
        watch(removed, makeDecosCallback('removed', removedLineDecos), { immediate: true });
        watch(focused, makeDecosCallback('focused', focusedLineDecos), { immediate: true });
    });
});

onBeforeUnmount(() => {
    if (layoutFrame) {
        cancelAnimationFrame(layoutFrame);
    }

    editorScope.stop();
    $bus.$off('editors:refresh', scheduleLayout);
    editor.value?.dispose();
});
</script>

<style>
@reference '~/assets/css/app.css';

:root :is(.monaco-editor, .monaco-component) {
    --vscode-editor-background: var(--ui-canvas);
    --vscode-editorGutter-background: var(--ui-canvas);
    --vscode-editorLineNumber-foreground: color-mix(in srgb, var(--ui-muted) 70%, var(--ui-canvas));
    --vscode-editorLineNumber-activeForeground: var(--ui-text);
    --vscode-editorCursor-foreground: var(--ui-text);
    --vscode-editor-selectionBackground: color-mix(in srgb, var(--ui-focus) 30%, transparent);
    --vscode-editor-inactiveSelectionBackground: color-mix(
        in srgb,
        var(--ui-focus) 16%,
        transparent
    );
    --vscode-editor-lineHighlightBackground: color-mix(in srgb, var(--ui-text) 4%, transparent);
    --vscode-editor-lineHighlightBorder: transparent;
    --vscode-editor-selectionHighlightBackground: color-mix(
        in srgb,
        var(--ui-focus) 12%,
        transparent
    );
    --vscode-editorWidget-background: var(--ui-popup-surface);
    --vscode-editorWidget-foreground: var(--ui-text);
    --vscode-editorWidget-border: var(--ui-line);
    --vscode-editorHoverWidget-background: var(--ui-popup-surface);
    --vscode-editorHoverWidget-foreground: var(--ui-text);
    --vscode-editorHoverWidget-border: var(--ui-line);
    --vscode-editorHoverWidget-statusBarBackground: transparent;
    --vscode-editorSuggestWidget-background: var(--ui-popup-surface);
    --vscode-editorSuggestWidget-foreground: var(--ui-text);
    --vscode-editorSuggestWidget-border: var(--ui-line);
    --vscode-editorSuggestWidget-selectedBackground: var(--ui-selected);
    --vscode-editorSuggestWidget-selectedForeground: var(--ui-text);
    --vscode-editorSuggestWidget-highlightForeground: var(--ui-focus);
    --vscode-editorSuggestWidget-focusHighlightForeground: var(--ui-text);
    --vscode-input-background: var(--ui-field);
    --vscode-input-foreground: var(--ui-text);
    --vscode-input-border: var(--ui-line);
    --vscode-input-placeholderForeground: var(--ui-muted);
    --vscode-focusBorder: var(--ui-focus);
    --vscode-widget-border: var(--ui-line);
    --vscode-menu-background: var(--ui-popup-surface);
    --vscode-menu-foreground: var(--ui-text);
    --vscode-menu-border: var(--ui-line);
    --vscode-menu-selectionBackground: var(--ui-selected);
    --vscode-menu-selectionForeground: var(--ui-text);
    --vscode-menu-selectionBorder: transparent;
    --vscode-menu-separatorBackground: var(--ui-line);
    --vscode-list-hoverBackground: var(--ui-hover);
    --vscode-list-activeSelectionBackground: var(--ui-selected);
    --vscode-list-activeSelectionForeground: var(--ui-text);
    --vscode-list-focusBackground: var(--ui-selected);
    --vscode-list-focusForeground: var(--ui-text);
    --vscode-scrollbarSlider-background: color-mix(in srgb, var(--ui-muted) 30%, transparent);
    --vscode-scrollbarSlider-hoverBackground: color-mix(in srgb, var(--ui-muted) 50%, transparent);
    --vscode-scrollbarSlider-activeBackground: color-mix(in srgb, var(--ui-muted) 65%, transparent);
}

.monaco-editor textarea {
    @apply focus:ring-0;
}

:root .monaco-editor:not(:focus-within) .line-numbers.active-line-number {
    color: var(--vscode-editorLineNumber-foreground);
}

:root .monaco-editor .view-overlays .current-line {
    background: var(--vscode-editor-lineHighlightBackground);
    border: 0;
}

.monaco-editor .line.focused::before {
    @apply size-1.5 rounded-sm bg-blue-500 whitespace-pre;
    content: ' ';
}

.monaco-editor .line.added::before {
    @apply ml-2 size-1.5 rounded-sm bg-green-500 whitespace-pre;
    content: ' ';
}

.monaco-editor .line.removed::before {
    @apply ml-4 size-1.5 rounded-sm bg-red-500 whitespace-pre;
    content: ' ';
}

.monaco-editor .line {
    @apply flex items-center justify-start;
}

:root
    .monaco-editor
    :is(.parameter-hints-widget, .suggest-widget, .suggest-details, .rename-box, .find-widget),
:root .monaco-hover {
    border: 1px solid var(--ui-line);
    border-radius: var(--radius-popup);
    background: var(--ui-popup-surface);
    -webkit-backdrop-filter: var(--ui-popup-filter);
    backdrop-filter: var(--ui-popup-filter);
    color: var(--ui-text);
    box-shadow: var(--ui-shadow);
}

:root .monaco-editor .find-widget {
    margin-top: 8px;
}

:root .monaco-editor :is(.suggest-widget, .suggest-details),
:root .monaco-hover {
    overflow: hidden;
}

:root .monaco-editor .suggest-widget .monaco-list-row {
    border-radius: var(--radius-control);
}

:root .monaco-editor .suggest-widget .monaco-list-rows {
    background: transparent;
}

:root .monaco-editor .parameter-hints-widget .signature {
    padding: 8px 12px;
}

:root .monaco-editor .monaco-inputbox,
:root .monaco-editor .rename-input {
    border-radius: var(--radius-control);
}

:root .monaco-editor .monaco-inputbox > .ibwrapper > .input {
    border-radius: inherit;
}

:root .monaco-editor .monaco-findInput .monaco-custom-toggle,
:root .monaco-editor .find-widget .button {
    border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
    .monaco-editor .find-widget,
    .context-view.monaco-menu-container {
        animation: none;
        transition: none;
    }
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
