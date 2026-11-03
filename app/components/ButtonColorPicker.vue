<template>
    <ColorPicker
        :value="modelValue"
        @change="$emit('change', $event)"
        class="color-picker-trigger flex justify-center"
        #default="{ solid }"
    >
        <Button
            v-bind="$attrs"
            variant="outline"
            class="tooltip-target border-ui-line bg-ui-field text-ui-text hover:bg-ui-hover h-7 w-full gap-1.5 shadow-none"
        >
            <span
                class="size-4 rounded-full ring-1 ring-black/10 dark:ring-white/10"
                :style="{ backgroundColor: solid }"
            />

            <span class="truncate font-mono text-[11px]">
                {{ chroma(solid).hex().toUpperCase() }}
            </span>
        </Button>
    </ColorPicker>
</template>

<script setup>
import chroma from 'chroma-js';

defineOptions({ inheritAttrs: false });

defineProps({
    modelValue: { type: Object, default: null },
});

defineEmits(['change']);
</script>
