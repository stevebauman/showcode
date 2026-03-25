<template>
    <div>
        <h3 class="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {{ title }}
        </h3>

        <div
            class="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900"
        >
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({ title: String });
</script>
