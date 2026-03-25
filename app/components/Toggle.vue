<template>
    <div
        :class="{
            'flex items-center': $slots.popover && modelValue,
        }"
    >
        <Switch
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
        />

        <PopoverSettings
            v-if="$slots.popover && modelValue"
            :title="popoverTitle"
            :tooltip="settingsTooltip"
            @reset="$emit('reset')"
            class="mx-1"
        >
            <slot name="popover" />
        </PopoverSettings>
    </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

defineProps({
    modelValue: { type: Boolean, required: true },
    popoverTitle: { type: String, required: false },
    settingsTooltip: { type: String, required: false },
});

defineEmits(['update:modelValue', 'reset']);
</script>
