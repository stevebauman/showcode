import { defineStore } from 'pinia';
import { useColorMode, useDark } from '@vueuse/core';

export default defineStore('application', {
    state() {
        return {
            colorMode: useColorMode({
                selector: 'html',
                attribute: 'class',
                initialValue: 'dark',
                modes: {
                    dark: 'dark',
                    light: '',
                },
            }),
            isDark: useDark(),
        };
    },

    getters: {
        isDarkMode() {
            return this.isDark;
        },
    },
});
