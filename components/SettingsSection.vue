<template>
    <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            {{ title }}
        </h3>

        <div class="rounded-lg border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({ title: String });
</script>

