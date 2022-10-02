<template>
    <div ref="root" class="relative">
        <slot />
    </div>
</template>

<style>
.ps__rail-x {
    display: block;
    opacity: 0.4;
}

.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover {
    @apply bg-transparent;
}

.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
    @apply bg-transparent;
}
</style>

<script>
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import { onBeforeUnmount, onMounted, ref } from '@nuxtjs/composition-api';

export default {
    props: {
        forceVerticalScroll: Boolean,
    },

    setup(props) {
        const root = ref(null);
        const scrollbar = ref(null);
        const scrollListener = ref(null);

        onMounted(() => {
            scrollbar.value = new PerfectScrollbar(root.value);

            if (props.forceVerticalScroll) {
                scrollListener.value = root.value.addEventListener('wheel', (e) => {
                    const isTouchPad = e.wheelDeltaY
                        ? e.wheelDeltaY === -3 * e.deltaY
                        : e.deltaMode === 0;

                    if (isTouchPad) {
                        return;
                    }

                    e.preventDefault();

                    root.value.scrollLeft += e.deltaY;
                });
            }
        });

        onBeforeUnmount(() => {
            scrollbar.value.destroy();
            root.value.removeEventListener(scrollListener.value);
        });

        return { root };
    },
};
</script>
