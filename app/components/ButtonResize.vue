<template>
    <button
        :style="{ transform: `scale(${zoomScale})` }"
        class="exclude-from-panzoom z-20 rounded-full border border-zinc-400 bg-white shadow-sm hover:scale-200 active:bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800 dark:active:bg-zinc-900"
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
