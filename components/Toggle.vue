<template>
    <div
        :class="{
            'flex items-center ': $slots.popover && localValue,
        }"
    >
        <TToggle
            @input="$emit('input', $event)"
            v-model="localValue"
            v-on="$listeners"
            v-bind="$attrs"
            :classes="{
                wrapper:
                    'bg-ui-gray-800 rounded-full border-2 border-transparent focus:outline-none focus:ring-0',
                wrapperChecked:
                    'bg-ui-violet-500 rounded-full border-2 border-transparent focus:outline-none focus:ring-0',
                wrapperDisabled:
                    'bg-ui-gray-100 rounded-full border-2 border-transparent focus:outline-none focus:ring-0',
                wrapperCheckedDisabled:
                    'bg-ui-violet-500 rounded-full border-2 border-transparent focus:outline-none focus:ring-0',
                button: 'h-4 w-4 rounded-full bg-white shadow flex items-center justify-center text-ui-gray-400 text-xs',
                buttonChecked:
                    'h-4 w-4 rounded-full bg-white shadow flex items-center justify-center text-ui-violet-500 text-xs transform translate-x-full',
                checkedPlaceholder:
                    'rounded-full w-4 h-4 flex items-center justify-center text-ui-gray-400 text-xs',
                uncheckedPlaceholder:
                    'rounded-full w-4 h-4 flex items-center justify-center text-ui-gray-400 text-xs',
            }"
        />

        <PopoverSettings
            v-if="$slots.popover && localValue"
            :title="popoverTitle"
            :tooltip="settingsTooltip"
            @reset="$emit('reset')"
            class="mx-1"
        >
            <slot name="popover" />
        </PopoverSettings>
    </div>
</template>

<script>
import { ref, toRefs, watch } from 'vue';

export default {
    inheritAttrs: false,

    props: {
        value: {
            type: Boolean,
            required: true,
        },
        popoverTitle: {
            type: String,
            required: false,
        },
        settingsTooltip: {
            type: String,
            required: false,
        },
    },

    setup(props) {
        const { value } = toRefs(props);

        const localValue = ref(value.value);

        watch(value, (value) => (localValue.value = value));

        return { localValue };
    },
};
</script>
