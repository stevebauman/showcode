<template>
    <div :class="{ 'flex items-center': $slots.popover && currentValue }">
        <button
            type="button"
            role="switch"
            :aria-checked="currentValue"
            class="relative inline-flex h-5 w-9 items-center rounded-full border-2 border-transparent focus:outline-none focus:ring-0"
            :class="currentValue ? 'bg-ui-violet-500' : 'bg-ui-gray-800'"
            @click="toggle"
        >
            <span
                class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-ui-gray-400 shadow transition-transform"
                :class="currentValue ? 'translate-x-4 text-ui-violet-500' : 'translate-x-0'"
            />
        </button>

        <PopoverSettings
            v-if="$slots.popover && currentValue"
            :title="popoverTitle"
            :tooltip="settingsTooltip"
            class="mx-1"
            @reset="$emit('reset')"
        >
            <slot name="popover" />
        </PopoverSettings>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: undefined,
    },
    value: {
        type: Boolean,
        default: undefined,
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

const emit = defineEmits(['update:modelValue', 'input', 'reset']);

const currentValue = computed(() => props.modelValue ?? props.value ?? false);

function toggle() {
    const value = !currentValue.value;

    emit('update:modelValue', value);
    emit('input', value);
}
</script>
