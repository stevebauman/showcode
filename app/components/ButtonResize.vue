<template>
    <button
        :style="{ '--resize-zoom-scale': zoomScale }"
        class="exclude-from-panzoom z-20 rounded-full border border-zinc-400 bg-white shadow-sm transition-transform duration-150 ease-out active:bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800 dark:active:bg-zinc-900"
    ></button>
</template>

<script setup>
defineProps({
    zoomScale: {
        type: [Number, String],
        required: true,
    },
});
</script>

<style scoped>
button {
    transform: scale(calc(var(--resize-zoom-scale) * 1));
}

button:hover {
    transform: scale(calc(var(--resize-zoom-scale) * 1.35));
}
</style>
