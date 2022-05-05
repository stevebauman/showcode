import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export default defineStore('settings', {
    state: () =>
        useStorage('settings', {
            tab: '',
            backgrounds: JSON.parse(localStorage.getItem('settings/backgrounds') ?? '[]'),
        }),

    getters: {
        displayableBackgrounds: (state) => {
            return state.backgrounds.map(({ id, ...rest }) => ({
                name: id,
                custom: true,
                ...rest,
            }));
        },
    },
});
