<template>
    <PopoverPanel v-bind="$attrs">
        <template #trigger>
            <ButtonSettings
                v-tooltip="tooltip"
                :aria-label="tooltip || 'Configure'"
                size="icon-sm"
                variant="ghost"
                :class="
                    cn(
                        'text-zinc-400 hover:bg-zinc-200/70 hover:text-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0 dark:text-zinc-500 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-600',
                        attached && 'size-5'
                    )
                "
            />
        </template>

        <slot />
    </PopoverPanel>
</template>

<script setup>
import { cn } from '@/lib/utils';

defineProps({
    tooltip: { type: String, required: false },
    attached: { type: Boolean, default: false },
});
</script>
