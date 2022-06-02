<template>
    <button @click="toggle()" aria-label="Toggle Darkmode" title="Toggle Darkmode">
        <slot :dark="isDark" />
    </button>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useToggle } from '@vueuse/core';
import useApplicationStore from '@/composables/useApplicationStore';

export default {
    setup() {
        const { isDark } = storeToRefs(useApplicationStore());

        const toggle = useToggle(isDark);

        return { isDark, toggle };
    },
};
</script>
