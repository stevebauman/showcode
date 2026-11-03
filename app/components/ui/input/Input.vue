<script setup>
import { useVModel } from '@vueuse/core';
import { cn, formControlFocusClasses } from '@/lib/utils';

const props = defineProps({
    defaultValue: { type: [String, Number], required: false },
    modelValue: { type: [String, Number], required: false },
    class: { type: null, required: false },
});

const emits = defineEmits(['update:modelValue']);

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
});
</script>

<template>
    <input
        v-model="modelValue"
        :class="
            cn(
                'ui-field rounded-control placeholder:text-ui-muted flex h-7 w-full border px-2 py-1 text-xs file:border-0 file:bg-transparent file:text-xs file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
                formControlFocusClasses,
                props.class
            )
        "
    />
</template>
