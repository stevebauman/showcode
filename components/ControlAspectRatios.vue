<template>
    <div class="justify-center flex-shrink-0 hidden rounded-lg shadow md:flex">
        <Button
            v-for="([x, y], index) in aspectRatios"
            size="sm"
            :key="index"
            variant="secondary"
            :disabled="lockWindowSize"
            class="justify-center w-16 font-medium rounded-none"
            :class="[index === 0 ? 'rounded-l-lg' : '', isEqual(aspectRatio, [x, y]) ? 'bg-zinc-900 dark:bg-zinc-900' : '']"
            @click="$emit('select', x, y)"
        >
            {{ x }}:{{ y }}
        </Button>

        <Button
            size="sm"
            variant="secondary"
            class="justify-center rounded-none rounded-r-lg"
            :class="aspectRatio === null ? 'bg-zinc-900 dark:bg-zinc-900' : ''"
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
