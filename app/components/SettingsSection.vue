<template>
    <div>
        <h3 class="text-ui-muted mb-2 text-sm font-medium">
            {{ title }}
        </h3>

        <div class="divide-ui-line divide-y">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({ title: String });
</script>
