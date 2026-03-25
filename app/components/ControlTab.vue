<template>
    <button
        :class="{
            'text-zinc-900 dark:text-zinc-100 bg-zinc-200/80 dark:bg-zinc-700/80 shadow-sm': active,
            'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50':
                !active,
        }"
        class="flex items-center justify-center h-8 gap-1.5 px-3 text-xs font-medium leading-none tracking-wide rounded-lg transition-all"
    >
        <slot />
    </button>
</template>

<script setup>
defineProps({ active: { type: Boolean, default: false } });
</script>
