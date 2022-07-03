<template>
    <V-Popover
        boundaries-element="body"
        class="flex justify-center"
        popover-inner-class="border-2 rounded-lg shadow-xl bg-ui-gray-700 border-ui-gray-800"
    >
        <Button class="w-full tooltip-target">
            <span class="w-6 h-6 rounded-full" :style="{ backgroundColor: backgroundColor }" />

            Pick Color
        </Button>

        <template #popover>
            <ColorPicker
                :color="value"
                :on-change="
                    (color) =>
                        $emit('change', {
                            red: color.red,
                            green: color.green,
                            blue: color.blue,
                            alpha: color.alpha,
                        })
                "
            />
        </template>
    </V-Popover>
</template>

<style>
.ui-color-picker {
    @apply bg-inherit;
}

.picking-area {
    @apply overflow-hidden rounded-xl;
}

.preview-box {
    border: none !important;
}

.input-field .input-container .input {
    border: none !important;
    @apply text-ui-gray-400 font-normal;
}

.color-preview-area .label {
    font-weight: 400 !important;
    color: var(--color-ui-gray-300) !important;
    @apply text-xs uppercase;
}

.color-preview-area .input {
    font-weight: 400 !important;
    color: var(--color-ui-gray-400) !important;
    @apply border-0 rounded-lg bg-ui-gray-600 hover:bg-ui-gray-900 focus:outline-none focus:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus;
}
</style>

<script>
import 'vue-color-gradient-picker/dist/index.css';
import { computed } from '@nuxtjs/composition-api';
import { ColorPicker } from 'vue-color-gradient-picker';

export default {
    props: {
        value: {
            type: Object,
            required: true,
        },
    },

    components: { ColorPicker },

    setup(props) {
        const backgroundColor = computed(() => {
            return `rgb(${props.value.red}, ${props.value.green}, ${props.value.blue})`;
        });

        return { backgroundColor };
    },
};
</script>
