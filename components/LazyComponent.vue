<template>
    <component
        :is="state.wrapperTag"
        :class="[
            'v-lazy-component',
            {
                'v-lazy-component--loading': !state.intersected,
                'v-lazy-component--loaded': state.intersected,
            },
        ]"
    >
        <slot v-if="state.intersected" />
        <slot v-if="!state.intersected" name="placeholder" />
    </component>
</template>

<script>
/** @link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options */
export default {
    props: {
        wrapperTag: {
            type: String,
            required: false,
            default: 'div',
        },
        intersected: {
            type: Boolean,
            required: false,
            default: false,
        },
        idle: {
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

    data() {
        return {
            state: {
                idle: this.idle,
                observer: null,
                wrapperTag: this.wrapperTag,
                intersected: this.intersected,
                rootMargin: this.rootMargin,
                threshold: this.threshold,
            },
        };
    },

    watch: {
        intersected(value) {
            if (value) {
                this.state.intersected = true;
            }
        },

        'state.intersected'(value) {
            this.$emit('intersected', value);
        },
    },

    mounted() {
        if ('IntersectionObserver' in window) {
            if (!this.state.intersected && !this.state.idle) {
                this.$nextTick(this.observe);
            }
        } else {
            this.state.intersected = true;
        }

        if (this.state.intersected) {
            this.$emit('intersected', true);
        }
    },

    beforeDestroy() {
        this.unobserve();
    },

    methods: {
        observe() {
            const { rootMargin, threshold } = this.state;

            const config = { root: undefined, rootMargin, threshold };

            this.state.observer = new IntersectionObserver(this.onIntersection, config);

            this.state.observer.observe(this.$el);
        },

        onIntersection(entries) {
            this.state.intersected = entries.some((entry) => entry.intersectionRatio > 0);
        },

        unobserve() {
            if ('IntersectionObserver' in window) {
                this.state.observer.unobserve(this.$el);
            }
        },
    },
};
</script>
