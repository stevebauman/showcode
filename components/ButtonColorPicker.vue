<template>
    <V-Popover
        boundaries-element="body"
        class="flex justify-center"
        popover-inner-class="overflow-hidden border-2 rounded-lg shadow-xl bg-ui-gray-700 border-ui-gray-800"
    >
        <Button class="w-full tooltip-target">
            <span class="w-6 h-6 rounded-full" :style="{ backgroundColor: backgroundColor }" />

            Pick Color
        </Button>

        <template #popover>
            <Chrome
                :value="{ r: value.red, g: value.green, b: value.blue, a: value.alpha }"
                @input="
                    ({ rgba }) => {
                        $emit('change', {
                            red: rgba.r,
                            green: rgba.g,
                            blue: rgba.b,
                            alpha: rgba.a,
                        });
                    }
                "
            />
        </template>
    </V-Popover>
</template>

<style>
/* https://tailwindcss.com/docs/functions-and-directives#using-apply-with-per-component-css */
.highlight {
    @apply border border-gray-300;
}

html[color-scheme="dark"] .highlight {
    @apply border-ui-gray-900;
    box-shadow: inset 0 1px 0 0 hsl(0deg 0% 100% / 20%);
}

.vc-chrome {
    @apply !rounded-lg !bg-none !shadow-none;
}

.vc-chrome-body {
    @apply !bg-ui-gray-700;
}

.vc-saturation {
    @apply m-2 rounded-lg;
}

.vc-chrome-saturation-wrap {
    @apply p-6 !bg-ui-gray-700;
}

.vc-saturation--white {
    @apply rounded-lg;
}

.vc-saturation--black {
    @apply rounded-lg;
}

.vc-chrome-fields-wrap {
    @apply space-x-2;
}

.vc-chrome-fields .vc-input__input {
    @apply !border-0 !rounded-lg !shadow-none !text-ui-gray-400 !bg-ui-gray-600 hover:bg-ui-gray-900 focus:outline-none focus:ring-0;
}

.vc-chrome-fields .vc-input__label {
    @apply text-xs font-semibold text-ui-gray-300 whitespace-nowrap;
}

.vc-chrome-toggle-btn {
    @apply highlight flex items-center !text-ui-gray-300 rounded-lg justify-center transition duration-100 ease-in-out bg-ui-gray-700 hover:bg-ui-gray-900;
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
            required: true,
        },
    },

    components: { Chrome },

    setup(props) {
        const backgroundColor = computed(() => {
            return `rgb(${props.value.red}, ${props.value.green}, ${props.value.blue})`;
        });

        return { backgroundColor };
    },
};
</script>
