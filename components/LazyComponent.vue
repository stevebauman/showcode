<template>
    <component ref="root" :is="state.as">
        <slot v-if="state.intersected || show" />
        <slot v-if="!state.intersected" name="placeholder" />
    </component>
</template>

<script>
import {
    ref,
    watch,
    toRefs,
    reactive,
    nextTick,
    onMounted,
    onUnmounted,
} from '@nuxtjs/composition-api';

/** @link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options */
export default {
    props: {
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
        idle: {
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
    },

    setup(props, context) {
        const { emit } = context;

        const { as, idle, intersected, rootMargin, threshold } = toRefs(props);

        const root = ref(null);

        const state = reactive({
            observer: null,
            as: as.value,
            idle: idle.value,
            threshold: threshold.value,
            rootMargin: rootMargin.value,
            intersected: intersected.value,
        });

        const observe = () => {
            const { rootMargin, threshold } = state;

            const config = { root: undefined, rootMargin, threshold };

            state.observer = new IntersectionObserver(onIntersection, config);

            state.observer.observe(root.value);
        };

        const onIntersection = (entries) => {
            state.intersected = entries.some((entry) => entry.intersectionRatio > 0);
        };

        const unobserve = () => {
            if ('IntersectionObserver' in window) {
                state.observer.unobserve(root.value);
            }
        };

        watch(intersected, (value) => {
            if (value) {
                state.intersected = true;
            }
        });

        watch(
            () => state.intersected,
            (value) => emit('intersected', value)
        );

        onMounted(() => {
            if ('IntersectionObserver' in window) {
                if (!state.intersected && !state.idle) {
                    nextTick(observe);
                }
            } else {
                state.intersected = true;
            }

            if (state.intersected) {
                emit('intersected', true);
            }
        });

        onUnmounted(unobserve);

        return { root, state };
    },
};
</script>
