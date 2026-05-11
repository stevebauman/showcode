<template>
    <div class="flex items-center gap-2">
        <div
            class="h-3 w-3 rounded-full"
            v-for="(dot, index) in dots"
            :key="index"
            :style="dotStyle(index)"
            :class="appearance.theme === 'color' ? classes[dot] : null"
        ></div>
    </div>
</template>

<script setup>
import chroma from 'chroma-js';
import { computed } from 'vue';

const props = defineProps({
    appearance: {
        type: Object,
        default: () => ({
            theme: 'dark',
            themeBackground: '#111',
        }),
    },
});

const dots = [0, 1, 2];
const classes = ['bg-red-500', 'bg-yellow-400', 'bg-green-400'];

const dotColor = computed(() => {
    if (props.appearance.theme === 'color') return;

    return chroma(props.appearance.themeBackground)
        .darken(props.appearance.theme === 'light' ? 1 : -3)
        .alpha(0.5)
        .hex();
});

function dotStyle(index) {
    return props.appearance.dots?.[index] ?? { backgroundColor: dotColor.value };
}
</script>
