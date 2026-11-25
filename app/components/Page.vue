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
                    :class="editorsStackVertically ? 'flex-col' : 'flex-row'"
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
                        @up="moveEditor($event, -1)"
                        @down="moveEditor($event, 1)"
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
import { useWindowSize, useResizeObserver, usePreferredReducedMotion, until } from '@vueuse/core';
import usePreferencesStore from '@/composables/usePreferencesStore';
import { last, defaults } from 'lodash';

const props = defineProps({
    project: { type: Object, required: true },
});

const emit = defineEmits(['update:touched']);

const { $bus } = useNuxtApp();

const preferences = usePreferencesStore();

const editorRefs = ref([]);
const editorOpen = ref(true);
const resizingEditors = ref(false);
const editorId = useId();
const editorContainerRef = ref(null);
const editorContentRef = ref(null);
const previewContainerRef = ref(null);
const previewRef = ref(null);

const splitGutterSize = 5;
const editorAnimationOptions = { duration: 200, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' };

let editorAnimations = [];
let editorAnimationVersion = 0;
let pendingEditorRemoval = null;
let unmounting = false;

const { width } = useWindowSize();
const reducedMotion = usePreferredReducedMotion();

const hasSmallScreen = computed(() => width.value <= 1024);

const page = defaults(props.project.page, {
    editors: [],
    sizes: [30, 70],
    editorSizes: [],
    previousOrientation: null,
    orientation: hasSmallScreen.value ? 'top' : 'left',
});

const { sizes, editorSizes, editors, orientation, previousOrientation } = toRefs(page);

const editorsStackVertically = computed(() => ['left', 'right'].includes(orientation.value));
const editorDimension = computed(() => (editorsStackVertically.value ? 'height' : 'width'));
const canAnimateEditors = computed(() => editorOpen.value && reducedMotion.value !== 'reduce');
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
        onDragStart: () => {
            resizingEditors.value = true;
            cancelEditorAnimations();
        },
        onDrag: (values) => (editorSizes.value = values),
        onDragEnd: () => (resizingEditors.value = false),
        direction: editorsStackVertically.value ? 'vertical' : 'horizontal',
    }))
);

const { init: initPageSplitView, destroy: destroyPageSplitView } = useSplitView(
    [editorContainerRef, previewContainerRef],
    computed(() => ({
        gutterSize: splitGutterSize,
        sizes: sizes.value,
        onDragStart: cancelEditorAnimations,
        onDrag: (values) => (sizes.value = values),
        direction: editorsStackVertically.value ? 'horizontal' : 'vertical',
    }))
);

function findEditorIndex(id) {
    return editors.value.findIndex((editor) => editor.id === id);
}

async function moveEditor(id, offset) {
    while (pendingEditorRemoval) await pendingEditorRemoval;

    const from = findEditorIndex(id);
    const to = from + offset;

    if (unmounting || from < 0 || to < 0 || to >= editors.value.length) return;

    const panes = editorRefs.value.map((editor) => ({
        element: editor.$el,
        before: editor.$el.getBoundingClientRect(),
        moving: editor.$props.id === id,
    }));

    cancelEditorAnimations();
    destroyEditorSplitView();

    const version = editorAnimationVersion;

    const [editor] = editors.value.splice(from, 1);
    editors.value.splice(to, 0, editor);

    await nextTick();

    if (unmounting) return;

    initEditorSplitView();
    refreshEditorsLayout();

    if (version !== editorAnimationVersion || !canAnimateEditors.value) return;

    const movements = panes.map((pane) => ({
        ...pane,
        after: pane.element.getBoundingClientRect(),
    }));

    editorAnimations = movements
        .filter(({ before, after }) => before.width && before.height && after.width && after.height)
        .map(({ element, before, after, moving }) => {
            const offsetX = before.left - after.left;
            const offsetY = before.top - after.top;

            const scaleX = before.width / after.width;
            const scaleY = before.height / after.height;

            const zIndex = moving ? 1 : 0;

            return element.animate(
                {
                    transform: [
                        `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`,
                        'none',
                    ],
                    transformOrigin: ['top left', 'top left'],
                    zIndex: [zIndex, zIndex],
                },
                editorAnimationOptions
            );
        });
}

function cancelEditorAnimations() {
    editorAnimationVersion++;

    editorAnimations.forEach((animation) => animation.cancel());
    editorAnimations = [];
}

function measureEditorPane(element) {
    return element?.getBoundingClientRect()[editorDimension.value] ?? 0;
}

function animateEditorSizes(panes) {
    const dimension = editorDimension.value;

    editorAnimations = panes
        .filter(({ from, to }) => from !== to)
        .map(({ element, from, to, opacity }) =>
            element.animate(
                { [dimension]: [`${from}px`, `${to}px`], ...(opacity && { opacity }) },
                editorAnimationOptions
            )
        );

    // Cancelling an animation rejects its finished promise.
    return Promise.allSettled(editorAnimations.map((animation) => animation.finished));
}

