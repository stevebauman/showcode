<template>
    <div>
        <div class="flex items-center justify-between h-10 p-1 border-b">
            <div>
                <select
                    name="language"
                    :value="language"
                    @change="(event) => $emit('language-chosen', event.target.value)"
                    class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option
                        v-for="option in languages"
                        :key="option"
                        :value="option"
                        class="capitalize"
                    >
                        {{ option }}
                    </option>
                </select>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <label class="inline-block text-sm leading-none whitespace-nowrap">
                        Tab Size
                    </label>

                    <select
                        name="tabSize"
                        :value="tabSize"
                        @change="(event) => $emit('tab-size-chosen', event.target.value)"
                        class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option :value="2">2</option>
                        <option :value="4">4</option>
                    </select>
                </div>

                <div class="bg-gray-100 p-0.5 rounded-md items-center flex border">
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
                height: `${height - heightOffset}px`,
                width: `${width}px`,
            }"
        ></div>
    </div>
</template>

<script>
import { ColumnsIcon, CreditCardIcon } from 'vue-feather-icons';

export default {
    props: {
        value: {
            type: String,
            required: true,
        },
        theme: {
            type: String,
            default: 'vs',
        },
        tabSize: {
            type: [Number, String],
            default: 4,
        },
        sideBySide: Boolean,
        language: String,
        languages: Array,
        height: Number,
        heightOffset: Number,
        width: Number,
        options: Object,
    },

    components: { ColumnsIcon, CreditCardIcon },

    model: {
        event: 'change',
    },

    watch: {
        value(value) {
            if (this.editor) {
                if (value !== this.editor.getValue()) {
                    this.editor.setValue(value);
                }
            }
        },

        language() {
            if (this.editor) {
                this.monaco.editor.setModelLanguage(this.editor.getModel(), this.languageAlias);
            }
        },

        tabSize(size) {
            if (this.editor) {
                this.editor.getModel().updateOptions({ tabSize: parseInt(size) });
            }
        },

        height() {
            this.updateDimensions();
        },
    },

    data() {
        return { windowWidth: 0 };
    },

    created() {
        this.windowWidth = window.innerWidth;
    },

    mounted() {
        this.initMonaco();
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
    },

    methods: {
        initMonaco() {
            this.monaco = window.monaco;

            this.editor = this.monaco.editor.create(this.$refs.monaco, {
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
