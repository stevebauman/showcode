<template>
    <VDropdown
        :shown="open"
        :auto-hide="autoHide"
        placement="top"
        @update:shown="open = $event"
        :popperClass="'max-w-sm'"
    >
        <slot name="trigger" />

        <template #popper>
            <div class="border shadow-xl rounded-lg bg-ui-gray-700 border-ui-gray-800">
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
                            @click="$emit('reset')"
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
            </div>
        </template>
    </VDropdown>
</template>

<script>
import { ref } from 'vue';
import { Dropdown as VDropdown } from 'floating-vue';
import { XIcon, RefreshCwIcon, SettingsIcon } from 'lucide-vue-next';

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

    components: { VDropdown, XIcon, RefreshCwIcon, SettingsIcon },

    setup() {
        const open = ref(false);

        return { open };
    },
};
</script>
