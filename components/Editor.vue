<template>
    <div>
        <div ref="toolbar" class="flex items-center justify-between h-10 p-1 border-b">
            <div>
                <select
                    name="language"
                    :value="language"
                    @change="(event) => $emit('language-chosen', event.target.value)"
                    class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option
                        v-for="option in allLanguages"
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
                        v-model="tabSize"
                        class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option :value="2">2</option>
                        <option :value="4">4</option>
                    </select>
                </div>

                <div class="flex items-center">
                    <button
                        type="button"
                        :disabled="!canRemove"
                        @click="$emit('editor-removed', id)"
                        :class="{ 'bg-gray-100 cursor-not-allowed': !canRemove }"
                        class="py-0.5 px-2 rounded-l-md h-full border hover:bg-gray-100"
                    >
                        <MinusIcon class="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        @click="$emit('editor-added')"
                        class="py-0.5 px-2 rounded-r-md h-full border hover:bg-gray-100"
                    >
                        <PlusIcon class="w-5 h-5" />
                    </button>
                </div>

                <div
                    v-if="canToggleLayout"
                    class="bg-gray-100 p-0.5 rounded-md items-center flex border"
                >
                    <button
                        type="button"
                        @click="$emit('layout-toggled', false)"
                        :class="[sideBySide ? 'text-gray-400' : 'bg-white shadow-sm text-gray-600']"
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
                        @click="$emit('layout-toggled', true)"
                        :class="[
                            !sideBySide ? 'text-gray-400' : 'bg-white shadow-sm text-gray-600',
                        ]"
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
            :style="{
                width: `${width}px`,
                height: `${height - (toolbarHeight + heightOffset)}px`,
            }"
        ></div>
    </div>
</template>

<script>
import * as monaco from 'monaco-editor';
import { PlusIcon, MinusIcon, ColumnsIcon, CreditCardIcon } from 'vue-feather-icons';

export default {
    props: {
        id: String,
        value: String,
        theme: String,
        language: String,
        height: Number,
        heightOffset: Number,
        width: Number,
        options: Object,
        sideBySide: Boolean,
        canRemove: Boolean,
        canToggleLayout: Boolean,
    },

    components: { PlusIcon, MinusIcon, ColumnsIcon, CreditCardIcon },

    model: {
        event: 'change',
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

        height() {
            this.updateDimensions();
        },
    },

    data() {
        return {
            tabSize: 4,
            windowWidth: 0,
            toolbarHeight: 0,
        };
    },

    created() {
        this.windowWidth = window.innerWidth;
    },

    mounted() {
        this.initMonaco();

        this.toolbarHeight = this.$refs.toolbar.clientHeight;
    },

    beforeDestroy() {
        this.editor && this.editor.dispose();
    },

    destroyed() {
        window.removeEventListener('resize', this.updateDimensions);
    },

    computed: {
        languageAlias() {
            return (
                {
                    antlers: 'html',
                    blade: 'html',
                }[this.language] ?? this.language
            );
        },

        allLanguages() {
            return require('../assets/languages.json');
        },
    },

    methods: {
        initMonaco() {
            this.editor = monaco.editor.create(this.$refs.monaco, {
                value: this.value,
                language: this.languageAlias,
                theme: 'vs-light',
                fontSize: '16px',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                minimap: {
                    enabled: false,
                },
            });

            this.editor.onDidChangeModelContent((event) => {
                const value = this.editor.getValue();

                if (this.value !== value) {
                    this.$emit('change', value, event);
                }
            });

            window.addEventListener('resize', this.updateDimensions);
        },

        updateDimensions() {
            this.editor && this.editor.layout();
        },
    },
};
</script>

<style>
.monaco-editor .parameter-hints-widget {
    border: 0px;
}
.monaco-editor .parameter-hints-widget .signature {
    padding: 0px;
}
.monaco-editor .suggest-widget {
    border: 0px;
}
.monaco-editor.vs-dark .suggest-widget {
    border: 0px;
}
.monaco-editor.rename-box,
.monaco-hover {
    top: 0;
}
</style>
