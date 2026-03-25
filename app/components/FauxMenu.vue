<template>
    <div class="flex items-center gap-2">
        <div
            class="w-3 h-3 rounded-full"
            v-for="(dot, index) in dots"
            :key="index"
            :style="{ backgroundColor: dotColor }"
            :class="theme === 'color' ? classes[dot] : null"
        ></div>
    </div>
</template>

<script setup>
import chroma from 'chroma-js';
import { computed } from 'vue';

const props = defineProps({
    theme: String,
    themeBackground: String,
});

const dots = [0, 1, 2];
const classes = ['bg-red-500', 'bg-yellow-400', 'bg-green-400'];

const dotColor = computed(() => {
    if (props.theme === 'color') return;

    return chroma(props.themeBackground)
        .darken(props.theme === 'light' ? 1 : -3)
        .alpha(0.5)
        .hex();
});
</script>
