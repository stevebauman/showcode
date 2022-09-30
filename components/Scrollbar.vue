<template>
    <Simplebar
        ref="simplebar"
        v-bind="$attrs"
        class="simplebar"
        :class="{ 'simplebar-float-horizontal': floatHorizontal }"
        data-simplebar-auto-hide="false"
    >
        <slot />
    </Simplebar>
</template>

<style>
.simplebar.simplebar-float-horizontal > .simplebar-track.simplebar-horizontal {
    @apply mb-0.5;
}

.simplebar-content {
    @apply h-full;
}
</style>

<script>
import Simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
import { onBeforeUnmount, onMounted, ref } from '@vue/composition-api';

export default {
    props: {
        floatHorizontal: Boolean,
        forceVerticalScroll: Boolean,
    },

    components: { Simplebar },

    setup(props) {
        const simplebar = ref(null);
        const scrollListener = ref(null);
        const scrollContainer = ref(null);

        onMounted(() => {
            scrollContainer.value = simplebar.value.$el
                .getElementsByClassName('simplebar-content-wrapper')
                .item(0);

            if (scrollContainer.value && props.forceVerticalScroll) {
                scrollListener.value = scrollContainer.value.addEventListener('wheel', (e) => {
                    const isTouchPad = e.wheelDeltaY
                        ? e.wheelDeltaY === -3 * e.deltaY
                        : e.deltaMode === 0;

                    if (isTouchPad) {
                        return;
                    }

                    e.preventDefault();

                    scrollContainer.value.scrollLeft += e.deltaY;
                });
            }
        });

        onBeforeUnmount(() => {
            if (scrollContainer.value && scrollListener.value) {
                scrollContainer.value.removeEventListener(scrollListener.value);
            }
        });

        return { simplebar };
    },
};
</script>
