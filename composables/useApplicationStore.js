import { useDark } from '@vueuse/core';
import { defineStore } from 'pinia';

export default defineStore('application', {
    state: () => {
        return {
            isDark: useDark({
                selector: 'html',
                attribute: 'color-scheme',
                valueDark: 'dark',
                valueLight: 'light',
            }),
        };
    },
});
