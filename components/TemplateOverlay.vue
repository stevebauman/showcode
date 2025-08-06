<template>
    <div
        class="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center"
        :class="overlayClasses"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        spacing: {
            type: String,
            default: 'space-x-3',
            validator: (value) => ['space-x-2', 'space-x-3', 'space-x-4', ''].includes(value),
        },
    },

    computed: {
        overlayClasses() {
            return this.spacing;
        },
    },
};
</script>
