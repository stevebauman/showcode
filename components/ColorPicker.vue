<template>
    <V-Popover
        boundaries-element="body"
        class="flex justify-center"
        popover-inner-class="overflow-hidden border rounded-lg shadow-xl bg-ui-gray-700 border-ui-gray-800"
    >
        <slot :background-color="backgroundColor" />

        <template #popover>
            <Chrome
                :value="{ r: rgba.red, g: rgba.green, b: rgba.blue, a: rgba.alpha }"
                @input="
                    $emit('change', {
                        red: $event.rgba.r,
                        green: $event.rgba.g,
                        blue: $event.rgba.b,
                        alpha: $event.rgba.a,
                    })
                "
            />
        </template>
    </V-Popover>
</template>

<style>
.vc-chrome {
    @apply !rounded-md !bg-none !shadow-none;
}

.vc-chrome-body {
    @apply !bg-ui-gray-700;
}

.vc-saturation {
    @apply m-2 rounded-md;
}

.vc-chrome-saturation-wrap {
    @apply p-6 !bg-ui-gray-700;
}

.vc-saturation--white {
    @apply rounded-md;
}

.vc-saturation--black {
    @apply rounded-md;
}

.vc-chrome-fields-wrap {
    @apply space-x-2;
}

.vc-chrome-fields .vc-input__input {
    @apply !border-0 !rounded-md !shadow-none !text-ui-gray-400 !bg-ui-gray-600 hover:bg-ui-gray-900 focus:outline-none focus:ring-0;
}

.vc-chrome-fields .vc-input__label {
    @apply text-xs font-semibold text-ui-gray-300 whitespace-nowrap;
}

.vc-chrome-toggle-btn {
    @apply flex items-center !text-ui-gray-300 rounded-md border border-gray-300 justify-center transition duration-100 ease-in-out bg-ui-gray-700 hover:bg-ui-gray-900;
}

[color-scheme='dark'] .vc-chrome-toggle-btn {
    @apply border-ui-gray-900;
}

.vc-chrome-toggle-icon {
    @apply !m-0 inline-flex items-center gap-2 leading-none transition duration-100 ease-in-out focus:outline-none focus:ring-0;
}

.vc-chrome-toggle-icon svg path {
    fill: currentColor !important;
}

.vc-chrome-toggle-icon-highlight {
    @apply hidden;
}
</style>

<script>
import { Chrome } from 'vue-color';
import { computed } from '@nuxtjs/composition-api';

export default {
    props: {
        value: {
            type: Object,
            required: false,
        },
    },

    components: { Chrome },

    setup(props) {
        const rgba = computed(
            () =>
                props.value ?? {
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 1,
                }
        );

        const backgroundColor = computed(() => {
            return `rgb(${rgba.value.red}, ${rgba.value.green}, ${rgba.value.blue})`;
        });

        return { rgba, backgroundColor };
    },
};
</script>
