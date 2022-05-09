import collect from 'collect.js';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { isArray } from 'lodash';

const mapBackgroundsToArray = (backgrounds) => {
    return collect(backgrounds)
        .map((attrs, id) => ({
            id,
            ...attrs,
        }))
        .toArray();
};

const getOldBackgrounds = () => {
    return mapBackgroundsToArray(JSON.parse(localStorage.getItem('settings/backgrounds') ?? '[]'));
};

export default defineStore('settings', {
    state: () => {
        const state = useLocalStorage('settings', {
            tab: '',
            backgrounds: getOldBackgrounds(),
        });

        if (!isArray(state.value.backgrounds)) {
            state.value.backgrounds = mapBackgroundsToArray(state.value.backgrounds);
        }

        return state;
    },

    actions: {
        addBackground(id, attrs) {
            this.backgrounds.push({ id, ...attrs });
        },

        deleteBackground(id) {
            const index = this.backgrounds.findIndex((bg) => bg?.id === id);

            if (index !== false) {
                this.backgrounds.splice(index, 1);
            }
        },

        getDisplayableBackgrounds() {
            return collect(this.backgrounds)
                .map((attrs, id) => ({
                    id: id,
                    custom: true,
                    ...attrs,
                }))
                .toArray();
        },
    },
});
