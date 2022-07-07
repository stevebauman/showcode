<template>
    <input
        :value="value"
        :class="[sizes[size]]"
        :type="$attrs.type || 'text'"
        @input="$emit('input', $event.target.value)"
        class="border-0 rounded-lg text-ui-gray-400 disabled:cursor-not-allowed disabled:bg-ui-gray-900 bg-ui-gray-600 hover:bg-ui-gray-900 focus:outline-none focus:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus"
    />
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            default: '',
        },
        size: {
            type: String,
            default: 'base',
        },
    },

    setup() {
        const sizes = {
            xs: 'text-xs px-2.5 py-0.5',
            sm: 'text-sm px-3 py-2 ',
            base: 'text-sm px-4 py-2',
            lg: 'text-base font-semibold px-4 py-3',
        };

        return { sizes };
    },
};
</script>
