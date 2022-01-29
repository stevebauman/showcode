<template>
    <component
        :is="is"
        :type="as"
        :href="href"
        :class="[sizes[size], variants[variant], rounded ? 'rounded-lg' : null]"
        class="inline-flex items-center gap-2 transition duration-100 ease-in-out focus:outline-none focus:ring-2 focus:ring-ui-focus"
    >
        <slot />
    </component>
</template>

<script>
export default {
    props: {
        href: {
            type: String,
        },
        type: {
            type: String,
            default: 'button',
        },
        size: {
            type: String,
            default: null,
        },
        active: {
            type: Boolean,
            default: false,
        },
        rounded: {
            type: Boolean,
            default: true,
        },
        variant: {
            type: String,
            default: 'secondary',
        },
    },

    computed: {
        is() {
            return this.href ? 'a' : 'button';
        },

        as() {
            return this.is === 'button' ? this.type : null;
        },

        sizes() {
            return {
                xs: 'text-xs px-2.5 py-1.5',
                sm: 'text-sm px-3 py-2 leading-4',
                base: 'text-sm px-4 py-2',
                lg: 'text-base font-semibold px-4 py-2',
            };
        },

        variants() {
            return {
                primary: [
                    'text-white bg-ui-violet-500 hover:bg-ui-violet-600 focus:bg-ui-violet-600',
                    this.active ? 'bg-ui-violet-600 font-bo;ld' : null,
                ],
                secondary: [
                    'text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus:bg-ui-gray-900',
                    this.active ? 'bg-ui-gray-900 font-bold' : null,
                ],
            };
        },
    },
};
</script>
