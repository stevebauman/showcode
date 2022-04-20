import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { get, remove, pick } from 'lodash';

const getOldTemplates = () => {
    const keys = Object.keys(window.localStorage).filter((key) => key.startsWith('templates/'));

    return keys.map((k) => JSON.parse(window.localStorage.getItem(k)));
};

export default defineStore('templates', {
    state: () =>
        useStorage('templates', getOldTemplates(), undefined, {
            serializer: {
                read: (v) => JSON.parse(v),
                write: (v) => JSON.stringify(v),
            },
        }),

    getters: {
        all() {
            return this.$state;
        },
    },

    actions: {
        add(template) {
            this.$state.add(template);
        },

        remove(template) {
            remove(this.$state, (t) => get(t, 'tab.id') === get(template, 'tab.id'));
        },
    },
});
