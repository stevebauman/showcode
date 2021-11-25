<template>
    <div class="overflow-hidden">
        <div class="flex items-center justify-between h-10 p-1 bg-white border-b">
            <div>
                <select
                    name="language"
                    :value="language"
                    @change="(event) => $emit('update:language', event.target.value)"
                    class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-lg  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option
                        v-for="option in $shiki.languages()"
                        :key="option"
                        :value="option"
                        class="capitalize"
                    >
                        {{ option }}
                    </option>
                </select>
            </div>

            <div class="flex items-stretch gap-4">
                <div class="flex items-center gap-2">
                    <label class="inline-block text-sm leading-none whitespace-nowrap">
                        Tab Size
                    </label>

                    <select
                        name="tabSize"
                        :value="tabSize"
                        @change="(event) => $emit('update:tab-size', event.target.value)"
                        class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-lg  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option :value="2">2</option>
                        <option :value="4">4</option>
                    </select>
                </div>

                <div class="items-center hidden overflow-hidden border divide-x rounded-lg lg:flex">
                    <ToolbarButton v-if="canRemove && canMoveUp" @click.native="$emit('up', id)">
                        <ArrowUpIcon
                            class="w-5 h-5"
                            :class="{ 'transform -rotate-90': !landscape }"
                        />
                    </ToolbarButton>

                    <ToolbarButton :disabled="!canRemove" @click.native="$emit('remove', id)">
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
                    class="bg-gray-100 p-0.5 rounded-lg items-center hidden lg:flex border"
                >
                    <button
                        type="button"
                        @click="$emit('update:layout', false)"
                        :class="[landscape ? 'text-gray-400' : 'bg-white shadow-sm text-gray-600']"
                        class="
                            py-0.5
                            px-2
                            rounded-md
                            hover:bg-white hover:shadow-sm
                            focus:outline-none
                        "
                    >
                        <CreditCardIcon class="w-5 h-5" />
                        <span class="sr-only">Top over bottom</span>
                    </button>

                    <button
                        type="button"
                        @click="$emit('update:layout', true)"
                        :class="[!landscape ? 'text-gray-400' : 'bg-white shadow-sm text-gray-600']"
                        class="
                            py-0.5
                            px-2
                            ml-0.5
                            h-full
                            rounded-md
                            hover:bg-white hover:shadow-sm
                            focus:outline-none
                        "
                    >
                        <ColumnsIcon class="w-5 h-5" />
                        <span class="sr-only">Side By Side</span>
                    </button>
                </div>
            </div>
        </div>

        <div
            ref="monaco"
            style="min-height: 400px"
            :class="{ 'h-full w-full': landscape, 'w-full h-full': !landscape }"
        ></div>
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
import ToolbarButton from './ToolbarButton';

export default {
    props: {
        id: String,
        value: String,
        theme: String,
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

        landscape() {
            this.updateMonacoLayout();
        },
    },

    mounted() {
        this.editor = monaco.editor.create(this.$refs.monaco, {
            value: this.value,
            language: this.languageAlias,
            theme: 'vs-light',
            fontSize: '16px',
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
        });

        window.addEventListener('resize', this.updateMonacoLayout);

        // Here we will force update the Monaco layout after it starts.
        // This allows Monaco to observe its container size and adjust
        // its width and height automatically to fill its parent.
        // @see https://github.com/microsoft/monaco-editor/issues/115#issue-172220873
        // @see https://github.com/microsoft/monaco-editor/issues/1482#issuecomment-506645262
        this.editor.onDidScrollChange(() => this.updateMonacoLayout());
        this.$nuxt.$on('adjust-editors', () => this.updateMonacoLayout());

        this.editor.onDidChangeModelContent((event) => {
            const value = this.editor.getValue();

            if (this.value !== value) {
                this.$emit('input', value, event);
            }
        });
    },

    beforeDestroy() {
        this.editor && this.editor.dispose();
    },

    destroyed() {
        this.$nuxt.$emit('adjust-editors');

        window.removeEventListener('resize', this.updateMonacoLayout);
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
                this.editor.layout();
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
