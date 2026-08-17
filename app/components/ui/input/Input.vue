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
                'rounded-control flex h-7 w-full border border-zinc-200/80 bg-zinc-100/80 px-2 py-1 text-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-zinc-950 placeholder:text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/5 dark:bg-white/5 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:hover:bg-white/[0.07]',
                formControlFocusClasses,
                props.class
            )
        "
    />
</template>
