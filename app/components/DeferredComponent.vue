<template>
    <component ref="root" :is="as">
        <slot v-if="rootIsVisible || show" />
        <slot v-if="!rootIsVisible" name="placeholder" />
    </component>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core';
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
    as: { type: String, default: 'div' },
    show: { type: Boolean, default: false },
    intersected: { type: Boolean, default: false },
    rootMargin: { type: String, default: '0px 0px 0px 0px' },
    threshold: { type: [Number, Array], default: 1.0 },
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
