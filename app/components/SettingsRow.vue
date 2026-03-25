<template>
    <div class="flex items-center justify-between px-3 py-2.5">
        <div class="flex flex-col gap-0.5">
            <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">{{ label }}</span>
            <span v-if="description" class="text-[10px] text-zinc-400 dark:text-zinc-500">{{ description }}</span>
        </div>

        <slot />
    </div>
</template>

<script setup>
defineProps({
    label: String,
    description: { type: String, default: null },
});
</script>

