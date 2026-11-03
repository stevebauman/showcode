<template>
    <UiPopover v-model:open="open">
        <PopoverTrigger as-child>
            <slot name="trigger" />
        </PopoverTrigger>

        <PopoverContent
            side="top"
            align="end"
            :side-offset="8"
            :collision-padding="8"
            prioritize-position
            sticky="always"
            class="max-h-[var(--reka-popover-content-available-height)] w-66 max-w-[calc(100vw-2rem)] overflow-x-hidden overflow-y-auto p-0"
            @interact-outside="autoHide ? (open = false) : undefined"
            @pointer-down-outside="onDismissOutside"
            @focus-outside="onDismissOutside"
        >
            <div>
                <div class="text-ui-muted flex items-center justify-between gap-2 pt-2 pr-2 pl-3">
                    <div class="text-xs font-normal">
                        {{ title }}
                    </div>

                    <div class="flex items-center gap-1">
                        <Button
                            v-if="resets"
                            aria-label="Reset"
                            size="icon-sm"
                            variant="ghost"
                            class="text-zinc-400 hover:bg-zinc-200/70 hover:text-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0 dark:text-zinc-500 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-600"
                            v-tooltip="tooltipsReady ? 'Reset' : undefined"
                            @click="$emit('reset')"
                        >
                            <RefreshCwIcon class="!size-3.5" />
                        </Button>

                        <Button
                            v-if="closes"
                            aria-label="Close"
                            size="icon-sm"
                            variant="ghost"
                            class="text-zinc-400 hover:bg-zinc-200/70 hover:text-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0 dark:text-zinc-500 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-600"
                            v-tooltip="tooltipsReady ? 'Close' : undefined"
                            @click="open = false"
                        >
                            <XIcon class="!size-3.5" />
                        </Button>
                    </div>
                </div>

                <slot />
            </div>
        </PopoverContent>
    </UiPopover>
</template>

<script setup>
import { ref, watch } from 'vue';
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
const tooltipsReady = ref(false);

watch(open, (isOpen) => {
    tooltipsReady.value = false;

    if (isOpen) {
        setTimeout(() => (tooltipsReady.value = true), 400);
    }
});

function onDismissOutside(event) {
    // Prevent the popover from closing when interacting
    // with a nested floating-vue dropdown (e.g. color picker).
    const target = event.detail?.originalEvent?.target ?? event.target;

    if (target?.closest?.('.v-popper__popper')) {
        event.preventDefault();
    }
}
</script>
