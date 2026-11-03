<template>
    <div
        class="flex flex-col items-stretch justify-between gap-2 px-3 py-2.5 sm:flex-row sm:items-center"
    >
        <div class="flex flex-col gap-0.5">
            <span class="text-ui-text text-xs font-medium">{{ label }}</span>
            <span v-if="description" class="text-[10px] text-zinc-400 dark:text-zinc-500">
                {{ description }}
            </span>
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
