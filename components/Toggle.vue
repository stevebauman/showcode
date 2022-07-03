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

        <Popover v-if="$slots.popover && localValue">
            <template #trigger>
                <button type="button" class="flex items-center h-full text-ui-gray-300">
                    <SettingsIcon class="w-4 h-4" />
                </button>
            </template>

            <template #popover>
                <slot name="popover" />
            </template>
        </Popover>
    </div>
</template>

<script>
import { SettingsIcon } from 'vue-feather-icons';
import { ref, toRefs, watch } from '@nuxtjs/composition-api';

export default {
    inheritAttrs: false,

    props: { value: Boolean },

    components: { SettingsIcon },

    setup(props) {
        const { value } = toRefs(props);

        const localValue = ref(value.value);

        watch(value, (value) => (localValue.value = value));

        return { localValue };
    },
};
</script>
