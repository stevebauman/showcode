<template>
    <V-Popover
        :open="open"
        placement="top"
        @update:open="open = $event"
        boundaries-element="body"
        popover-inner-class="rounded-lg shadow-lg bg-ui-gray-700"
        class="flex items-center w-full h-full px-1 py-1 mx-1 bg-ui-gray-800 hover:bg-ui-gray-900 rounded-xl"
    >
        <slot name="trigger" />

        <template #popover>
            <div
                class="flex items-center justify-between p-2 border-b text-ui-gray-300 border-ui-gray-800"
            >
                <div class="pl-2 text-xs tracking-wide uppercase">Shadow Properties</div>

                <Button size="xs" @click.native="open = false">
                    <XIcon class="w-4 h-4" />
                </Button>
            </div>

            <slot name="popover" />
        </template>
    </V-Popover>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { XIcon, SettingsIcon } from 'vue-feather-icons';

export default {
    components: { XIcon, SettingsIcon },

    setup() {
        const open = ref(false);

        return { open };
    },
};
</script>
