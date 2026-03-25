<template>
    <button
        :class="buttonClasses"
        :title="tooltip"
        v-tooltip.bottom="tooltip"
        @click="$emit('click')"
        class="flex items-center justify-center size-12 rounded-full transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2"
    >
        <component :is="icon" :class="iconClasses" />
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    variant: {
        type: String,
        required: true,
        validator: (value) =>
            ['use', 'default', 'default-active', 'delete', 'save', 'rename'].includes(value),
    },
    icon: { type: [String, Object], required: true },
    tooltip: { type: String, required: true },
});

defineEmits(['click']);

const buttonClasses = computed(() => {
    const baseClasses = 'bg-zinc-50 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200';

    const variants = {
        use: `${baseClasses} hover:bg-blue-500 hover:text-white focus:ring-blue-400`,
        default: `${baseClasses} hover:bg-yellow-500 hover:text-white focus:ring-yellow-400`,
        'default-active':
            'bg-yellow-500 text-white hover:bg-zinc-50 dark:hover:bg-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-200 focus:ring-yellow-400',
        delete: `${baseClasses} hover:bg-red-500 hover:text-white focus:ring-red-400`,
        save: `${baseClasses} hover:bg-green-500 hover:text-white focus:ring-green-400`,
        rename: `${baseClasses} hover:bg-purple-500 hover:text-white focus:ring-purple-400`,
    };

    return variants[props.variant];
});

const iconClasses = computed(() =>
    props.variant === 'default-active' ? 'w-6 h-6 fill-current' : 'w-6 h-6'
);
</script>
