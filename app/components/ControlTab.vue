<template>
    <button
        type="button"
        role="tab"
        :aria-selected="active"
        :class="{
            'bg-ui-selected text-ui-text': active,
            'cursor-not-allowed text-zinc-300 dark:text-zinc-600': disabled,
            'text-ui-muted hover:bg-zinc-100/80 hover:text-zinc-800 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200':
                !active && !disabled,
        }"
        :disabled="disabled"
        class="flex h-7 items-center justify-center gap-1 rounded-full px-1 text-[11px] leading-none font-medium transition-colors focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-hidden dark:focus-visible:ring-zinc-600"
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
