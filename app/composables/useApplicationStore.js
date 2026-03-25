import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useColorMode, usePreferredDark } from '@vueuse/core';

const colorModeValue = ref('dark');
let colorModeInstance = null;

function initColorMode() {
    if (colorModeInstance) return;

    colorModeInstance = useColorMode({
        selector: 'html',
        attribute: 'class',
        initialValue: 'dark',
        modes: {
            dark: 'dark',
            light: '',
        },
    });

    // Sync the instance value to our stable ref.
    colorModeValue.value = colorModeInstance.value;
    watch(colorModeInstance, (v) => (colorModeValue.value = v));
}

const colorMode = computed({
    get: () => colorModeValue.value,
    set: (v) => {
        colorModeValue.value = v;
        if (colorModeInstance) colorModeInstance.value = v;
    },
});

export { colorMode, initColorMode };

export default defineStore('application', {
    getters: {
        isDarkMode() {
            return colorModeValue.value === 'dark';
        },
    },
});
