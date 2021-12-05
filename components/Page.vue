<template>
    <div
        class="flex flex-col justify-between flex-1 h-full overflow-hidden"
        :class="{
            'lg:flex-row': isLandscape,
            'lg:flex-col': isPortrait,
        }"
    >
        <div
            dusk="editors"
            ref="editors"
            class="flex w-full h-full overflow-hidden rounded-b-none"
            :class="{
                'flex-col': isLandscape,
                'divide-ui-gray-700 divide-x-4 flex-row': isPortrait,
            }"
        >
            <Editor
                dusk="editor"
                class="w-full h-full"
                v-for="(editor, index) in editors"
                v-model="editors[index].value"
                :id="editor.id"
                :key="editor.id"
                :size="sizes[0]"
                :tab-size="editor.tabSize"
                :language="editor.language"
                :landscape="isLandscape"
                :can-move-up="index !== 0"
                :can-move-down="index !== editors.length - 1"
                :can-remove="canRemoveEditor"
                :can-toggle-layout="index === 0"
                @up="moveEditorUp"
                @down="moveEditorDown"
                @add="addEditor"
                @remove="removeEditor"
                @update:layout="toggleLayout"
                @update:tab-size="(size) => (editors[index].tabSize = size)"
                @update:language="(lang) => (editors[index].language = lang)"
            />
        </div>

        <Preview
            dusk="preview"
            ref="preview"
            :tab="tab"
            :code="code"
            :languages="languages"
            class="flex flex-col justify-between w-full h-full overflow-auto"
        />
    </div>
</template>

<script>
const LANDSCAPE = 'landscape';
const PORTRAIT = 'portrait';

import Split from 'split.js';
import { v4 as uuid } from 'uuid';
import { XIcon } from 'vue-feather-icons';
import { last, debounce, cloneDeep } from 'lodash';
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
            sizes: [40, 60],
            orientation: LANDSCAPE,
            previousOrientation: null,
        };
    },

    async created() {
        // Here we will auto-update the orientation to accomodate the
        // users current browsers width upon page load. If it's a
        // small enough screen, it will be set to portrait.
        this.orientation = window.innerWidth >= 1000 ? LANDSCAPE : PORTRAIT;

        window.addEventListener('resize', this.handleWindowResize);
    },

    async mounted() {
        this.handleWindowResize();

        this.$nextTick(async () => {
            await this.restorePageFromStorage();

            this.initSplitView();
        });
    },

    beforeDestroy() {
        if (this.split) {
            this.split.destroy();
        }
    },

    destroyed() {
        window.removeEventListener('resize', this.handleWindowResize);
    },

    watch: {
        $data: {
            deep: true,
            // When any data has changed, we will push all
            // the settings up to local storage so that
            // they may be restored upon page reload.
            handler(data) {
                this.syncPageInStorage(data);
            },
        },

        visible() {
            this.handleWindowResize();
        },

        editors() {
            this.handleWindowResize();
        },

        orientation() {
            this.initSplitView();

            this.handleWindowResize();
        },
    },

    computed: {
        code() {
            return this.editors.map(({ id, value }) => ({
                id,
                value: value.replace('<?php', '').replace(/(\n*)/, ''),
            }));
        },

        languages() {
            return this.editors.map(({ id, language }) => ({
                id,
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
         * Move the editor up.
         *
         * @param {String} id
         */
        moveEditorUp(id) {
            const index = this.findEditorIndex(id);

            this.moveEditor(index, index - 1);
        },

        /**
         * Move the editor down.
         *
         * @param {String} id
         */
        moveEditorDown(id) {
            const index = this.findEditorIndex(id);

            this.moveEditor(index, index + 1);
        },

        /**
         * Swap an editor's position.
         *
         * @param {Number} from
         * @param {Number} to
         */
        moveEditor(from, to) {
            const editor = this.editors[from];

            this.editors.splice(from, 1);

            this.editors.splice(to, 0, editor);
        },

        /**
         * Remove an editor.
         *
         * @param {String} id
         */
        removeEditor(id) {
            if (!this.canRemoveEditor) {
                return;
            }

            this.editors.splice(this.findEditorIndex(id), 1);
        },

        /**
         * Find an editors index by its ID.
         *
         * @param {String} id
         */
        findEditorIndex(id) {
            return this.editors.findIndex((editor) => editor.id === id);
        },

        /**
         * Make a new editor.
         */
        makeEditor() {
            const language = last(this.editors)?.language ?? 'php';

            return {
                id: uuid(),
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
        },

        /**
         * Sync the page data into local storage.
         *
         * @param {Object} data
         */
        syncPageInStorage: debounce(async function (data) {
            const page = cloneDeep(data);

            delete page._asyncComputed;

            await this.$memory.pages.sync(this.tab.id, (record) => {
                record.set('tab', this.tab);
                record.set('page', page);
            });
        }, 1000),

        /**
         * Restore the page from local storage.
         */
        async restorePageFromStorage() {
            const record = await this.$memory.pages.get(this.tab.id);

            const page = record.toCollection('page');

            page.isEmpty()
                ? this.addEditor()
                : page.each((value, key) => (this.$data[key] = value));
        },

        /**
         * Initialize the split view instance.
         */
        initSplitView() {
            if (this.split) {
                this.split.destroy();
            }

            this.split = Split([this.$refs.editors, this.$refs.preview.$el], {
                sizes: this.sizes,
                onDrag: (sizes) => (this.sizes = sizes),
                direction: this.isPortrait ? 'vertical' : 'horizontal',
            });
        },
    },
};
</script>

<style>
.gutter {
    @apply bg-ui-gray-700 hover:bg-ui-gray-800;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    @apply rounded-tr-xl cursor-resize-width;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}

.gutter.gutter-vertical {
    @apply cursor-resize-height;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}
</style>
