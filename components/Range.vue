<template>
    <input
        :value="value"
        type="range"
        @input="$emit('input', $event.target.value)"
        class="px-0.5 transition-all bg-ui-gray-800 w-full appearance-none hover:bg-ui-violet-500 rounded-xl focus:bg-ui-violet-500 focus:outline-none focus:ring-0"
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
input[type='range']::-webkit-slider-thumb {
    @apply h-4 w-4 my-0.5 rounded-full appearance-none cursor-resize-width border-white bg-white;
}

input[type='range']::-moz-range-thumb {
    @apply h-4 w-4 my-0.5 rounded-full appearance-none cursor-resize-width border-white bg-white;
}

input[type='range']:disabled::-webkit-slider-thumb {
    @apply bg-ui-gray-700 cursor-not-allowed;
}

input[type='range']:disabled::-moz-range-thumb {
    @apply bg-ui-gray-700 cursor-not-allowed;
}
</style>
