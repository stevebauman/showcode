<template>
    <div
        class="flex flex-col justify-between flex-1 h-full overflow-hidden"
        :class="{
            'lg:flex-row': orientation === 'left',
            'lg:flex-row-reverse': orientation === 'right',
            'lg:flex-col': orientation === 'top',
            'lg:flex-col-reverse': orientation === 'bottom',
        }"
    >
        <div
            dusk="editors"
            ref="editorContainerRef"
            class="flex w-full h-full rounded-b-none"
            :class="{
                'flex-col': ['left', 'right'].includes(orientation),
                'divide-ui-gray-700 divide-x-4 flex-row': ['top', 'bottom'].includes(orientation),
            }"
        >
            <Editor
                dusk="editor"
                ref="editorRefs"
                class="w-full h-full overflow-hidden"
                v-for="(editor, index) in editors"
                v-model="editors[index].value"
                :id="editor.id"
                :key="index"
                :sizes="sizes"
                :orientation="orientation"
                :tab-size="editor.tabSize"
                :language="editor.language"
                :can-move-up="index !== 0"
                :can-move-down="index !== editors.length - 1"
                :can-remove="canRemoveEditor"
                :can-toggle-layout="index === 0"
                @add="addEditor"
                @remove="removeEditor"
                @up="moveEditorUp"
                @down="moveEditorDown"
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

export default {
    props: {
        tab: {
            type: Object,
            required: true,
        },
    },

    components: { XIcon },

    setup(props) {
        const { tab } = toRefs(props);

        const { $bus, $memory } = useContext();

        const editorRefs = ref([]);
        const editorContainerRef = ref(null);
        const previewContainerRef = ref(null);

        const data = reactive({
            editors: [],
            sizes: [40, 60],
            editorSizes: [],
            previousOrientation: null,
            orientation: window.innerWidth >= 1000 ? 'left' : 'top',
        });

        const { sizes, editorSizes, editors, orientation, previousOrientation } = toRefs(data);

        const canRemoveEditor = computed(() => editors.value.length > 1);

        const { init: initEditorSplitView } = useSplitView(
            editorRefs,
            computed(() => ({
                gutterSize: 6,
                sizes: editorSizes.value,
                onDrag: (values) => (editorSizes.value = values),
                direction: ['top', 'bottom'].includes(orientation.value)
                    ? 'horizontal'
                    : 'vertical',
            }))
        );

        const { init: initPageSplitView } = useSplitView(
            [editorContainerRef, previewContainerRef],
            computed(() => ({
                gutterSize: 6,
                sizes: sizes.value,
                onDrag: (values) => (sizes.value = values),
                direction: ['top', 'bottom'].includes(orientation.value)
                    ? 'vertical'
                    : 'horizontal',
            }))
        );

        const toggleLayout = () =>
            (orientation.value = {
                top: 'right',
                bottom: 'left',
                left: 'top',
                right: 'bottom',
            }[orientation.value]);

        const toggleReverse = () =>
            (orientation.value = {
                top: 'bottom',
                bottom: 'top',
                left: 'right',
                right: 'left',
            }[orientation.value]);

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

                orientation.value = 'top';
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

        watch(editorRefs, (refs) => {
            // Here we are calculating the availble size for each
            // editor after one has been added or removed, so
            // that the size may be distributed equally.
            editorSizes.value = range(0, 100, 100 / refs.length).map(() => 100 / refs.length);

            initEditorSplitView();
        });

        watch(orientation, () => {
            nextTick(initPageSplitView);
            nextTick(initEditorSplitView);
        });

        watch([orientation, editorSizes], () => $bus.$emit('editors:refresh'));

        onMounted(async () => {
            await restorePageFromStorage();

            initPageSplitView();
            initEditorSplitView();

            window.addEventListener('resize', handleWindowResize);
        });

        onBeforeUnmount(() => window.removeEventListener('resize', handleWindowResize));

        return {
            code,
            sizes,
            editors,
            addEditor,
            languages,
            editorRefs,
            orientation,
            moveEditorUp,
            moveEditorDown,
            removeEditor,
            toggleLayout,
            toggleReverse,
            findEditorIndex,
            canRemoveEditor,
            editorContainerRef,
            previewContainerRef,
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

.gutter.gutter-vertical {
    @apply cursor-resize-height;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}
</style>
