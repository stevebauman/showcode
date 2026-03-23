<template>
    <input
        type="range"
        :value="currentValue"
        class="highlight w-full appearance-none rounded-xl bg-ui-gray-800 transition-all hover:bg-ui-violet-500"
        @input="updateValue($event.target.value)"
    />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
    value: [String, Number],
});

const emit = defineEmits(['update:modelValue', 'input']);

const currentValue = computed(() => props.modelValue ?? props.value ?? 0);

function updateValue(value) {
    emit('input', value);
    emit('update:modelValue', value);
}
</script>

<style scoped>
input[type='range']::-webkit-slider-runnable-track {
    @apply h-5 rounded-full bg-ui-gray-800 px-0.5 transition hover:bg-ui-violet-500;
}

input[type='range']::-webkit-slider-thumb {
    @apply my-0.5 size-4 cursor-resize-width appearance-none rounded-full border-white bg-white shadow;
}

input[type='range']::-moz-range-thumb {
    @apply my-0.5 size-4 cursor-resize-width appearance-none rounded-full border-white bg-white;
}

input[type='range']:disabled::-webkit-slider-thumb {
    @apply cursor-not-allowed bg-ui-gray-700;
}

input[type='range']:disabled::-moz-range-thumb {
    @apply cursor-not-allowed bg-ui-gray-700;
}
</style>
