<template>
    <div
        :class="{
            'inline-flex h-6 items-center gap-0.5 rounded-full border border-zinc-200/80 bg-zinc-100/80 p-0.5 shadow-xs dark:border-white/5 dark:bg-white/5':
                $slots.popover && modelValue,
        }"
    >
        <Switch
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
