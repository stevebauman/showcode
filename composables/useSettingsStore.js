import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export default defineStore('settings', {
    state: () =>
        useStorage('settings', {
            tab: null,
        }),
});
