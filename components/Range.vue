<template>
    <input
        :value="value"
        @input="$emit('input', $event.target.value)"
        type="range"
        class="px-0.5 transition-all bg-gray-800 appearance-none hover:bg-violet-500 rounded-xl"
    />
</template>

<script>
export default {
    props: {
        value: [String, Number],
    },
};
</script>

<style>
@media screen and (-webkit-min-device-pixel-ratio: 0) {
    input[type='range']::-webkit-slider-thumb {
        @apply h-4 w-4 my-0.5 rounded-full appearance-none cursor-resize-width bg-white;
    }
}
</style>
