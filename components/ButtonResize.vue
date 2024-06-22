<template>
    <button
        dusk="button-resize"
        :style="{ transform: `scale(${zoomScale})` }"
        class="z-20 bg-white border border-gray-700 rounded-full shadow exclude-from-panzoom active:bg-ui-gray-700 hover:scale-200"
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
