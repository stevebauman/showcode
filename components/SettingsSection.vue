<template>
    <div>
        <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
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

