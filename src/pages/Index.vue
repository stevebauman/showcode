<template>
    <div
        class="grid min-h-screen"
        :class="{ 'grid-cols-2': sideBySide, 'grid-flow-row': !sideBySide }"
    >
        <Editor
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
            class="overflow-hidden"
        />
    </div>
</template>

<script>
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
