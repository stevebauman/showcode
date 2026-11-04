<template>
    <div
        class="editor-workspace flex h-full flex-1 flex-col justify-between overflow-hidden"
        :data-orientation="orientation"
        :class="{
            'lg:flex-row': orientation === 'left',
            'lg:flex-row-reverse': orientation === 'right',
            'lg:flex-col': orientation === 'top',
            'lg:flex-col-reverse': orientation === 'bottom',
        }"
    >
        <Transition
            name="code-editor"
            @before-enter="prepareEditorTransition"
            @before-leave="prepareEditorTransition"
            @after-enter="finishEditorTransition"
            @after-leave="finishEditorTransition"
        >
            <div
                v-show="editorOpen"
                :id="editorId"
                ref="editorContainerRef"
                role="region"
                aria-label="Code editors"
                :aria-hidden="!editorOpen"
                :inert="!editorOpen"
                class="editor-shell size-full shrink-0 overflow-hidden"
            >
                <div
                    ref="editorContentRef"
                    class="editor-content flex size-full"
                    :class="{
                        'flex-col': ['left', 'right'].includes(orientation),
                        'flex-row': ['top', 'bottom'].includes(orientation),
                    }"
                >
                    <Editor
                        ref="editorRefs"
                        class="size-full min-w-0"
                        v-for="(editor, index) in editors"
                        v-model="editors[index].value"
                        :id="editor.id"
                        :key="editor.id"
                        :sizes="sizes"
                        :orientation="orientation"
                        :tab-size="editor.tabSize"
                        :language="editor.language"
                        :show-line-numbers="editor.showLineNumbers"
                        :can-move-up="index !== 0"
                        :can-move-down="index !== editors.length - 1"
                        :can-remove="canRemoveEditor"
                        :can-hide="index === editors.length - 1"
                        :pane-id="editorId"
                        :added="editors[index].added"
                        :removed="editors[index].removed"
                        :focused="editors[index].focused"
                        @add="addEditor"
                        @remove="removeEditor"
                        @up="moveEditorUp"
                        @down="moveEditorDown"
                        @hide="closeEditor"
                        @update:tab-size="editors[index].tabSize = $event"
                        @update:language="editors[index].language = $event"
                        @update:show-line-numbers="editor.showLineNumbers = $event"
                        @update:added="editors[index].added = $event"
                        @update:removed="editors[index].removed = $event"
                        @update:focused="editors[index].focused = $event"
                    />
                </div>
            </div>
        </Transition>

        <div
            ref="previewContainerRef"
            class="min-h-0 min-w-0 overflow-hidden"
            :class="{ 'size-full': !editorOpen }"
        >
            <Preview
                ref="previewRef"
                :code="code"
                :languages="languages"
                :name="project.tab.name"
                v-model:orientation="orientation"
                v-model:editor-open="editorOpen"
                :editor-id="editorId"
                :viewport="project.viewport"
                :settings="project.settings"
                class="scrollbar-hide h-full overflow-auto"
                @update:touched="$emit('update:touched')"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, watch, nextTick, computed, onMounted, onBeforeUnmount, useId } from 'vue';
import { v4 as uuid } from 'uuid';
import useSplitView from '@/composables/useSplitView';
import useEditorUtils from '~/composables/useEditorUtils';
import { useWindowSize, useResizeObserver } from '@vueuse/core';
import usePreferencesStore from '@/composables/usePreferencesStore';
import { last, range, defaults } from 'lodash';

const props = defineProps({
    project: { type: Object, required: true },
});

const emit = defineEmits(['update:touched']);

const { $bus } = useNuxtApp();

const preferences = usePreferencesStore();

const editorRefs = ref([]);
const editorOpen = ref(true);
const editorId = useId();
const editorContainerRef = ref(null);
const editorContentRef = ref(null);
const previewContainerRef = ref(null);
const previewRef = ref(null);
const splitGutterSize = 5;
let editorAnimations = [];

const { width } = useWindowSize();

const hasSmallScreen = computed(() => width.value <= 1024);

const page = defaults(props.project.page, {
    editors: [],
    sizes: [30, 70],
    editorSizes: [],
    previousOrientation: null,
    orientation: hasSmallScreen.value ? 'top' : 'left',
});

const { sizes, editorSizes, editors, orientation, previousOrientation } = toRefs(page);

const canRemoveEditor = computed(() => editors.value.length > 1);
const orderedEditorRefs = computed(() =>
    editors.value.map(({ id }) => editorRefs.value.find((editor) => editor.$props.id === id))
);

