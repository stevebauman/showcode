<template>
    <button
        :class="{
            'bg-zinc-200/80 text-zinc-900 shadow-sm dark:bg-zinc-700/80 dark:text-zinc-100': active,
            'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300':
                !active,
        }"
        class="flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium leading-none tracking-wide transition-all"
    >
        <slot />
    </button>
</template>

<script setup>
defineProps({ active: { type: Boolean, default: false } });
</script>
