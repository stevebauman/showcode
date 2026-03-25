<template>
    <button
       
        :style="{ transform: `scale(${zoomScale})` }"
        class="z-20 bg-white dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-500 rounded-full shadow exclude-from-panzoom active:bg-zinc-100 dark:active:bg-zinc-900 hover:scale-200"
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
