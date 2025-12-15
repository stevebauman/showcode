<template>
    <component ref="root" :is="as">
        <slot v-if="rootIsVisible || show" />
        <slot v-if="!rootIsVisible" name="placeholder" />
    </component>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core';
import { ref, watch, onBeforeUnmount } from 'vue';

/** @link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options */
const props = defineProps({
    as: {
        type: String,
        required: false,
        default: 'div',
    },
    show: {
        type: Boolean,
        required: false,
        default: false,
    },
    intersected: {
        type: Boolean,
        required: false,
        default: false,
    },
    rootMargin: {
        type: String,
        required: false,
        default: '0px 0px 0px 0px',
    },
    threshold: {
        type: [Number, Array],
        required: false,
        default: 1.0,
    },
});

const emit = defineEmits(['intersected']);

const root = ref(null);
const rootIsVisible = ref(false);

const { stop } = useIntersectionObserver(
    root,
    ([{ isIntersecting }]) => (rootIsVisible.value = isIntersecting),
    { threshold: props.threshold, rootMargin: props.rootMargin }
);

onBeforeUnmount(stop);

watch(rootIsVisible, (value) => emit('intersected', value));
</script>
