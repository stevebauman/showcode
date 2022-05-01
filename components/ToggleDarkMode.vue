<template>
    <button @click="toggle" aria-label="Toggle Darkmode" title="Toggle Darkmode">
        <slot :dark="isDarkMode" />
    </button>
</template>

<script>
import { useDark, useToggle } from '@vueuse/core';
import { useContext, watch } from '@nuxtjs/composition-api';

export default {
    setup() {
        const { $bus } = useContext();

        const isDarkMode = useDark({
            selector: 'html',
            attribute: 'dark',
            valueDark: true,
            valueLight: false,
        });

        watch(isDarkMode, (enabled) => $bus.$emit('update:dark-mode', enabled));

        const toggle = useToggle(isDarkMode);

        return { isDarkMode, toggle };
    },
};
</script>
