<template>
    <div
        class="flex items-stretch justify-between h-full"
        :class="{ 'flex-col': !sideBySide }"
    >
        <Editor
            class="w-full"
            v-model="code"
            :tab-size="tabSize"
            :language="language"
            :languages="languages"
            :width="editorWidth"
            :height="editorHeight"
            :height-offset="40"
            :side-by-side="sideBySide"
            @language-chosen="(lang) => (language = lang)"
            @tab-size-chosen="(size) => (tabSize = size)"
            @layout-toggled="(side) => (sideBySide = side)"
        />

        <Preview
            :code="previewCode"
            :language="language"
            class="flex flex-col justify-between w-full h-full overflow-scroll bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
        />
    </div>
</template>

<script>
import Editor from "../components/Editor";
import Preview from "../components/Preview";

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
                {
                    name: "twitter:image",
                    content: "https://showcode.app/twitter_summary_card.png",
                },
                { name: "twitter:site", content: "https://showcode.app" },
                { name: "twitter:creator", content: "@stevethebauman" },
            ],
        };
    },

    components: { Editor, Preview },

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
            window.addEventListener("resize", this.handleWindowResize);
        }
    },

    mounted() {
        if (process.isClient) {
            this.sideBySide = window.innerWidth >= 1000;
        }

        this.handleWindowResize();
    },

    destroyed() {
        window.removeEventListener("resize", this.handleWindowResize);
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

<style>
html,
body {
    height: 100%;
}
</style>
