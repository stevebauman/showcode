<script setup>
import { Toaster as Sonner } from 'vue-sonner';

const props = defineProps({
    position: { type: String, default: 'bottom-right' },
    duration: { type: Number, default: 4000 },
    richColors: { type: Boolean, default: true },
});
</script>

<template>
    <Sonner
        :position="props.position"
        :duration="props.duration"
        :rich-colors="props.richColors"
        class="toaster group"
        :toast-options="{
            style: {
                background: 'var(--ui-popup-surface)',
                backdropFilter: 'var(--ui-popup-filter)',
                WebkitBackdropFilter: 'var(--ui-popup-filter)',
            },
            classes: {
                toast: 'group toast group-[.toaster]:text-ui-text group-[.toaster]:border-ui-line group-[.toaster]:shadow-lg',
                description: 'group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400',
                actionButton:
                    'group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 dark:group-[.toast]:bg-zinc-50 dark:group-[.toast]:text-zinc-900',
                cancelButton:
                    'group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400',
            },
        }"
    />
</template>
