<template>
    <input
        :value="modelValue"
        :class="[sizes[size]]"
        :type="$attrs.type || 'text'"
        @input="$emit('update:modelValue', $event.target.value)"
        class="highlight rounded-lg text-ui-gray-400 disabled:cursor-not-allowed disabled:bg-ui-gray-900 bg-ui-gray-800 hover:bg-ui-gray-900 focus:outline-none focus:ring-0"
    />
</template>

<script setup>
defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    size: {
        type: String,
        default: 'base',
    },
});

defineEmits(['update:modelValue']);

const sizes = {
    xs: 'text-xs px-2.5 py-0.5',
    sm: 'text-sm px-3 py-1',
    base: 'text-sm px-4 py-2',
    lg: 'text-base font-semibold px-4 py-3',
};
</script>
