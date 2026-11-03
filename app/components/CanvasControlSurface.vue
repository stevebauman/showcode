<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
    class: { type: null, default: null },
});
</script>

<template>
    <div
        :class="
            cn('rounded-control border-ui-line bg-ui-field text-ui-text h-7 border', props.class)
        "
    >
        <slot />
    </div>
</template>
