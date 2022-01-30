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
            ref="editorContainer"
            class="flex w-full h-full rounded-b-none"
            :class="{
                'flex-col': isLandscape,
                'divide-ui-gray-700 divide-x-4 flex-row': isPortrait,
            }"
        >
            <Editor
                dusk="editor"
                class="w-full h-full overflow-hidden"
                v-for="(editor, index) in editors"
                v-model="editors[index].value"
                :id="editor.id"
                :key="editor.id"
                :sizes="sizes"
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
            ref="previewContainer"
            :tab="tab"
            :code="code"
            :languages="languages"
            class="overflow-auto scrollbar-hide"
        />
    </div>
</template>

<script>
const PORTRAIT = 'portrait';
const LANDSCAPE = 'landscape';

import Split from 'split.js';
import { v4 as uuid } from 'uuid';
import { XIcon } from 'vue-feather-icons';
import { last, debounce, cloneDeep } from 'lodash';
import {
    ref,
    toRefs,
    watch,
    computed,
    reactive,
    useContext,
    onMounted,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';

export default {
    props: {
        tab: Object,
        visible: Boolean,
    },

    components: { XIcon },

    setup(props) {
        const { $bus, $memory } = useContext();

        const { tab, visible } = toRefs(props);

        const editorContainer = ref(null);
        const previewContainer = ref(null);

        const split = ref(null);

        const data = reactive({
            editors: [],
            sizes: [40, 60],
            previousOrientation: null,
            orientation: window.innerWidth >= 1000 ? LANDSCAPE : PORTRAIT,
        });

        const { sizes, editors, orientation, previousOrientation } = toRefs(data);

        const canRemoveEditor = computed(() => editors.value.length > 1);
        const isPortrait = computed(() => orientation.value === PORTRAIT);
        const isLandscape = computed(() => orientation.value === LANDSCAPE);

        const toggleLayout = () =>
            (orientation.value = orientation.value === LANDSCAPE ? PORTRAIT : LANDSCAPE);

        const restorePageFromStorage = async () => {
            const record = await $memory.pages.get(tab.value.id);

            const page = record.toCollection('page');

            page.isEmpty() ? addEditor() : page.each((value, key) => (data[key] = value));
        };

        const handleWindowResize = () => {
            // Here we will force portrait mode when screen width is
            // small, then restore the users previously saved
            // orientation when screen width is increased.
            if (window.innerWidth <= 1024) {
                previousOrientation.value = previousOrientation.value ?? orientation.value;

                orientation.value = PORTRAIT;
            } else if (previousOrientation.value) {
                const previous = previousOrientation.value;

                previousOrientation.value = null;

                orientation.value = previous;
            }
        };

        const syncPageInStorage = debounce(async function (data) {
            const page = cloneDeep(data);

            await $memory.pages.sync(tab.value.id, (record) => {
                record.set('tab', tab.value);
                record.set('page', page);
            });
        }, 1000);

        const findEditorIndex = (id) => editors.value.findIndex((editor) => editor.id === id);

        const moveEditor = (from, to) => {
            const editor = editors.value[from];

            editors.value.splice(from, 1);

            editors.value.splice(to, 0, editor);
        };

        const moveEditorUp = (id) => {
            const index = findEditorIndex(id);

            moveEditor(index, index - 1);
        };

        const moveEditorDown = (id) => {
            const index = findEditorIndex(id);

            moveEditor(index, index + 1);
        };

        const removeEditor = (id) => {
            if (!canRemoveEditor.value) {
                return;
            }

            editors.value.splice(findEditorIndex(id), 1);

            $bus.$emit('editors:refresh');
        };

        const makeEditor = () => {
            const language = last(editors.value)?.language ?? 'php';

            return {
                id: uuid(),
                tabSize: 4,
                language: language,
                value: language === 'php' ? '<?php\n\n' : '',
            };
        };

        const initSplitView = () => {
            if (split.value) {
                split.value.destroy();
            }

            split.value = Split([editorContainer.value, previewContainer.value.$el], {
                sizes: sizes.value,
                onDrag: (values) => (sizes.value = values),
                direction: isPortrait.value ? 'vertical' : 'horizontal',
            });
        };

        const addEditor = () => {
            editors.value.push(makeEditor());

            $bus.$emit('editors:refresh');
        };

        const code = computed(() =>
            editors.value.map(({ id, value }) => ({
                id,
                value: value.replace('<?php', '').replace(/(\n*)/, ''),
            }))
        );

        const languages = computed(() =>
            editors.value.map(({ id, language }) => ({
                id,
                name: language,
            }))
        );

        watch(data, (data) => syncPageInStorage(data));

        watch([sizes, visible, editors], handleWindowResize);

        watch(orientation, () => {
            initSplitView();
            handleWindowResize();
        });

        onMounted(async () => {
            await restorePageFromStorage();

            window.addEventListener('resize', handleWindowResize);

            handleWindowResize();

            initSplitView();
        });

        onBeforeUnmount(() => window.removeEventListener('resize', handleWindowResize));

        return {
            sizes,
            editors,
            addEditor,
            toggleLayout,
            editorContainer,
            previewContainer,
            canRemoveEditor,
            isPortrait,
            isLandscape,
            code,
            languages,
            findEditorIndex,
            removeEditor,
            moveEditorUp,
            moveEditorDown,
        };
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
