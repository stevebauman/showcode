<template>
    <button
        :class="{
            'bg-zinc-200/80 text-zinc-900 shadow-xs dark:bg-zinc-700/80 dark:text-zinc-100': active,
            'cursor-not-allowed text-zinc-300 dark:text-zinc-600': disabled,
            'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300':
                !active && !disabled,
        }"
        :disabled="disabled"
        class="flex h-8 items-center justify-center gap-1.5 rounded px-3 text-xs leading-none font-medium tracking-wide transition-all"
    >
        <slot />
    </button>
</template>

<script setup>
defineProps({
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});
</script>
