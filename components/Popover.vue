<template>
    <Dropdown
        :shown="open"
        :auto-hide="autoHide"
        placement="top"
        @update:shown="open = $event"
        popover-class="max-w-sm tooltip popover"
        popover-inner-class="border shadow-xl rounded-lg bg-ui-gray-700 border-ui-gray-800 border border-ui-gray-800"
    >
        <slot name="trigger" />

        <template #popper>
            <div
                class="flex items-center justify-between gap-2 p-2 border-b text-ui-gray-300 border-ui-gray-800"
            >
                <div class="pl-2 text-xs tracking-wide uppercase">{{ title }}</div>

                <div class="flex items-center gap-1">
                    <Button
                        v-if="resets"
                        size="xs"
                        v-tooltip="'Reset'"
                        dusk="button-reset-popover"
                        @click="emit('reset')"
                    >
                        <RefreshCwIcon class="w-4 h-4" />
                    </Button>

                    <Button
                        v-if="closes"
                        size="xs"
                        v-tooltip="'Close'"
                        dusk="button-close-popover"
                        @click="open = false"
                    >
                        <XIcon class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <slot />
        </template>
    </Dropdown>
</template>

<script setup>
import { ref } from 'vue';
import { Dropdown } from 'floating-vue';
import { X as XIcon, RefreshCw as RefreshCwIcon } from 'lucide-vue-next';

const emit = defineEmits(['reset']);

defineProps({
    title: {
        type: String,
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

const open = ref(false);
</script>
