import { defineStore } from 'pinia';
import useIndexedDb from './useIndexedDb';
import useSettingsStore from './useSettingsStore';

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

                // Clear default template if we're removing it
                const settings = useSettingsStore();

                if (settings.getDefaultTemplate() === template.tab.id) {
                    settings.clearDefaultTemplate();
                }
            }
        },

        /**
         * Find a template by its ID.
         *
         * @param {String} templateId
         * @returns {*|null}
         */
        findById(templateId) {
            return this.$state.find((t) => t.tab.id === templateId) || null;
        },

        /**
         * Get the default template.
         *
         * @returns {*|null}
         */
        getDefault() {
            const settings = useSettingsStore();

            const defaultTemplateId = settings.getDefaultTemplate();

            if (!defaultTemplateId) {
                return null;
            }

            return this.findById(defaultTemplateId);
        },

        /**
         * Set a template as the default.
         *
         * @param {*} template
         */
        setAsDefault(template) {
            const settings = useSettingsStore();

            settings.setDefaultTemplate(template.tab.id);
        },

        /**
         * Clear the default template.
         */
        clearAsDefault() {
            const settings = useSettingsStore();

            settings.clearDefaultTemplate();
        },

        /**
         * Rename a template.
         *
         * @param {*} template
         * @param {String} newName
         */
        rename(template, newName) {
            const index = this.$state.findIndex((t) => t.tab.id === template.tab.id);
            if (index !== false) {
                this.$state[index].tab.name = newName;
            }
        },

        /**
         * Check if a template is the default.
         *
         * @param {*} template
         * @returns {Boolean}
         */
        isDefault(template) {
            const settings = useSettingsStore();

            return settings.getDefaultTemplate() === template.tab.id;
        },
    },
});
