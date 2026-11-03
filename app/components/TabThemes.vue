<template>
    <div
        ref="viewport"
        class="w-full overflow-y-auto overscroll-contain"
        @scroll.passive="scheduleVisibleRangeUpdate"
    >
        <div class="relative" :style="{ height: `${contentHeight}px` }">
            <div
                v-for="entry in visibleThemes"
                :key="entry.theme"
                class="absolute left-1/2 -translate-x-1/2"
                :style="{ top: `${padding + entry.index * rowHeight}px` }"
            >
                <ButtonTheme
                    :code="code"
                    :settings="settings"
                    :languages="languages"
                    :theme="entry.theme"
                    :background="background"
                    :active="entry.theme === theme"
                    :data-ref="`button-theme-${entry.theme}`"
                    @mousedown.prevent
                    @click="selectTheme($event, entry.theme)"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const props = defineProps({
    code: { type: Array, required: true },
    theme: { type: String, required: true },
    themes: { type: Array, required: true },
    settings: { type: Object, required: true },
    background: { type: Object, required: true },
    languages: { type: Array, required: true },
});

const emit = defineEmits(['select']);
const cardHeight = 192;
const gap = 16;
const padding = 16;
const rowHeight = cardHeight + gap;
const { theme, themes } = toRefs(props);
const viewport = ref(null);
const firstVisibleRow = ref(0);
const lastVisibleRow = ref(0);
let visibleRangeFrame = null;

const contentHeight = computed(() => padding * 2 + themes.value.length * rowHeight - gap);

const visibleThemes = computed(() =>
    themes.value
        .slice(firstVisibleRow.value, lastVisibleRow.value + 1)
        .map((theme, index) => ({ theme, index: firstVisibleRow.value + index }))
);

function updateVisibleRange() {
    visibleRangeFrame = null;

    if (!viewport.value) {
        return;
    }

    const { scrollTop, clientHeight } = viewport.value;
    firstVisibleRow.value = Math.max(0, Math.floor((scrollTop - padding) / rowHeight));
    lastVisibleRow.value = Math.min(
        themes.value.length - 1,
        Math.ceil((scrollTop + clientHeight - padding) / rowHeight)
    );
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

    if (index !== -1) {
        viewport.value.scrollTop = Math.max(
            0,
            padding + index * rowHeight - (viewport.value.clientHeight - cardHeight) / 2
        );
    }

    scheduleVisibleRangeUpdate();
}

function selectTheme(event, selectedTheme) {
    event.currentTarget.focus({ preventScroll: true });
    emit('select', selectedTheme);
}

useResizeObserver(viewport, scheduleVisibleRangeUpdate);

onMounted(scrollToTheme);
watch(
    themes,
    (_, previous) => {
        if (previous.length === 0) scrollToTheme();
        else scheduleVisibleRangeUpdate();
    },
    { flush: 'post' }
);

onBeforeUnmount(() => {
    if (visibleRangeFrame) {
        cancelAnimationFrame(visibleRangeFrame);
    }
});
</script>
