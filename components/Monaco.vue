<template>
    <div :style="{ width: `${width}px`, height: `${height}px` }"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
import { LIGHTS_OUT } from './ToggleDarkMode';

export default {
    props: {
        value: String,
        width: Number,
        height: Number,
        language: String,
        heightOffset: Number,
        tabSize: [String, Number],
    },

    watch: {
        language(language) {
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
        },

        tabSize(size) {
            this.editor.getModel().updateOptions({ tabSize: parseInt(size) });
        },

        value(value) {
            if (value !== this.editor.getValue()) {
                this.editor.setValue(value);
            }
        },
    },

    async mounted() {
        const data = await import('monaco-themes/themes/Oceanic Next.json');

        monaco.editor.defineTheme('oneanic-next', data);

        const isDark = await this.$memory.settings.value(LIGHTS_OUT, false);

        this.editor = monaco.editor.create(this.$el, {
            value: this.value,
            language: this.language,
            fontSize: '16px',
            theme: isDark ? 'oneanic-next' : 'vs-light',
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            renderLineHighlight: false,
        });

        window.addEventListener('resize', this.updateLayout);

        this.editor.onDidChangeModelContent((event) => {
            const value = this.editor.getValue();

            if (value !== this.value) {
                this.$emit('input', value, event);
            }
        });

        this.$nuxt.$on('editors:refresh', this.updateLayout);

        this.$nuxt.$on('update:dark-mode', (enabled) => {
            monaco.editor.setTheme(enabled ? 'oneanic-next' : 'vs-light');
        });

        this.$watch((vm) => [vm.width, vm.height], this.updateLayout);
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.updateMonacoLayout);

        this.editor && this.editor.dispose();
    },

    methods: {
        updateLayout() {
            this.editor.layout({
                width: this.width,
                height: this.height,
            });
        },
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