useResizeObserver(document.body, () => {
    // Here we will force portrait mode when screen width is
    // small, then restore the users previously saved
    // orientation when screen width is increased.
    if (hasSmallScreen.value) {
        previousOrientation.value = previousOrientation.value ?? orientation.value;

        orientation.value = 'top';
    } else if (previousOrientation.value) {
        const previous = previousOrientation.value;

        previousOrientation.value = null;

        orientation.value = previous;
    }
});

const { init: initEditorSplitView, destroy: destroyEditorSplitView } = useSplitView(
    orderedEditorRefs,
    computed(() => ({
        gutterSize: splitGutterSize,
        sizes: editorSizes.value,
        onDragStart: cancelEditorAnimations,
        onDrag: (values) => (editorSizes.value = values),
        direction: ['top', 'bottom'].includes(orientation.value) ? 'horizontal' : 'vertical',
    }))
);

const { init: initPageSplitView, destroy: destroyPageSplitView } = useSplitView(
    [editorContainerRef, previewContainerRef],
    computed(() => ({
        gutterSize: splitGutterSize,
        sizes: sizes.value,
        onDrag: (values) => (sizes.value = values),
        direction: ['top', 'bottom'].includes(orientation.value) ? 'vertical' : 'horizontal',
    }))
);

function findEditorIndex(id) {
    return editors.value.findIndex((editor) => editor.id === id);
}

