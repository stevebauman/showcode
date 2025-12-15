<template>
    <div
        :class="{
            'flex items-center': $slots.popover && modelValue,
        }"
    >
        <Switch
            :checked="modelValue"
            @update:checked="$emit('update:modelValue', $event)"
            v-bind="$attrs"
            class="h-5 w-9 data-[state=checked]:bg-ui-violet-500 data-[state=unchecked]:bg-ui-gray-800"
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
import { Switch } from '@/components/ui/switch';

defineOptions({
    inheritAttrs: false,
});

defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    popoverTitle: {
        type: String,
        required: false,
    },
    settingsTooltip: {
        type: String,
        required: false,
    },
});

defineEmits(['update:modelValue', 'reset']);
</script>
