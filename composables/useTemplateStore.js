import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

const getOldTemplates = () => {
    const keys = Object.keys(window.localStorage).filter((key) => key.startsWith('templates/'));

    return keys.map((k) => JSON.parse(window.localStorage.getItem(k)));
};

export default defineStore('templates', {
    state: () => useStorage('templates', getOldTemplates()),

    actions: {
        /**
         * Get all of the templates.
         *
         * @returns {Array}
         */
        all() {
            return this.$state;
        },

        /**
         * Add a new template.
         *
         * @param {*} template
         */
        add(template) {
            this.$state.push(template);
        },

        /**
         * Remove a template.
         *
         * @param {*} template
         */
        remove(template) {
            const index = this.$state.findIndex((t) => t.tab.id === template.tab.id);

            if (index !== false) {
                this.$state.splice(index, 1);
            }
        },
    },
});
