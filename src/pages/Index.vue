<template>
    <div
        class="grid min-h-screen"
        :class="{ 'grid-cols-2': sideBySide, 'grid-flow-row': !sideBySide }"
    >
        <div>
            <div class="flex items-center justify-between h-10 p-1 border-b">
                <div>
                    <select
                        name="language"
                        v-model="language"
                        class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        <label
                            class="inline-block text-sm leading-none whitespace-nowrap"
                        >
                            Tab Size
                        </label>

                        <select
                            name="tabSize"
                            v-model="tabSize"
                            class="block w-full py-1 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="2">2</option>
                            <option value="4">4</option>
                        </select>
                    </div>

                    <span class="relative z-0 inline-flex rounded-md shadow-sm">
                        <button
                            @click="sideBySide = true"
                            type="button"
                            :class="{ 'bg-gray-100': sideBySide }"
                            class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <ColumnsIcon class="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            @click="sideBySide = false"
                            :class="{ 'bg-gray-100': !sideBySide }"
                            class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <CreditCardIcon class="w-4 h-4" />
                        </button>
                    </span>
                </div>
            </div>

            <Editor
                v-model="code"
                :tab-size="tabSize"
                :language="language"
                :width="editorWidth"
                :height="editorHeight"
                :height-offset="40"
            />
        </div>

        <Preview
            :code="previewCode"
            :language="language"
            class="overflow-hidden"
        />
    </div>
</template>

<script>
import { ColumnsIcon, CreditCardIcon } from "vue-feather-icons";

export default {
    metaInfo() {
        return {
            title: "Beautiful code screenshots",
            meta: [
                {
                    name: "description",
                    content: "Generate beautiful images of code.",
                },
                { name: "twitter:card", content: "summary_large_image" },
                {
                    name: "twitter:description",
                    content: "Generate beautiful images of code.",
                },
                { name: "twitter:title", content: "Showcode" },
                { name: "twitter:site", content: "https://showcode.app" },

                { name: "twitter:creator", content: "@stevethebauman" },
            ],
        };
    },

    components: { ColumnsIcon, CreditCardIcon },

    data() {
        return {
            tabSize: 4,
            code: "<?php",
            language: "php",
            sideBySide: true,
            editorWidth: 800,
            editorHeight: 800,
        };
    },

    created() {
        if (process.isClient) {
            this.editorWidth = window.innerWidth;
            this.editorHeight = window.innerHeight;

            window.addEventListener("resize", this.handleWindowResize);
        }
    },

    mounted() {
        if (process.isClient) {
            this.sideBySide = window.innerWidth >= 1000;
        }

        this.handleWindowResize();
    },

    watch: {
        sideBySide() {
            this.handleWindowResize();
        },
    },

    computed: {
        previewCode() {
            return this.code.replace("<?php", "").trim();
        },

        languages() {
            return require("../languages.json");
        },
    },

    methods: {
        toggleLayout() {
            this.sideBySide = !this.sideBySide;
        },

        handleWindowResize() {
            this.editorHeight = this.sideBySide
                ? window.innerHeight
                : window.innerHeight / 2;

            this.editorWidth = this.sideBySide
                ? window.innerWidth / 2
                : window.innerWidth;
        },
    },
};
</script>
