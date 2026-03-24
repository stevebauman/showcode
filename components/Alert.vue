<template>
    <div
        class="relative flex items-center p-4 border-2 rounded-xl shadow-lg"
        :class="variantClasses.wrapper"
    >
        <div class="flex-grow" :class="variantClasses.body">
            <slot>{{ message }}</slot>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    variant: String,
    message: String,
});

const variants = {
    default: {
        wrapper: 'bg-blue-50 border-blue-500',
        body: 'text-blue-700',
    },
    danger: {
        wrapper: 'bg-red-50 border-red-500',
        body: 'text-red-700',
    },
    success: {
        wrapper: 'bg-green-50 border-green-500',
        body: 'text-green-700',
    },
};

const variantClasses = computed(() => variants[props.variant] ?? variants.default);
</script>
