import collect from 'collect.js';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

const getOldBackgrounds = () => JSON.parse(localStorage.getItem('settings/backgrounds') ?? '{}');

export default defineStore('settings', {
    state: () =>
        useLocalStorage('settings', {
            tab: '',
            backgrounds: getOldBackgrounds(),
        }),

    getters: {
        displayableBackgrounds: (state) => {
            return collect(state.backgrounds)
                .map((attrs, id) => ({
                    name: id,
                    custom: true,
                    ...attrs,
                }))
                .toArray();
        },
    },
});
