<template>
    <div ref="root" :style="{ height: `${height}px` }"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
import { LIGHTS_OUT } from './ToggleDarkMode';
import {
    ref,
    watch,
    toRefs,
    onMounted,
    useContext,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';
import { useResizeObserver } from '@vueuse/core';

monaco.editor.defineTheme('oneanic-next', require('monaco-themes/themes/Oceanic Next.json'));

export default {
    props: {
        value: String,
        width: Number,
        height: Number,
        language: String,
        heightOffset: Number,
        tabSize: [String, Number],
    },

    setup(props, { emit }) {
        const { language, tabSize, value, width, height } = toRefs(props);

        const { $bus, $memory } = useContext();

        const root = ref(null);
        const editor = ref(null);

        const updateLayout = () => {
            if (root.value && root.value.offsetParent) {
                editor.value.layout({
                    width: root.value.clientWidth,
                    height: height.value || root.value.clientHeight,
                });
            }
        };

        useResizeObserver(document.body, updateLayout);

        onMounted(async () => {
            const isDark = await $memory.settings.value(LIGHTS_OUT, false);

            editor.value = monaco.editor.create(root.value, {
                value: value.value,
                language: language.value,
                fontSize: 14,
                insertSpaces: true,
                padding: { top: 5 },
                minimap: { enabled: false },
                fixedOverflowWidgets: true,
                renderLineHighlight: false,
                scrollBeyondLastLine: false,
                theme: isDark ? 'oneanic-next' : 'vs-light',
            });

            editor.value.onDidChangeModelContent((event) => {
                const currentValue = editor.value.getValue();

                if (currentValue !== value.value) {
                    emit('input', currentValue, event);
                }
            });

            $bus.$on('editors:refresh', updateLayout);

            $bus.$on('update:dark-mode', (enabled) => {
                monaco.editor.setTheme(enabled ? 'oneanic-next' : 'vs-light');
            });

            watch(language, (language) =>
                monaco.editor.setModelLanguage(editor.value.getModel(), language)
            );

            watch(tabSize, (size) =>
                editor.value.getModel().updateOptions({ tabSize: parseInt(size) })
            );

            watch(value, () => {
                if (value.value !== editor.value.getValue()) {
                    editor.value.setValue(value.value);
                }
            });

            watch([width, height], updateLayout);
        });

        onBeforeUnmount(() => editor.value && editor.value.dispose());

        return { root };
    },
};
</script>

<style lang="postcss">
.monaco-editor textarea {
    @apply focus:ring-0;
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
</style>
