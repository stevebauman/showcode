<template>
    <div
        class="relative flex items-center rounded-xl border-2 p-4 shadow-lg"
        :class="variants[variant] ?? variants.info"
    >
        <div class="flex-grow">
            <slot>{{ message }}</slot>
        </div>

        <button
            type="button"
            class="close-alert relative ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-xl transition duration-100 ease-in-out"
            :class="closeVariants[variant] ?? closeVariants.info"
            @click="$emit('hidden')"
        >
            <XIcon class="h-4 w-4" />
        </button>
    </div>
</template>

<script setup>
import { XIcon } from '@/utils/icons';

defineEmits(['hidden']);

defineProps({
    variant: {
        type: String,
        default: 'info',
    },
    message: String,
});

const variants = {
    info: 'border-blue-500 bg-blue-50 text-blue-700',
    danger: 'border-red-500 bg-red-50 text-red-700',
    success: 'border-green-500 bg-green-50 text-green-700',
};

const closeVariants = {
    info: 'text-blue-500 hover:bg-blue-200',
    danger: 'text-red-500 hover:bg-red-200',
    success: 'text-green-500 hover:bg-green-200',
};
</script>
