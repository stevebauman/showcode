<template>
    <PopoverPanel v-bind="$attrs">
        <template #trigger>
            <ButtonSettings
                v-tooltip="tooltip"
                variant="ghost"
                class="flex items-center h-auto p-1 rounded-full"
            />
        </template>

        <slot />
    </PopoverPanel>
</template>



<script setup>
defineProps({ tooltip: { type: String, required: false } });
</script>
