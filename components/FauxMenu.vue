<template>
    <div class="flex items-center gap-2">
        <div
            class="w-3 h-3 rounded-full"
            v-for="(dot, index) in dots"
            :key="index"
            :style="{ backgroundColor: dotColor }"
            :class="theme === 'color' ? classes[dot] : null"
        ></div>
    </div>
</template>

<script>
import chroma from 'chroma-js';
import { computed } from '@nuxtjs/composition-api';

export default {
    props: {
        theme: String,
        themeBackground: String,
    },

    setup(props) {
        const dotColor = computed(() => {
            if (props.theme === 'color') {
                return;
            }

            return chroma(props.themeBackground)
                .darken(props.theme === 'light' ? 1 : -3)
                .alpha(0.5)
                .hex();
        });

        return {
            dotColor,
            dots: [0, 1, 2],
            classes: ['bg-red-500', 'bg-yellow-400', 'bg-green-400'],
        };
    },
};
</script>
