<template>
    <Popover v-bind="$attrs">
        <template #trigger>
            <ButtonSettings
                v-tooltip="tooltip"
                size="none"
                :rounded="false"
                class="flex items-center p-1 rounded-full"
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
defineProps({
    tooltip: {
        type: String,
        required: false,
    },
});
</script>
