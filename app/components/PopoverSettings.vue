<template>
    <PopoverPanel v-bind="$attrs">
        <template #trigger>
            <ButtonSettings
                v-tooltip="tooltip"
                variant="ghost"
                class="flex h-auto items-center rounded-full p-1"
            />
        </template>

        <slot />
    </PopoverPanel>
</template>

<script setup>
defineProps({ tooltip: { type: String, required: false } });
</script>
