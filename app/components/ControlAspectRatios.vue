<template>
    <CanvasControlSurface
        v-if="aspectRatios.length"
        class="hidden shrink-0 justify-center overflow-hidden md:flex"
    >
        <Button
            v-for="([x, y], index) in aspectRatios"
            :key="index"
            :aria-pressed="isEqual(aspectRatio, [x, y])"
            variant="ghost"
            :disabled="lockWindowSize"
            class="h-full w-14 justify-center rounded-none border-r border-zinc-200/80 px-2 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 dark:border-white/5 dark:text-zinc-400 dark:hover:bg-white/[0.07] dark:hover:text-zinc-100"
            :class="[
                isEqual(aspectRatio, [x, y])
                    ? 'bg-zinc-100 text-zinc-900 shadow-inner dark:bg-white/10 dark:text-zinc-100'
                    : '',
            ]"
            @click="$emit('select', x, y)"
        >
            {{ x }}:{{ y }}
        </Button>

        <Button
            :aria-pressed="aspectRatio === null"
            variant="ghost"
            class="h-full justify-center rounded-none px-2.5 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.07] dark:hover:text-zinc-100"
            :class="
                aspectRatio === null
                    ? 'bg-zinc-100 text-zinc-900 shadow-inner dark:bg-white/10 dark:text-zinc-100'
                    : ''
            "
            @click="$emit('custom')"
        >
            Custom
        </Button>
    </CanvasControlSurface>
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
