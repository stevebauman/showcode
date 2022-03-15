<template>
    <div
        class="flex flex-col justify-between flex-1 h-full overflow-hidden"
        :class="{
            'lg:flex-row': isLandscape && !reversed,
            'lg:flex-row-reverse': isLandscape && reversed,
            'lg:flex-col': isPortrait && !reversed,
            'lg:flex-col-reverse': isPortrait && reversed,
        }"
    >
        <div
            dusk="editors"
            ref="editorContainerRef"
            class="flex w-full h-full rounded-b-none"
            :class="{
                'flex-col': isLandscape,
                'divide-ui-gray-700 divide-x-4 flex-row': isPortrait,
            }"
        >
            <Editor
                dusk="editor"
                ref="editorRefs"
                class="w-full h-full overflow-hidden"
                v-for="(editor, index) in editors"
                v-model="editors[index].value"
                :id="editor.id"
                :key="editor.id"
                :sizes="sizes"
                :reversed="reversed"
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
                @update:reverse="toggleReverse"
                @update:tab-size="(size) => (editors[index].tabSize = size)"
                @update:language="(lang) => (editors[index].language = lang)"
            />
        </div>

        <Preview
            dusk="preview"
            ref="previewContainerRef"
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

import { v4 as uuid } from 'uuid';
import { XIcon } from 'vue-feather-icons';
import { last, range, debounce, cloneDeep } from 'lodash';
import useSplitView from '../composables/useSplitView';
import {
    ref,
    toRefs,
    watch,
    nextTick,
    computed,
    reactive,
    useContext,
    onMounted,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';
import { editor } from 'monaco-editor';

export default {
    props: {
        tab: Object,
        visible: Boolean,
    },

    components: { XIcon },

    setup(props) {
        const { $bus, $memory } = useContext();

        const { tab, visible } = toRefs(props);

        const ready = ref(false);
        const editorRefs = ref([]);
        const editorContainerRef = ref(null);
        const previewContainerRef = ref(null);

        const data = reactive({
            editors: [],
            reversed: false,
            sizes: [40, 60],
            editorSizes: [],
            previousOrientation: null,
            orientation: window.innerWidth >= 1000 ? LANDSCAPE : PORTRAIT,
        });

        const { reversed, sizes, editorSizes, editors, orientation, previousOrientation } =
            toRefs(data);

        const canRemoveEditor = computed(() => editors.value.length > 1);
        const isPortrait = computed(() => orientation.value === PORTRAIT);
        const isLandscape = computed(() => orientation.value === LANDSCAPE);

        const { init: initEditorSplitView } = useSplitView(
            editorRefs,
            computed(() => ({
                sizes: editorSizes.value,
                onDrag: (values) => (editorSizes.value = values),
                direction: isPortrait.value ? 'horizontal' : 'vertical',
            }))
        );

        const { init: initPageSplitView } = useSplitView(
            [editorContainerRef, previewContainerRef],
            computed(() => ({
                sizes: sizes.value,
                onDrag: (values) => (sizes.value = values),
                direction: isPortrait.value ? 'vertical' : 'horizontal',
            }))
        );

        const toggleLayout = () =>
            (orientation.value = orientation.value === LANDSCAPE ? PORTRAIT : LANDSCAPE);

        const toggleReverse = () => (reversed.value = !reversed.value);

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

        const findEditorIndex = (id) =>
            editors.value.findIndex((editorRefs) => editorRefs.id === id);

        const moveEditor = (from, to) => {
            const editorRefs = editors.value[from];

            editors.value.splice(from, 1);

            editors.value.splice(to, 0, editorRefs);
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

        watch([sizes, editorSizes, visible, editors], handleWindowResize);

        watch(editorRefs, (refs) => {
            if (refs.length !== editorSizes.value.length) {
                editorSizes.value = range(0, 100, 100 / refs.length).map(
                    (size) => 100 / refs.length
                );

                initEditorSplitView();
            }

            $bus.$emit('editors:refresh');
        });

        watch(orientation, () => {
            initPageSplitView();
            initEditorSplitView();

            handleWindowResize();

            $bus.$emit('editors:refresh');
        });

        watch(reversed, () => nextTick(initPageSplitView));
        watch(editorSizes, () => $bus.$emit('editors:refresh'));

        onMounted(async () => {
            await restorePageFromStorage();

            window.addEventListener('resize', handleWindowResize);

            handleWindowResize();

            initPageSplitView();
            initEditorSplitView();
        });

        onBeforeUnmount(() => window.removeEventListener('resize', handleWindowResize));

        return {
            sizes,
            editors,
            reversed,
            addEditor,
            editorRefs,
            toggleLayout,
            toggleReverse,
            editorContainerRef,
            previewContainerRef,
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

<style lang="postcss">
.gutter {
    @apply bg-ui-gray-700 hover:bg-ui-gray-800;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    @apply cursor-resize-width;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}

@screen lg {
    .lg\:flex-row > .gutter.gutter-horizontal {
        @apply rounded-tr-xl;
    }

    .lg\:flex-row-reverse > .gutter.gutter-horizontal {
        @apply rounded-tl-xl;
    }
}

.gutter.gutter-vertical {
    @apply cursor-resize-height;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}
</style>
