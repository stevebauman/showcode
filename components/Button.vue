<template>
    <component
        :is="is"
        :type="as"
        :href="href"
        :class="[...classes, sizes[size], variants[variant], rounded ? 'rounded-lg' : null]"
    >
        <slot />
    </component>
</template>

<script setup>
import { computed } from '@nuxtjs/composition-api';
import useButtonClasses from '@/composables/useButtonClasses';

const props = defineProps({
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
});

const is = computed(() => (props.href ? 'a' : 'button'));
const as = computed(() => (is.value === 'button' ? props.type : null));

const { classes, sizes, variants } = useButtonClasses(props);
</script>
