<template>
    <input
        type="range"
        :value="value"
        @input="$emit('input', $event.target.value)"
        class="px-0.5 transition-all highlight bg-ui-gray-800 w-full appearance-none hover:bg-ui-violet-500 rounded-xl focus:bg-ui-violet-500 focus:outline-none focus:ring-0"
    />
</template>

<script>
export default {
    props: {
        value: [String, Number],
    },
};
</script>

<style scoped>
input[type='range']::-webkit-slider-runnable-track {
    @apply h-5 bg-ui-gray-800 rounded-full hover:bg-ui-violet-500 transition px-0.5;
}

input[type='range']::-webkit-slider-thumb {
    @apply size-4 my-0.5 rounded-full shadow appearance-none cursor-resize-width border-white bg-white;
}

input[type='range']::-moz-range-thumb {
    @apply size-4 my-0.5 rounded-full appearance-none cursor-resize-width border-white bg-white;
}

input[type='range']:disabled::-webkit-slider-thumb {
    @apply bg-ui-gray-700 cursor-not-allowed;
}

input[type='range']:disabled::-moz-range-thumb {
    @apply bg-ui-gray-700 cursor-not-allowed;
}
</style>
