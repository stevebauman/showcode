<template>
    <V-Popover
        :open="open"
        :auto-hide="false"
        placement="top"
        @update:open="open = $event"
        boundaries-element="body"
        popover-inner-class="border-2 rounded-lg shadow-xl bg-ui-gray-700 border-ui-gray-800"
        class="flex items-center w-full h-full px-1 py-1 mx-1 bg-ui-gray-800 hover:bg-ui-gray-900 rounded-xl"
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
                        @click.native="$emit('reset')"
                    >
                        <RefreshCwIcon class="w-4 h-4" />
                    </Button>

                    <Button
                        v-if="closes"
                        size="xs"
                        v-tooltip="'Close'"
                        @click.native="open = false"
                    >
                        <XIcon class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <slot name="popover" />
        </template>
    </V-Popover>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { XIcon, RefreshCwIcon, SettingsIcon } from 'vue-feather-icons';

export default {
    props: {
        title: String,
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
