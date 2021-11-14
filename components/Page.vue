<template>
    <div class="flex justify-between h-full" :class="{ 'flex-col': !sideBySide }">
        <div class="flex" :class="{ 'flex-col divide-y': sideBySide, 'divide-x': !sideBySide }">
            <Editor
                class="w-full"
                v-for="(editor, index) in editors"
                v-model="editors[index].value"
                :id="editor.key"
                :key="editor.key"
                :language="editor.language"
                :width="sideBySide ? editorWidth : editorWidth / editors.length"
                :height="sideBySide ? editorHeight / editors.length : editorHeight"
                :height-offset="index === 0 && sideBySide ? 36 : 0"
                :side-by-side="sideBySide"
                :can-remove="canRemoveEditor"
                :can-toggle-layout="index === 0"
                @editor-added="addEditor"
                @editor-removed="removeEditor"
                @language-chosen="(lang) => (editor.language = lang)"
                @layout-toggled="(side) => (sideBySide = side)"
            />
        </div>

        <Preview
            :code="code"
            :languages="languages"
            class="flex flex-col justify-between w-full h-full overflow-scroll  bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
        />
    </div>
</template>

<script>
import { uniqueId, last } from 'lodash';
import { XIcon } from 'vue-feather-icons';
import Editor from '../components/Editor';
import Preview from '../components/Preview';

export default {
    components: { Editor, Preview, XIcon },

    data() {
        return {
            editors: [],
            sideBySide: true,
            editorWidth: 800,
            editorHeight: 800,
        };
    },

    created() {
        this.addEditor();

        window.addEventListener('resize', this.handleWindowResize);
    },

    mounted() {
        // Here we will auto-set side-by-side mode to accomodate
        // the current browsers width upon page load. If it's a
        // small enough screen, it will disable side-by-side.
        this.sideBySide = window.innerWidth >= 1000;

        // Auto adjust the editors height and width upon first page load.
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
        code() {
            return this.editors.map(({ key, value }) => ({
                key: key,
                value: value.replace('<?php', '').trim(),
            }));
        },

        languages() {
            return this.editors.map(({ key, language }) => ({
                key: key,
                name: language,
            }));
        },

        canRemoveEditor() {
            return this.editors.length > 1;
        },
    },

    methods: {
        /**
         * Add a new monaco editor.
         */
        addEditor() {
            this.editors.push(this.makeEditor());
        },

        /**
         * Remove an editor by its ID.
         */
        removeEditor(id) {
            if (!this.canRemoveEditor) {
                return;
            }

            const index = this.editors.findIndex(({ key }) => key === id);

            if (index !== -1) {
                this.editors.splice(index, 1);
            }
        },

        /**
         * Make a new editor.
         */
        makeEditor() {
            const language = last(this.editors)?.language ?? 'php';

            return {
                key: uniqueId('editor-'),
                language: language,
                value: language === 'php' ? '<?php \n\n' : '',
            };
        },

        /**
         * Toggle the layout.
         */
        toggleLayout() {
            this.sideBySide = !this.sideBySide;
        },

        /**
         * Handle browser window resizing and auto-adjust the editor width and height.
         */
        handleWindowResize() {
            this.editorWidth = this.sideBySide ? window.innerWidth / 2 : window.innerWidth;
            this.editorHeight = this.sideBySide ? window.innerHeight : window.innerHeight / 2;
        },
    },
};
</script>
