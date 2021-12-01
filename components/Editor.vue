<template>
    <div class="overflow-hidden">
        <div ref="toolbar" class="flex items-center justify-between p-2 bg-ui-gray-700">
            <div class="flex items-center gap-2 rounded-lg bg-ui-gray-800">
                <label
                    class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase  text-ui-gray-500 xl:inline-block whitespace-nowrap"
                >
                    Lang
                </label>

                <Select
                    name="language"
                    :value="language"
                    :options="$shiki.languages()"
                    @input="(value) => $emit('update:language', value)"
                />
            </div>

            <div class="flex items-stretch gap-4">
                <div class="flex items-center gap-2 rounded-lg bg-ui-gray-800">
                    <label
                        class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase  text-ui-gray-500 xl:inline-block whitespace-nowrap"
                    >
                        Tab Size
                    </label>

                    <Select
                        :value="tabSize"
                        :options="[2, 4]"
                        @input="(value) => $emit('update:tab-size', value)"
                    />
                </div>

                <div class="items-center hidden overflow-hidden rounded-lg lg:flex">
                    <ToolbarButton v-if="canRemove && canMoveUp" @click.native="$emit('up', id)">
                        <ArrowUpIcon
                            class="w-5 h-5"
                            :class="{ 'transform -rotate-90': !landscape }"
                        />
                    </ToolbarButton>

                    <ToolbarButton v-if="canRemove" @click.native="$emit('remove', id)">
                        <MinusIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton type="button" @click.native="$emit('add')">
                        <PlusIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton
                        v-if="canRemove && canMoveDown"
                        @click.native="$emit('down', id)"
                    >
                        <ArrowDownIcon
                            class="w-5 h-5"
                            :class="{ 'transform -rotate-90': !landscape }"
                        />
                    </ToolbarButton>
                </div>

                <div
                    v-if="canToggleLayout"
                    class="items-center hidden overflow-hidden rounded-lg lg:flex"
                >
                    <ToolbarButton
                        v-if="landscape"
                        type="button"
                        @click.native="$emit('update:layout', true)"
                    >
                        <CreditCardIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton
                        v-else
                        type="button"
                        @click.native="$emit('update:layout', false)"
                    >
                        <ColumnsIcon class="w-5 h-5" />
                    </ToolbarButton>
                </div>
            </div>
        </div>

        <div ref="monaco" class="w-full h-full"></div>
    </div>
</template>

<script>
import * as monaco from 'monaco-editor';
import {
    PlusIcon,
    MinusIcon,
    ColumnsIcon,
    CreditCardIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from 'vue-feather-icons';
import Select from './Select';
import ToolbarButton from './ToolbarButton';
import { LIGHTS_OUT } from './ToggleDarkMode';

export default {
    props: {
        id: String,
        value: String,
        theme: String,
        size: Number,
        tabSize: [String, Number],
        language: String,
        options: Object,
        landscape: Boolean,
        canRemove: Boolean,
        canMoveUp: Boolean,
        canMoveDown: Boolean,
        canToggleLayout: Boolean,
    },

    components: {
        Select,
        PlusIcon,
        MinusIcon,
        ColumnsIcon,
        CreditCardIcon,
        ArrowUpIcon,
        ArrowDownIcon,
        ArrowLeftIcon,
        ArrowRightIcon,
        ToolbarButton,
    },

    watch: {
        value(value) {
            if (value !== this.editor.getValue()) {
                this.editor.setValue(value);
            }
        },

        language() {
            monaco.editor.setModelLanguage(this.editor.getModel(), this.languageAlias);
        },

        tabSize(size) {
            this.editor.getModel().updateOptions({ tabSize: parseInt(size) });
        },

        size() {
            this.updateMonacoLayout();
        },

        landscape() {
            this.updateMonacoLayout();
        },
    },

    async mounted() {
        const data = await import('monaco-themes/themes/Oceanic Next.json');

        monaco.editor.defineTheme('oneanic-next', data);

        this.$nuxt.$on('update:dark-mode', (enabled) => {
            monaco.editor.setTheme(enabled ? 'oneanic-next' : 'vs-light');
        });

        const isDark = await this.$memory.settings.value(LIGHTS_OUT, false);

        this.editor = monaco.editor.create(this.$refs.monaco, {
            value: this.value,
            language: this.languageAlias,
            fontSize: '16px',
            theme: isDark ? 'oneanic-next' : 'vs-light',
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
        });

        window.addEventListener('resize', this.updateMonacoLayout);

        this.$nuxt.$on('adjust-editors', () => this.updateMonacoLayout());

        this.editor.onDidChangeModelContent((event) => {
            const value = this.editor.getValue();

            if (this.value !== value) {
                this.$emit('input', value, event);
            }
        });
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.updateMonacoLayout);

        this.editor && this.editor.dispose();
    },

    destroyed() {
        this.$nuxt.$emit('adjust-editors');
    },

    computed: {
        languageAlias() {
            return (
                {
                    antlers: 'html',
                    blade: 'html',
                    vue: 'html',
                }[this.language] ?? this.language
            );
        },
    },

    methods: {
        updateMonacoLayout() {
            if (this.$refs.monaco && this.$refs.monaco.offsetParent) {
                this.editor.layout({
                    width: this.$refs.monaco.clientWidth,
                    height: this.$refs.monaco.clientHeight - this.$refs.toolbar.clientHeight,
                });
            }
        },
    },
};
</script>

<style>
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
