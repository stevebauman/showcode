import collect from 'collect.js';
import { defineStore } from 'pinia';

export default defineStore('settings', {
    state: () => ({
        tab: '',
        defaultTemplate: null,
        backgrounds: [],
    }),

    actions: {
        addBackground(id, attrs) {
            this.backgrounds.push({ ...attrs, id });
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

        setDefaultTemplate(templateId) {
            this.defaultTemplate = templateId;
        },

        getDefaultTemplate() {
            return this.defaultTemplate;
        },

        clearDefaultTemplate() {
            this.defaultTemplate = null;
        },
    },

    persist: {
        key: 'settings',
        storage: import.meta.client ? localStorage : undefined,
    },
});
