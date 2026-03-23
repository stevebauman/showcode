<template>
    <input
        :value="currentValue"
        :class="[sizes[size]]"
        :type="$attrs.type || 'text'"
        class="highlight rounded-lg bg-ui-gray-800 text-ui-gray-400 hover:bg-ui-gray-900 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-ui-gray-900"
        @input="updateValue($event.target.value)"
    />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: undefined,
    },
    value: {
        type: [String, Number],
        default: '',
    },
    size: {
        type: String,
        default: 'base',
    },
});

const emit = defineEmits(['update:modelValue', 'input']);

const sizes = {
    xs: 'px-2.5 py-0.5 text-xs',
    sm: 'px-3 py-1 text-sm',
    base: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base font-semibold',
};

const currentValue = computed(() => props.modelValue ?? props.value ?? '');

function updateValue(value) {
    emit('input', value);
    emit('update:modelValue', value);
}
</script>
