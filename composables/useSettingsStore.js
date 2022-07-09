import collect from 'collect.js';
import { isArray } from 'lodash';
import { defineStore } from 'pinia';
import useIndexedDb from './useIndexedDb';

const mapBackgroundsToArray = (backgrounds) => {
    return collect(backgrounds)
        .map((attrs, id) => ({
            id,
            ...attrs,
        }))
        .toArray();
};

const getOldBackgrounds = () => {
    return mapBackgroundsToArray(
        JSON.parse(window.localStorage.getItem('settings/backgrounds') ?? '[]')
    );
};

const state = useIndexedDb('settings', {
    tab: '',
    backgrounds: getOldBackgrounds(),
});

window.localStorage.removeItem('settings/backgrounds');

export default defineStore('settings', {
    state: () => {
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
