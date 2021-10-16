<template>
    <ClientOnly>
        <div
            class="grid min-h-screen"
            :class="{ 'grid-cols-2': sideBySide, 'grid-rows-2': !sideBySide }"
        >
            <div>
                <div class="flex items-center justify-between p-1 border-b">
                    <select
                        v-model="language"
                        class="border-gray-300 rounded-md"
                    >
                        <option value="php">PHP</option>
                        <option value="javascript">JavaScript</option>
                    </select>

                    <div>
                        <span
                            class="relative z-0 inline-flex rounded-md shadow-sm"
                        >
                            <button
                                @click="sideBySide = true"
                                type="button"
                                :class="{ 'bg-gray-100': sideBySide }"
                                class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <ColumnsIcon />
                            </button>

                            <button
                                type="button"
                                @click="sideBySide = false"
                                :class="{ 'bg-gray-100': !sideBySide }"
                                class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <CreditCardIcon />
                            </button>
                        </span>
                    </div>
                </div>

                <editor
                    v-model="code"
                    :language="language"
                    :width="editorWidth"
                    :height="editorHeight"
                />
            </div>

            <div ref="preview" class="flex items-center justify-center bg-ash">
                <preview :code="previewCode" :language="language" />
            </div>
        </div>
    </ClientOnly>
</template>

<script>
import { ColumnsIcon, CreditCardIcon } from "vue-feather-icons";

export default {
    metaInfo: {
        title: "Screenshot your code",
    },

    components: { ColumnsIcon, CreditCardIcon },

    data() {
        return {
            code: "<?php",
            language: "php",
            sideBySide: true,
            editorWidth: window.innerWidth,
            editorHeight: window.innerHeight,
        };
    },

    created() {
        window.addEventListener("resize", this.handleWindowResize);
    },

    mounted() {
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
