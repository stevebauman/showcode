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
let editorAnimationVersion = 0;
let pendingEditorRemoval = null;
let unmounting = false;

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
        onDragStart: cancelEditorAnimations,
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
    editorAnimationVersion++;
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

async function moveEditorUp(id) {
    while (pendingEditorRemoval) await pendingEditorRemoval;
    const index = findEditorIndex(id);

    if (index > 0) moveEditor(index, index - 1);
}

async function moveEditorDown(id) {
    while (pendingEditorRemoval) await pendingEditorRemoval;
    const index = findEditorIndex(id);

    if (index >= 0 && index < editors.value.length - 1) moveEditor(index, index + 1);
}

function removeEditor(id) {
    if (pendingEditorRemoval) return pendingEditorRemoval.then(() => removeEditor(id));
    if (!canRemoveEditor.value || findEditorIndex(id) < 0) return;

    pendingEditorRemoval = collapseEditor(id).finally(() => {
        pendingEditorRemoval = null;
    });
    return pendingEditorRemoval;
}

async function collapseEditor(id) {
    const index = findEditorIndex(id);
    const dimension = ['left', 'right'].includes(orientation.value) ? 'height' : 'width';
    const panes = orderedEditorRefs.value.map((editor) => ({
        editor,
        size: editor.$el.getBoundingClientRect()[dimension],
    }));
    const removed = panes[index].editor.$el;
    const trigger = document.activeElement;
    const shouldFocus = removed.contains(trigger);
    const remainingCount = panes.length - 1;
    const availableSize = editorContentRef.value.getBoundingClientRect()[dimension];
    const gutter = index ? removed.previousElementSibling : removed.nextElementSibling;
    const gutterSize = gutter.getBoundingClientRect()[dimension];

    cancelEditorAnimations();
    const version = editorAnimationVersion;

    if (editorOpen.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const options = { duration: 200, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' };
        let remainingIndex = 0;
        editorAnimations = panes.flatMap(({ editor, size }) => {
            if (!size) return [];
            const leaving = editor.$props.id === id;
            // Split.js reserves half a gutter at the ends and a full gutter between panes.
            const gutterSpace =
                remainingCount === 1
                    ? 0
                    : remainingIndex === 0 || remainingIndex === remainingCount - 1
                      ? splitGutterSize / 2
                      : splitGutterSize;
            const target = leaving ? 0 : availableSize / remainingCount - gutterSpace;
            if (!leaving) remainingIndex++;

            return editor.$el.animate(
                {
                    [dimension]: [`${size}px`, `${target}px`],
                    ...(leaving ? { opacity: [1, 0] } : {}),
                },
                options
            );
        });
        if (gutterSize) {
            editorAnimations.push(
                gutter.animate(
                    {
                        [dimension]: [`${gutterSize}px`, '0px'],
                        opacity: [1, 0],
                    },
                    options
                )
            );
        }
        await Promise.allSettled(editorAnimations.map((animation) => animation.finished));
    }

    if (unmounting) return;

    destroyEditorSplitView();
    editors.value.splice(findEditorIndex(id), 1);

    await nextTick();
    refreshEditorsLayout();
    if (
        shouldFocus &&
        version === editorAnimationVersion &&
        editorOpen.value &&
        (document.activeElement === trigger || document.activeElement === document.body)
    ) {
        orderedEditorRefs.value[Math.min(index, remainingCount - 1)]?.focus();
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

    const panes = new Map(
        orderedEditorRefs.value.map((editor) => [
            editor.$props.id,
            editor.$el.getBoundingClientRect(),
        ])
    );
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

    if (!panes.size || version !== editorAnimationVersion || !editorOpen.value) return;

    const added = orderedEditorRefs.value.find((pane) => pane.$props.id === editor.id);
    const dimension = ['left', 'right'].includes(orientation.value) ? 'height' : 'width';
    const options = { duration: 200, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const targets = orderedEditorRefs.value.map((pane) => ({
            element: pane.$el,
            before: panes.get(pane.$props.id),
            size: pane.$el.getBoundingClientRect()[dimension],
        }));
        const gutter = added.$el.previousElementSibling;
        const gutterSize = gutter?.getBoundingClientRect()[dimension];

        editorAnimations = targets.flatMap(({ element, before, size }) => {
            if (!size) return [];

            return element.animate(
                {
                    [dimension]: [`${before?.[dimension] ?? 0}px`, `${size}px`],
                    ...(before ? {} : { opacity: [0, 1] }),
                },
                options
            );
        });

        if (gutterSize) {
            editorAnimations.push(
                gutter.animate(
                    { [dimension]: ['0px', `${gutterSize}px`], opacity: [0, 1] },
                    options
                )
            );
        }

        // Cancelling an entrance (for example, by dragging) rejects its finished promise.
        await Promise.allSettled(editorAnimations.map((animation) => animation.finished));
    }

    if (version !== editorAnimationVersion) return;

    refreshEditorsLayout();

    if (document.activeElement === trigger || document.activeElement === document.body) {
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

        editorSizes.value = range(0, 100, 100 / count).map(() => 100 / count);

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
