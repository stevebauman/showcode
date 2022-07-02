<template>
    <div
        :class="{
            'flex items-center px-1 bg-ui-gray-800 hover:bg-ui-gray-900 rounded-xl':
                $slots.settings && localValue,
        }"
    >
        <TToggle
            @input="$emit('input', $event)"
            v-model="localValue"
            v-on="$listeners"
            v-bind="$attrs"
            :classes="{
                wrapper:
                    'bg-ui-gray-800 rounded-full border-2 border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-ui-gray-700 focus:ring-ui-focus focus:outline-none',
                wrapperChecked:
                    'bg-ui-violet-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-ui-gray-700 focus:ring-ui-focus focus:outline-none',
                wrapperDisabled:
                    'bg-ui-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-ui-gray-700 focus:ring-ui-focus focus:outline-none',
                wrapperCheckedDisabled:
                    'bg-ui-violet-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-ui-gray-700 focus:ring-ui-focus focus:outline-none',
                button: 'h-4 w-4 rounded-full bg-white shadow flex items-center justify-center text-ui-gray-400 text-xs',
                buttonChecked:
                    'h-4 w-4 rounded-full bg-white shadow flex items-center justify-center text-ui-violet-500 text-xs transform translate-x-full',
                checkedPlaceholder:
                    'rounded-full w-4 h-4 flex items-center justify-center text-ui-gray-400 text-xs',
                uncheckedPlaceholder:
                    'rounded-full w-4 h-4 flex items-center justify-center text-ui-gray-400 text-xs',
            }"
        />

        <V-Popover
            :open="open"
            :auto-hide="false"
            v-if="$slots.settings && localValue"
            placement="top"
            @update:open="open = $event"
            boundaries-element="body"
            class="flex items-center w-full h-full py-1 mx-1"
            popover-inner-class="rounded-lg shadow-lg bg-ui-gray-700"
        >
            <button type="button" class="flex items-center h-full text-ui-gray-300">
                <SettingsIcon class="w-4 h-4" />
            </button>

            <template #popover>
                <div
                    class="flex items-center justify-between p-2 border-b text-ui-gray-300 border-ui-gray-800"
                >
                    <div class="text-xs tracking-wide uppercase">Shadow Properties</div>

                    <button @click="open = false">
                        <XIcon class="w-4 h-4" />
                    </button>
                </div>

                <slot name="settings" />
            </template>
        </V-Popover>
    </div>
</template>

<script>
import { XIcon, SettingsIcon } from 'vue-feather-icons';
import { ref, toRefs, watch } from '@nuxtjs/composition-api';

export default {
    inheritAttrs: false,

    props: { value: Boolean },

    components: { XIcon, SettingsIcon },

    setup(props) {
        const open = ref(false);
        const { value } = toRefs(props);

        const localValue = ref(value.value);

        watch(value, (value) => (localValue.value = value));

        return { open, localValue };
    },
};
</script>
