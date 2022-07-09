import { defineStore } from 'pinia';
import useIndexedDb from './useIndexedDb';

const oldLocalTemplates = window.localStorage.getItem('templates') ?? '[]';

const state = useIndexedDb('templates', JSON.parse(oldLocalTemplates));

window.localStorage.removeItem('templates');

export default defineStore('templates', {
    state: () => state,

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
