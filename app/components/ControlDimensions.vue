<template>
    <div class="hidden justify-center md:flex">
        <div
            class="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/80 py-0.5 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
        >
            <div class="flex items-center">
                <div class="px-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500">W</div>

                <Input
                    type="number"
                    min="1"
                    max="5000"
                    class="w-14 appearance-none text-center"
                    :model-value="width"
                    :disabled="lockWindowSize"
                    @update:model-value="$emit('update:width', $event)"
                />
            </div>

            <div><XIcon class="h-3 w-3 text-zinc-400 dark:text-zinc-500" /></div>

            <div class="flex items-center">
                <Input
                    type="number"
                    min="1"
                    max="5000"
                    class="w-14 appearance-none text-center"
                    :model-value="height"
                    :disabled="lockWindowSize"
                    @update:model-value="$emit('update:height', $event)"
                />

                <div class="px-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500">H</div>
            </div>
        </div>
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
