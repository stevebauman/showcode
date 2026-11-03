<template>
    <div class="grid grid-cols-2 gap-2">
        <div class="relative min-w-0">
            <Label
                :for="`${id}-width`"
                class="text-ui-muted absolute inset-y-0 left-2 z-10 flex items-center text-[11px]"
            >
                W
            </Label>
            <Input
                :id="`${id}-width`"
                aria-label="Canvas width"
                type="number"
                min="1"
                max="5000"
                class="h-8 pl-7 tabular-nums"
                :model-value="width"
                :disabled="lockWindowSize"
                @update:model-value="$emit('update:width', $event)"
            />
        </div>
        <div class="relative min-w-0">
            <Label
                :for="`${id}-height`"
                class="text-ui-muted absolute inset-y-0 left-2 z-10 flex items-center text-[11px]"
            >
                H
            </Label>
            <Input
                :id="`${id}-height`"
                aria-label="Canvas height"
                type="number"
                min="1"
                max="5000"
                class="h-8 pl-7 tabular-nums"
                :model-value="height"
                :disabled="lockWindowSize"
                @update:model-value="$emit('update:height', $event)"
            />
        </div>
    </div>
</template>

<script setup>
import { useId } from 'vue';

defineProps({
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    lockWindowSize: { type: Boolean, required: true },
});

defineEmits(['update:width', 'update:height']);

const id = useId();
</script>
