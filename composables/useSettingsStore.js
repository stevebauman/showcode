import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

const getOldBackgrounds = () => JSON.parse(localStorage.getItem('settings/backgrounds') ?? '[]');

export default defineStore('settings', {
    state: () =>
        useStorage('settings', {
            tab: '',
            backgrounds: getOldBackgrounds(),
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
