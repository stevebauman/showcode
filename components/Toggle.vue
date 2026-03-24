<template>
    <div
        :class="{
            'flex items-center': $slots.popover && localValue,
        }"
    >
        <button
            type="button"
            role="switch"
            :aria-checked="localValue"
            class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0"
            :class="localValue ? 'bg-ui-violet-500' : 'bg-ui-gray-800'"
            @click="toggle"
        >
            <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
                :class="localValue ? 'translate-x-4' : 'translate-x-0'"
            />
        </button>

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
        modelValue: {
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

    emits: ['update:modelValue', 'reset'],

    setup(props, { emit }) {
        const { modelValue } = toRefs(props);

        const localValue = ref(modelValue.value);

        watch(modelValue, (val) => (localValue.value = val));

        const toggle = () => {
            localValue.value = !localValue.value;
            emit('update:modelValue', localValue.value);
        };

        return { localValue, toggle };
    },
};
</script>
