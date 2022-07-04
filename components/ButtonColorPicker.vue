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
                disable-fields
                :value="{ r: value.red, g: value.green, b: value.blue, a: value.alpha }"
                @input="
                    ({ rgba }) =>
                        $emit('change', { red: rgba.r, green: rgba.g, blue: rgba.b, alpha: rgba.a })
                "
            />
        </template>
    </V-Popover>
</template>

<style>
.vc-chrome {
    border-radius: 0.5rem;
    box-shadow: none !important;
    @apply overflow-hidden rounded-lg;
}

.vc-chrome-body {
    background-color: var(--color-ui-gray-700) !important;
}

.vc-chrome-saturation-wrap {
    @apply bg-ui-gray-700;
}

.vc-saturation {
    @apply m-2 rounded-lg overflow-hidden;
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
