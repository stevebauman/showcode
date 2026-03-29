<template>
    <div
        class="hidden flex-shrink-0 justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 md:flex"
    >
        <Button
            v-for="([x, y], index) in aspectRatios"
            size="sm"
            :key="index"
            variant="ghost"
            :disabled="lockWindowSize"
            class="w-16 justify-center rounded-none font-medium"
            :class="[
                index === 0 ? 'rounded-l-xl' : '',
                isEqual(aspectRatio, [x, y])
                    ? 'bg-zinc-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] dark:bg-zinc-800/80 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]'
                    : '',
            ]"
            @click="$emit('select', x, y)"
        >
            {{ x }}:{{ y }}
        </Button>

        <Button
            size="sm"
            variant="ghost"
            class="justify-center rounded-none rounded-r-xl"
            :class="
                aspectRatio === null
                    ? 'bg-zinc-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] dark:bg-zinc-800/80 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]'
                    : ''
            "
            @click="$emit('custom')"
        >
            Custom
        </Button>
    </div>
</template>

<script setup>
import { isEqual } from 'lodash';

defineProps({
    aspectRatio: { type: Array, required: false },
    aspectRatios: { type: Array, required: true },
    lockWindowSize: { type: Boolean, required: true },
});

defineEmits(['select', 'custom']);
</script>
