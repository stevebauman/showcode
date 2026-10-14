<template>
    <div class="hidden justify-center md:flex">
        <CanvasControlSurface class="flex items-center justify-center gap-1 p-0.5">
            <div class="flex items-center">
                <div class="px-1.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">W</div>

                <Input
                    aria-label="Canvas width"
                    type="number"
                    min="1"
                    max="5000"
                    class="h-6 w-14 appearance-none border-0 px-1 text-center shadow-none"
                    :model-value="width"
                    :disabled="lockWindowSize"
                    @update:model-value="$emit('update:width', $event)"
                />
            </div>

            <div><XIcon class="size-2.5 text-zinc-300 dark:text-zinc-600" /></div>

            <div class="flex items-center">
                <Input
                    aria-label="Canvas height"
                    type="number"
                    min="1"
                    max="5000"
                    class="h-6 w-14 appearance-none border-0 px-1 text-center shadow-none"
                    :model-value="height"
                    :disabled="lockWindowSize"
                    @update:model-value="$emit('update:height', $event)"
                />

                <div class="px-1.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">H</div>
            </div>
        </CanvasControlSurface>
    </div>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next';

defineProps({
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    lockWindowSize: { type: Boolean, required: true },
});

defineEmits(['update:width', 'update:height']);
</script>
