<template>
    <div
        ref="viewport"
        class="scrollbar-hide w-full overflow-x-auto"
        @scroll.passive="scheduleVisibleRangeUpdate"
        @wheel="onWheel"
    >
        <div class="relative" :style="canvasStyle">
            <div
                v-for="entry in visibleThemes"
                :key="entry.theme"
                class="absolute"
                :style="entry.style"
            >
                <ButtonTheme
                    :code="code"
                    :settings="settings"
                    :languages="languages"
                    :theme="entry.theme"
                    :background="background"
                    :active="entry.theme === theme"
                    :data-ref="`button-theme-${entry.theme}`"
                    @click="$emit('select', entry.theme)"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const props = defineProps({
    code: { type: Array, required: true },
    theme: { type: String, default: true },
    themes: { type: Array, required: true },
    settings: { type: Object, required: true },
    background: { type: Object, required: true },
    languages: { type: Array, required: true },
});

defineEmits(['select']);

const rows = 2;
const cardWidth = 256;
const cardHeight = 192;
const gap = 16;
const padding = 16;
const overscan = 0;
const columnStride = cardWidth + gap;

const { theme, themes } = toRefs(props);
const viewport = ref(null);
const firstVisibleColumn = ref(0);
const lastVisibleColumn = ref(0);
let visibleRangeFrame = null;

const columnCount = computed(() => Math.ceil(themes.value.length / rows));

const canvasStyle = computed(() => ({
    width: `${padding * 2 + columnCount.value * cardWidth + Math.max(0, columnCount.value - 1) * gap}px`,
    height: `${padding * 2 + rows * cardHeight + (rows - 1) * gap}px`,
}));

const visibleThemes = computed(() => {
    const entries = [];

    for (let column = firstVisibleColumn.value; column <= lastVisibleColumn.value; column++) {
        for (let row = 0; row < rows; row++) {
            const index = column * rows + row;
            const availableTheme = themes.value[index];

            if (!availableTheme) {
                continue;
            }

            entries.push({
                theme: availableTheme,
                style: {
                    left: `${padding + column * columnStride}px`,
                    top: `${padding + row * (cardHeight + gap)}px`,
                },
            });
        }
    }

    return entries;
});

function updateVisibleRange() {
    visibleRangeFrame = null;

    if (!viewport.value) {
        return;
    }

    const start = Math.floor(Math.max(0, viewport.value.scrollLeft - padding) / columnStride);
    const end = Math.ceil(
        (viewport.value.scrollLeft + viewport.value.clientWidth - padding) / columnStride
    );

    firstVisibleColumn.value = Math.max(0, start - overscan);
    lastVisibleColumn.value = Math.min(columnCount.value - 1, end + overscan);
}

function scheduleVisibleRangeUpdate() {
    if (visibleRangeFrame) {
        cancelAnimationFrame(visibleRangeFrame);
    }

    visibleRangeFrame = requestAnimationFrame(updateVisibleRange);
}

function scrollToTheme() {
    if (!viewport.value) {
        return;
    }

    const index = themes.value.indexOf(theme.value);

    if (index === -1) {
        scheduleVisibleRangeUpdate();
        return;
    }

    const column = Math.floor(index / rows);
    const left = padding + column * columnStride;

    viewport.value.scrollLeft = Math.max(0, left - (viewport.value.clientWidth - cardWidth) / 2);

    scheduleVisibleRangeUpdate();
}

function onWheel(event) {
    if (!viewport.value || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        return;
    }

    event.preventDefault();
    viewport.value.scrollLeft += event.deltaY;
}

useResizeObserver(viewport, scheduleVisibleRangeUpdate);

onMounted(() => nextTick(scrollToTheme));
watch(theme, () => nextTick(scrollToTheme));
watch(themes, scheduleVisibleRangeUpdate);

onBeforeUnmount(() => {
    if (visibleRangeFrame) {
        cancelAnimationFrame(visibleRangeFrame);
    }
});
</script>
