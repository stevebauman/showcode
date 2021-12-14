<template>
    <div class="overflow-hidden">
        <div ref="toolbar" class="flex items-center justify-between bg-ui-gray-700">
            <div
                class="flex items-center gap-2 m-2 rounded-lg  bg-ui-gray-800 focus-within:ring-2 focus-within:ring-ui-focus"
            >
                <label
                    class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase  text-ui-gray-500 xl:inline-block whitespace-nowrap"
                >
                    Lang
                </label>

                <Select
                    dusk="select-language"
                    name="language"
                    :value="language"
                    :options="$shiki.languages()"
                    @input="(value) => $emit('update:language', value)"
                />
            </div>

            <div class="flex items-stretch gap-2">
                <div
                    class="flex items-center gap-2 mr-2 rounded-lg  bg-ui-gray-800 focus-within:ring-2 focus-within:ring-ui-focus lg:mr-0"
                >
                    <label
                        class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase  text-ui-gray-500 xl:inline-block whitespace-nowrap"
                    >
                        Tab Size
                    </label>

                    <Select
                        dusk="select-tab-size"
                        :value="tabSize"
                        :options="[2, 4]"
                        @input="(value) => $emit('update:tab-size', value)"
                    />
                </div>

                <div
                    class="items-center hidden rounded-lg lg:flex bg-ui-gray-800"
                    :class="{ 'mr-2': !canToggleLayout }"
                >
                    <ToolbarButton
                        v-if="canRemove && canMoveUp"
                        dusk="button-move-up"
                        class="rounded-l-lg mr-0.5"
                        @click.native="$emit('up', id)"
                    >
                        <ArrowUpIcon
                            class="w-5 h-5"
                            :class="{ 'transform -rotate-90': !landscape }"
                        />
                    </ToolbarButton>

                    <ToolbarButton
                        v-if="canRemove"
                        dusk="button-remove"
                        :class="{ 'rounded-l-lg': !canMoveUp }"
                        class="mr-0.5"
                        @click.native="$emit('remove', id)"
                    >
                        <MinusIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton
                        dusk="button-add"
                        :class="{
                            'mr-0.5': canMoveDown,
                            'rounded-r-lg': !canMoveDown,
                            'rounded-l-lg': !canRemove && !canMoveUp,
                        }"
                        @click.native="$emit('add')"
                    >
                        <PlusIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton
                        v-if="canRemove && canMoveDown"
                        dusk="button-move-down"
                        class="rounded-r-lg"
                        @click.native="$emit('down', id)"
                    >
                        <ArrowDownIcon
                            class="w-5 h-5"
                            :class="{ 'transform -rotate-90': !landscape }"
                        />
                    </ToolbarButton>
                </div>

                <div v-if="canToggleLayout" class="items-center hidden mr-2 lg:flex">
                    <ToolbarButton
                        v-if="landscape"
                        class="rounded-lg"
                        dusk="button-toggle-portrait"
                        @click.native="$emit('update:layout', true)"
                    >
                        <CreditCardIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton
                        v-else
                        class="rounded-lg"
                        dusk="button-toggle-landscape"
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
import * as monaco from 'monaco-editor';
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
        language() {
            monaco.editor.setModelLanguage(this.editor.getModel(), this.languageAlias);
        },

        value(value) {
            if (value !== this.editor.getValue()) {
                this.editor.setValue(value);
            }
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
            renderLineHighlight: false,
        });

        window.addEventListener('resize', this.updateMonacoLayout);

        this.$nuxt.$on('adjust-editors', () => this.updateMonacoLayout());

        this.editor.onDidChangeModelContent((event) => {
            const value = this.editor.getValue();

            if (value !== this.value) {
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
