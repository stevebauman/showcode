<template>
    <button @click="toggle" aria-label="Toggle Color Scheme" title="Toggle Color Scheme">
        <slot :mode="colorMode" />
    </button>
</template>

<script>
import { storeToRefs } from 'pinia';
import useApplicationStore from '@/composables/useApplicationStore';

export default {
    setup() {
        const { colorMode } = storeToRefs(useApplicationStore());

        const toggle = () => (colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark');

        return { colorMode, toggle };
    },
};
</script>
