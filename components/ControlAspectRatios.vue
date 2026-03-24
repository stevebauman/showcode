<template>
    <div class="justify-center flex-shrink-0 hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg overflow-hidden md:flex">
        <Button
            v-for="([x, y], index) in aspectRatios"
            size="sm"
            :key="index"
            variant="secondary"
            :disabled="lockWindowSize"
            class="justify-center w-16 font-medium rounded-none"
            :class="[index === 0 ? 'rounded-l-xl' : '', isEqual(aspectRatio, [x, y]) ? 'bg-zinc-300 dark:bg-zinc-900' : '']"
            @click="$emit('select', x, y)"
        >
            {{ x }}:{{ y }}
        </Button>

        <Button
            size="sm"
            variant="secondary"
            class="justify-center rounded-none rounded-r-xl"
            :class="aspectRatio === null ? 'bg-zinc-300 dark:bg-zinc-900' : ''"
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
