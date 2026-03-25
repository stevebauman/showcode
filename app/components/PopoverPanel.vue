<template>
    <UiPopover v-model:open="open">
        <PopoverTrigger as-child>
            <slot name="trigger" />
        </PopoverTrigger>

        <PopoverContent
            side="top"
            class="w-auto max-w-sm p-0"
            @interact-outside="autoHide ? (open = false) : undefined"
        >
            <div
                class="flex items-center justify-between gap-2 border-b border-zinc-200 p-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
            >
                <div class="pl-2 text-xs uppercase tracking-wide">{{ title }}</div>

                <div class="flex items-center gap-1">
                    <Button
                        v-if="resets"
                        size="sm"
                        variant="ghost"
                        v-tooltip="'Reset'"
                        @click="$emit('reset')"
                    >
                        <RefreshCwIcon class="h-4 w-4" />
                    </Button>

                    <Button
                        v-if="closes"
                        size="sm"
                        variant="ghost"
                        v-tooltip="'Close'"
                        @click="open = false"
                    >
                        <XIcon class="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <slot />
        </PopoverContent>
    </UiPopover>
</template>

<script setup>
import { ref } from 'vue';
import { Popover as UiPopover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { XIcon, RefreshCwIcon } from 'lucide-vue-next';

defineProps({
    title: { type: String },
    autoHide: { type: Boolean, default: false },
    resets: { type: Boolean, default: true },
    closes: { type: Boolean, default: true },
});

defineEmits(['reset']);

const open = ref(false);
</script>