function animateEditorRemoval(removed, index) {
    const remaining = orderedEditorRefs.value.filter((_, position) => position !== index);
    const sizePerEditor = measureEditorPane(editorContentRef.value) / remaining.length;
    const gutter = index === 0 ? removed.nextElementSibling : removed.previousElementSibling;

    const panes = remaining.map(({ $el }, position) => {
        // Each neighboring editor takes half of the divider's width or height.
        const dividers = Number(position > 0) + Number(position < remaining.length - 1);

        return {
            element: $el,
            from: measureEditorPane($el),
            to: Math.max(0, sizePerEditor - (splitGutterSize / 2) * dividers),
        };
    });

    panes.push(
        { element: removed, from: measureEditorPane(removed), to: 0, opacity: [1, 0] },
        { element: gutter, from: measureEditorPane(gutter), to: 0, opacity: [1, 0] }
    );

    return animateEditorSizes(panes.filter(({ from }) => from > 0));
}

function animateEditorAddition(added, previousSizes) {
    const panes = orderedEditorRefs.value.map(({ $el }) => ({
        element: $el,
        from: previousSizes.get($el) ?? 0,
        to: measureEditorPane($el),
        opacity: $el === added ? [0, 1] : undefined,
    }));
    const gutter = added.previousElementSibling;

    panes.push({ element: gutter, from: 0, to: measureEditorPane(gutter), opacity: [0, 1] });

    return animateEditorSizes(panes.filter(({ to }) => to > 0));
}

function focusHasStayed(trigger) {
    return document.activeElement === trigger || document.activeElement === document.body;
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

function removeEditor(id) {
    if (pendingEditorRemoval) return pendingEditorRemoval.then(() => removeEditor(id));

    const index = findEditorIndex(id);

    if (unmounting || !canRemoveEditor.value || index < 0) return;

    pendingEditorRemoval = collapseEditor(id, index).finally(() => {
        pendingEditorRemoval = null;
    });

    return pendingEditorRemoval;
}

async function collapseEditor(id, index) {
    const removed = orderedEditorRefs.value[index].$el;
    const trigger = document.activeElement;
    const hadFocus = removed.contains(trigger);

    cancelEditorAnimations();
    const version = editorAnimationVersion;

    if (canAnimateEditors.value && !resizingEditors.value) {
        await animateEditorRemoval(removed, index);
    }

    // Split.js keeps writing pane sizes until the active drag ends.
    if (resizingEditors.value) await until(resizingEditors).toBe(false);

    const removedIndex = findEditorIndex(id);

    if (unmounting || removedIndex < 0) return;

    destroyEditorSplitView();
    editors.value.splice(removedIndex, 1);

    await nextTick();
    refreshEditorsLayout();

    if (
        hadFocus &&
        version === editorAnimationVersion &&
        editorOpen.value &&
        focusHasStayed(trigger)
    ) {
        const neighbor = orderedEditorRefs.value[removedIndex] ?? orderedEditorRefs.value.at(-1);

        neighbor?.focus();
    }
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

async function addEditor() {
    while (pendingEditorRemoval) await pendingEditorRemoval;

    if (unmounting) return;

    const previousSizes = new Map(editorRefs.value.map(({ $el }) => [$el, measureEditorPane($el)]));
    const trigger = document.activeElement;

    if (editors.value.length === 0) {
        orientation.value = hasSmallScreen.value ? 'top' : preferences.editorOrientation;
    }

    cancelEditorAnimations();
    destroyEditorSplitView();

    const version = editorAnimationVersion;
    const editor = makeEditor();

    editors.value.push(editor);

    await nextTick();

    if (!previousSizes.size || version !== editorAnimationVersion || !editorOpen.value) return;

    const added = orderedEditorRefs.value[findEditorIndex(editor.id)];

    if (canAnimateEditors.value) {
        await animateEditorAddition(added.$el, previousSizes);
    }

    if (version !== editorAnimationVersion) return;

    refreshEditorsLayout();

    if (focusHasStayed(trigger)) {
        added.focus();
    }
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
        // Wait for Vue's editor refs, then size panes before an entrance is measured.
        const count = editorRefs.value.length;

        editorSizes.value = Array(count).fill(100 / count);

        if (editorOpen.value) {
            initEditorSplitView();
        }
    },
    { flush: 'post' }
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

onBeforeUnmount(() => {
    unmounting = true;

    resizingEditors.value = false;
    cancelEditorAnimations();
});
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
/* Measuring the restored pane must not animate it toward the collapsed start state. */
.editor-shell.code-editor-enter-from,
.code-editor-enter-from .editor-content,
.code-editor-enter-from + :deep(.gutter) {
    transition: none;
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
