<template>
    <button
        type="button"
        role="tab"
        :aria-selected="active"
        :class="{
            'bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-zinc-100': active,
            'cursor-not-allowed text-zinc-300 dark:text-zinc-600': disabled,
            'text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200':
                !active && !disabled,
        }"
        :disabled="disabled"
        class="rounded-control flex h-7 items-center justify-center gap-1.5 px-2.5 text-[11px] leading-none font-medium transition-colors focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-hidden dark:focus-visible:ring-zinc-600"
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
