<template>
    <div
        class="flex items-stretch justify-between h-full antialiased"
        :class="{ 'flex-col': !sideBySide }"
    >
        <Editor
            class="w-full"
            v-model="code"
            :language="language"
            :languages="languages"
            :width="editorWidth"
            :height="editorHeight"
            :height-offset="40"
            :side-by-side="sideBySide"
            @language-chosen="(lang) => (language = lang)"
            @layout-toggled="(side) => (sideBySide = side)"
        />

        <Preview
            :code="previewCode"
            :language="language"
            class="flex flex-col justify-between w-full h-full overflow-scroll  bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
        />
    </div>
</template>

<script>
import Editor from '../components/Editor';
import Preview from '../components/Preview';

export default {
    head: { title: 'Beautiful code screenshots' },

    components: { Editor, Preview },

    data() {
        return {
            code: '<?php',
            language: 'php',
            sideBySide: true,
            editorWidth: 800,
            editorHeight: 800,
        };
    },

    created() {
        window.addEventListener('resize', this.handleWindowResize);
    },

    mounted() {
        this.sideBySide = window.innerWidth >= 1000;

        this.handleWindowResize();
    },

    destroyed() {
        window.removeEventListener('resize', this.handleWindowResize);
    },

    watch: {
        sideBySide() {
            this.handleWindowResize();
        },
    },

    computed: {
        previewCode() {
            return this.code.replace('<?php', '').trim();
        },

        languages() {
            return require('../assets/languages.json');
        },
    },

    methods: {
        toggleLayout() {
            this.sideBySide = !this.sideBySide;
        },

        handleWindowResize() {
            this.editorHeight = this.sideBySide ? window.innerHeight : window.innerHeight / 2;
            this.editorWidth = this.sideBySide ? window.innerWidth / 2 : window.innerWidth;
        },
    },
};
</script>

<style lang="postcss">
html,
body,
#__nuxt,
#__layout {
    @apply h-full;
}
</style>
