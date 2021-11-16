<template>
    <div
        class="flex flex-col justify-between flex-1 h-full overflow-hidden"
        :class="{
            'lg:flex-row': isLandscape,
            'lg:flex-col': isPortrait,
        }"
    >
        <div
            ref="container"
            class="flex w-full bg-white"
            :class="{
                'divide-y flex-col': isLandscape,
                'divide-x flex-row': isPortrait,
            }"
        >
            <Editor
                class="w-full h-full"
                v-for="(editor, index) in editors"
                v-model="editors[index].value"
                :id="editor.key"
                :key="editor.key"
                :tab-size="editor.tabSize"
                :language="editor.language"
                :width="isLandscape ? editorWidth : editorWidth / editors.length"
                :height="isPortrait ? editorHeight : editorHeight / editors.length"
                :landscape="isLandscape"
                :can-remove="canRemoveEditor"
                :can-toggle-layout="index === 0"
                @editor-added="addEditor"
                @editor-removed="removeEditor"
                @layout-toggled="toggleLayout"
                @tab-size-chosen="(size) => (editors[index].tabSize = size)"
                @language-chosen="(lang) => (editors[index].language = lang)"
            />
        </div>

        <Preview
            :tab="tab"
            :code="code"
            :languages="languages"
            class="flex flex-col justify-between w-full h-full overflow-scroll"
        />
    </div>
</template>

<script>
const LANDSCAPE = 'landscape';
const PORTRAIT = 'portrait';

import { uniqueId, last } from 'lodash';
import { XIcon } from 'vue-feather-icons';
import Editor from '../components/Editor';
import Preview from '../components/Preview';

export default {
    props: {
        tab: Object,
        visible: Boolean,
    },

    components: { Editor, Preview, XIcon },

    data() {
        return {
            editors: [],
            editorWidth: 800,
            editorHeight: 800,
            orientation: LANDSCAPE,
            containerWidth: 0,
            containerHeight: 0,
            previousOrientation: null,
        };
    },

    created() {
        // Here we will auto-update the orientation to accomodate the
        // users current browsers width upon page load. If it's a
        // small enough screen, it will be set to portrait.
        this.orientation = window.innerWidth >= 1000 ? LANDSCAPE : PORTRAIT;

        this.restorePageFromStorage();

        window.addEventListener('resize', this.handleWindowResize);
    },

    mounted() {
        // When any data has changed, we will push all
        // the settings up to local storage so that
        // they may be restored upon page reload.
        this.$watch(
            (vm) => vm.$data,
            (data) => this.$pages.merge(this.tab.id, { tab: this.tab, data }),
            { deep: true }
        );

        // Auto adjust the editors height and width upon first page load.
        this.handleWindowResize();
    },

    destroyed() {
        window.removeEventListener('resize', this.handleWindowResize);
    },

    watch: {
        visible() {
            this.handleWindowResize();
        },

        editors() {
            this.handleWindowResize();
        },

        orientation() {
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

        isLandscape() {
            return this.orientation === LANDSCAPE;
        },

        isPortrait() {
            return this.orientation === PORTRAIT;
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
                tabSize: 4,
                language: language,
                value: language === 'php' ? '<?php\n\n' : '',
            };
        },

        /**
         * Toggle the layout.
         */
        toggleLayout() {
            this.orientation = this.orientation === LANDSCAPE ? PORTRAIT : LANDSCAPE;
        },

        /**
         * Handle browser window resizing and auto-adjust the editor width and height.
         */
        handleWindowResize() {
            // Here we will force portrait mode when screen width is
            // small, then restore the users previously saved
            // orientation when screen width is increased.
            if (window.innerWidth <= 1024) {
                this.previousOrientation = this.previousOrientation ?? this.orientation;

                this.orientation = PORTRAIT;
            } else if (this.previousOrientation) {
                const previous = this.previousOrientation;

                this.previousOrientation = null;

                this.orientation = previous;
            }

            this.$nextTick(() => {
                this.containerWidth = this.$refs.container.clientWidth;
                this.containerHeight = this.$refs.container.clientHeight;

                this.editorWidth = this.isLandscape ? window.innerWidth / 2 : this.containerWidth;
                this.editorHeight = this.isPortrait ? window.innerHeight / 3 : this.containerHeight;
            });
        },

        restorePageFromStorage() {
            const page = this.$pages.get(this.tab.id);

            page
                ? Object.keys(page?.data ?? {}).forEach((key) => (this.$data[key] = page.data[key]))
                : this.addEditor();
        },
    },
};
</script>
