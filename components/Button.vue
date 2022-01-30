<template>
    <component
        :is="is"
        :type="as"
        :href="href"
        :class="[sizes[size], variants[variant], rounded ? 'rounded-lg' : null, ...classes]"
    >
        <slot />
    </component>
</template>

<script>
import { computed, toRefs } from '@nuxtjs/composition-api';
import useButtonClasses from '../composables/useButtonClasses';

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
            default: 'base',
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

    setup(props) {
        const { type, href } = toRefs(props);

        const is = computed(() => (href.value ? 'a' : 'button'));
        const as = computed(() => (is.value === 'button' ? type.value : null));

        return { is, as, ...useButtonClasses(props) };
    },
};
</script>