async function moveEditor(from, to) {
    const panes = orderedEditorRefs.value.map((editor) => ({
        element: editor.$el,
        before: editor.$el.getBoundingClientRect(),
    }));

    cancelEditorAnimations();
    destroyEditorSplitView();

    const editor = editors.value[from];

    editors.value.splice(from, 1);

    editors.value.splice(to, 0, editor);

    await nextTick();

    initEditorSplitView();
    refreshEditorsLayout();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const movements = panes.map((pane) => ({
        ...pane,
        after: pane.element.getBoundingClientRect(),
    }));

    editorAnimations = movements
        .filter(({ before, after }) => before.width && before.height && after.width && after.height)
        .map(({ element, before, after }) => {
            const offsetX = before.left - after.left;
            const offsetY = before.top - after.top;
            const scaleX = before.width / after.width;
            const scaleY = before.height / after.height;
            const zIndex = element === panes[from].element ? 1 : 0;

            return element.animate(
                {
                    transform: [
                        `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`,
                        'none',
                    ],
                    transformOrigin: ['top left', 'top left'],
                    zIndex: [zIndex, zIndex],
                },
                { duration: 200, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
            );
        });
}

function cancelEditorAnimations() {
    editorAnimations.forEach((animation) => animation.cancel());
    editorAnimations = [];
}

function prepareEditorTransition(element) {
    cancelEditorAnimations();

    if (editorOpen.value) {
        element.style.display = '';
        initPageSplitView();
        initEditorSplitView();
    }

    if (!editorContentRef.value.style.width) {
        const { width, height } = element.getBoundingClientRect();
        editorContentRef.value.style.width = `${width}px`;
        editorContentRef.value.style.height = `${height}px`;
    }
    previewContainerRef.value.style.flex = '1';
}

function finishEditorTransition() {
    if (!editorOpen.value) {
        destroyPageSplitView();
        destroyEditorSplitView();
    }

    editorContentRef.value.style.width = '';
    editorContentRef.value.style.height = '';
    previewContainerRef.value.style.flex = '';
    refreshEditorsLayout();

    if (editorOpen.value) {
        orderedEditorRefs.value.at(-1)?.focusToggle?.();
    }
}

function closeEditor() {
    editorOpen.value = false;
    nextTick(() => previewRef.value?.focusEditorToggle?.());
}

function moveEditorUp(id) {
    const index = findEditorIndex(id);

    moveEditor(index, index - 1);
}

function moveEditorDown(id) {
    const index = findEditorIndex(id);

    moveEditor(index, index + 1);
}

function removeEditor(id) {
    if (!canRemoveEditor.value) {
        return;
    }

    cancelEditorAnimations();
    destroyEditorSplitView();

    editors.value.splice(findEditorIndex(id), 1);

    $bus.$emit('editors:refresh');
}

function makeEditor() {
    const language = last(editors.value)?.language ?? preferences.editorLanguage;

    return {
        id: uuid(),
        added: [],
        removed: [],
        focused: [],
        language: language,
        tabSize: preferences.editorTabSize,
        showLineNumbers: true,
        value: preferences.editorInitialValue,
    };
}

function addEditor() {
    if (editors.value.length === 0) {
        orientation.value = hasSmallScreen.value ? 'top' : preferences.editorOrientation;
    }

    cancelEditorAnimations();
    destroyEditorSplitView();

    editors.value.push(makeEditor());

    $bus.$emit('editors:refresh');
}

const { getCodeFromEditors, getLanguagesFromEditors } = useEditorUtils();

const code = computed(() => getCodeFromEditors(editors));
const languages = computed(() => getLanguagesFromEditors(editors));

function nextFrame() {
    if (typeof requestAnimationFrame !== 'function') {
        return nextTick();
    }

    return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function refreshEditorsLayout() {
    await nextTick();
    await nextFrame();

    $bus.$emit('editors:refresh');
}

async function captureThumbnail() {
    await nextTick();
    await previewRef.value?.captureThumbnail();
}

defineExpose({
    captureThumbnail,
    exportImage: (method) => previewRef.value?.saveAs(method),
    copyImage: () => previewRef.value?.copyToClipboard(),
});

watch(
    () => editors.value.length,
    () => {
        nextTick(() => {
            // Here we are calculating the available size for each
            // editor after one has been added or removed, so
            // that the size may be distributed equally.
            const count = editorRefs.value.length;

            editorSizes.value = range(0, 100, 100 / count).map(() => 100 / count);

            if (editorOpen.value) {
                initEditorSplitView();
            }
        });
    }
);

watch(orientation, async () => {
    cancelEditorAnimations();
    await nextTick();

    if (editorOpen.value) {
        initPageSplitView();
        initEditorSplitView();
    }

    refreshEditorsLayout();
});

// Here we are ensuring all editors that have been restored
// from localstorage have any additional properties
// that may have been added with future updates.
editors.value = editors.value.map((editor) => defaults(editor, makeEditor()));

watch(page, () => emit('update:touched'), { deep: true, flush: 'sync' });

onMounted(async () => {
    if (editors.value.length === 0) {
        addEditor();

        await nextTick();
    }

    initPageSplitView();
    initEditorSplitView();
});

onBeforeUnmount(cancelEditorAnimations);
</script>

<style scoped>
.editor-workspace[data-orientation='left'] {
    --editor-hidden-transform: translateX(-100%);
}
.editor-workspace[data-orientation='right'] {
    --editor-hidden-transform: translateX(100%);
}
.editor-workspace[data-orientation='top'] {
    --editor-hidden-transform: translateY(-100%);
}
.editor-workspace[data-orientation='bottom'] {
    --editor-hidden-transform: translateY(100%);
}
.editor-shell {
    position: relative;
}
.editor-shell.code-editor-enter-active,
.editor-shell.code-editor-leave-active,
.code-editor-enter-active + :deep(.gutter),
.code-editor-leave-active + :deep(.gutter) {
    transition:
        width 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
        height 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    pointer-events: none;
}
.code-editor-enter-active .editor-content,
.code-editor-leave-active .editor-content {
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.editor-workspace[data-orientation='right']
    :is(.code-editor-enter-active, .code-editor-leave-active)
    .editor-content {
    left: auto;
    right: 0;
}
.editor-workspace[data-orientation='bottom']
    :is(.code-editor-enter-active, .code-editor-leave-active)
    .editor-content {
    top: auto;
    bottom: 0;
}
.code-editor-enter-from .editor-content,
.code-editor-leave-to .editor-content {
    transform: var(--editor-hidden-transform);
}
.editor-workspace:is([data-orientation='left'], [data-orientation='right'])
    :is(.code-editor-enter-from, .code-editor-leave-to),
.code-editor-enter-from + :deep(.gutter-horizontal),
.code-editor-leave-to + :deep(.gutter-horizontal) {
    width: 0 !important;
}
.editor-workspace:is([data-orientation='top'], [data-orientation='bottom'])
    :is(.code-editor-enter-from, .code-editor-leave-to),
.code-editor-enter-from + :deep(.gutter-vertical),
.code-editor-leave-to + :deep(.gutter-vertical) {
    height: 0 !important;
}
@media (prefers-reduced-motion: reduce) {
    .editor-shell,
    .editor-content,
    .editor-workspace > :deep(.gutter) {
        transition: none !important;
    }
}
</style>
