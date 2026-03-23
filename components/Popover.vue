<template>
    <VDropdown
        placement="top"
        :auto-hide="autoHide"
        :distance="8"
        theme="dropdown"
        popper-class="max-w-sm tooltip popover"
    >
        <slot name="trigger" />

        <template #popper="{ hide }">
            <div class="overflow-hidden rounded-lg border border-ui-gray-800 bg-ui-gray-700 shadow-xl">
                <div
                    class="flex items-center justify-between gap-2 border-b border-ui-gray-800 p-2 text-ui-gray-300"
                >
                    <div class="pl-2 text-xs uppercase tracking-wide">{{ title }}</div>

                    <div class="flex items-center gap-1">
                        <Button
                            v-if="resets"
                            size="xs"
                            dusk="button-reset-popover"
                            v-tooltip="'Reset'"
                            @click="
                                $emit('reset');
                                if (autoHide) hide();
                            "
                        >
                            <RefreshCwIcon class="w-4 h-4" />
                        </Button>

                        <Button
                            v-if="closes"
                            size="xs"
                            dusk="button-close-popover"
                            v-tooltip="'Close'"
                            @click="hide()"
                        >
                            <XIcon class="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <slot />
            </div>
        </template>
    </VDropdown>
</template>

<script setup>
import { RefreshCwIcon, XIcon } from '@/utils/icons';

defineEmits(['reset']);

defineProps({
    title: {
        type: String,
        default: null,
    },
    autoHide: {
        type: Boolean,
        default: false,
    },
    resets: {
        type: Boolean,
        default: true,
    },
    closes: {
        type: Boolean,
        default: true,
    },
});
</script>
