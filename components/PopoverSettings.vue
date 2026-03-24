<template>
    <Popover v-bind="$attrs">
        <template #trigger>
            <ButtonSettings
                v-tooltip="tooltip"
                variant="ghost"
                class="flex items-center h-auto p-1 rounded-full"
            />
        </template>

        <slot />
    </Popover>
</template>

<style>
.v-popover .trigger {
    display: flex !important;
}
</style>

<script setup>
defineProps({ tooltip: { type: String, required: false } });
</script>
