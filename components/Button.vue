<template>
    <button
        type="button"
        :class="{ 'rounded-lg': rounded, 'bg-ui-gray-900': active }"
        class="inline-flex items-center gap-2 px-2 py-1 text-sm  text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-2 focus:ring-ui-focus"
    >
        <slot />
    </button>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        rounded: {
            type: Boolean,
            default: true,
        },
    },
};
</script>
