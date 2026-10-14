<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
    class: { type: null, default: null },
});
</script>

<template>
    <div
        :class="
            cn(
                'rounded-surface h-7 border border-zinc-200/80 bg-white/90 text-zinc-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300',
                props.class
            )
        "
    >
        <slot />
    </div>
</template>
