<template>
    <div class="ui-toggle inline-flex h-7 items-center gap-1.5">
        <Switch
            v-bind="$attrs"
            :model-value="modelValue"
            :disabled="disabled"
            @update:model-value="$emit('update:modelValue', $event)"
        />

        <PopoverSettings
            v-if="$slots.popover && modelValue"
            :title="popoverTitle"
            :tooltip="settingsTooltip"
            attached
            @reset="$emit('reset')"
        >
            <slot name="popover" />
        </PopoverSettings>
    </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

defineProps({
    modelValue: { type: Boolean, required: true },
    disabled: { type: Boolean, required: false, default: false },
    popoverTitle: { type: String, required: false },
    settingsTooltip: { type: String, required: false },
});

defineEmits(['update:modelValue', 'reset']);
</script>
