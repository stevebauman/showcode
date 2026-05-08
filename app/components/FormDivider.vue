<template>
    <div
        class="overflow-hidden rounded-sm bg-zinc-200 py-1 text-center text-xs font-semibold uppercase tracking-widest text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
    >
        {{ title }}
    </div>
</template>

<script setup>
defineProps({ title: String });
</script>
