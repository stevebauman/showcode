<template>
    <button
        :class="{
            'text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-900 bg-opacity-60': active,
            'text-zinc-400 dark:text-zinc-500 bg-zinc-200 dark:bg-zinc-950 bg-opacity-60 hover:bg-white dark:hover:bg-black hover:text-zinc-800 dark:hover:text-zinc-400':
                !active,
        }"
        class="flex items-center justify-center h-8 gap-2 px-2 text-xs font-semibold leading-none tracking-widest uppercase"
    >
        <Dot v-if="active" class="hidden md:block" /> <slot />
    </button>
</template>

<script setup>
defineProps({ active: { type: Boolean, default: false } });
</script>
