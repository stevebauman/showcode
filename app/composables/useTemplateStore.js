import { defineStore } from 'pinia';
import useSettingsStore from './useSettingsStore';

export default defineStore('templates', {
    state: () => ({
        items: [],
    }),

    actions: {
        /**
         * Get all of the templates.
         *
         * @returns {Array}
         */
        all() {
            return this.items;
        },

        /**
         * Add a new template.
         *
         * @param {*} template
         */
        add(template) {
            this.items.push(template);
        },

        /**
         * Remove a template.
         *
         * @param {*} template
         */
        remove(template) {
            const index = this.items.findIndex((t) => t.tab.id === template.tab.id);

            if (index !== -1) {
                this.items.splice(index, 1);

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
            return this.items.find((t) => t.tab.id === templateId) || null;
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
            const index = this.items.findIndex((t) => t.tab.id === template.tab.id);
            if (index !== -1) {
                this.items[index].tab.name = newName;
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

    persist: {
        key: 'templates',
        storage: import.meta.client ? localStorage : undefined,
    },
});
