<template>
    <V-Popover
        :open="open"
        :auto-hide="autoHide"
        placement="top"
        @update:open="open = $event"
        boundaries-element="body"
        popover-base-class="max-w-sm tooltip popover "
        popover-inner-class="border rounded-lg shadow-xl bg-ui-gray-700 border-ui-gray-800 highlight"
    >
        <slot name="trigger" />

        <template #popover>
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
                        @click.native="$emit('reset')"
                    >
                        <RefreshCwIcon class="w-4 h-4" />
                    </Button>

                    <Button
                        v-if="closes"
                        size="xs"
                        v-tooltip="'Close'"
                        dusk="button-close-popover"
                        @click.native="open = false"
                    >
                        <XIcon class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <slot />
        </template>
    </V-Popover>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { XIcon, RefreshCwIcon, SettingsIcon } from 'vue-feather-icons';

export default {
    props: {
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
    },

    components: { XIcon, RefreshCwIcon, SettingsIcon },

    setup() {
        const open = ref(false);

        return { open };
    },
};
</script>
