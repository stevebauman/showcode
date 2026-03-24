import { defineStore } from 'pinia';
import { useColorMode } from '@vueuse/core';

export default defineStore('application', {
    state() {
        return {
            colorMode: useColorMode({
                selector: 'html',
                attribute: 'color-scheme',
                initialValue: 'dark',
                modes: {
                    light: 'light',
                    dark: 'dark',
                },
            }),
        };
    },

    getters: {
        isDarkMode() {
            return this.colorMode === 'dark';
        },
    },
});
