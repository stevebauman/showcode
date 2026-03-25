<template>
    <div
        class="overflow-hidden text-xs font-semibold tracking-widest text-center uppercase text-zinc-800 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-950 rounded py-1"
    >
        {{ title }}
    </div>
</template>

<script setup>
defineProps({ title: String });
</script>
