import collect from 'collect.js';
import download from 'downloadjs';
import { v4 as uuid } from 'uuid';
import { defineStore } from 'pinia';
import useIndexedDb from './useIndexedDb';
import { namespace } from './useProjectStores';
import useTemplateStore from './useTemplateStore';
import { cloneDeep, replace, omit } from 'lodash';

export default function (id, initialValue = null) {
    const storage = useIndexedDb(
        id,
        initialValue ?? {
            version: '1.22.0',
            modified: false,
            page: {},
            settings: {},
            tab: {
                order: 0,
                name: null,
                created_at: new Date(),
                id: replace(id, namespace, ''),
            },
        }
    );

    return defineStore(id, {
        state: () => storage.value,

        actions: {
            /**
             * Sync the state into local storage.
             */
            sync() {
                if (storage.value !== null) {
                    storage.value = cloneDeep(this.$state);
                }
            },

            /**
             * Load the state from local storage.
             */
            load() {
                Object.assign(this.$state, storage.value);
            },

            /**
             * Clear the state from local storage.
             */
            clear() {
                storage.value = null;
            },

            /**
             * Get a clone of the project.
             *
             * @returns {*}
             */
            clone() {
                const clone = cloneDeep(this.$state);

                clone.tab.id = uuid();

                return clone;
            },

            /**
             * Export the project into a JSON config file.
             */
            export() {
                const state = this.clone();

                const name = state.tab.name || 'Untitled Project';

                download(JSON.stringify(state, null, 2), `${name}.json`);
            },

            /**
             * Export the project into a JSON file for an API request.
             */
            exportForApi() {
                const state = this.clone();

                const json = {
                    settings: omit(state.settings, 'image'),
                    editors: collect(state.page.editors)
                        .map((editor) => omit(editor, ['id', 'tabSize']))
                        .toArray(),
                };

                const name = state.tab.name || 'json';

                download(JSON.stringify(json, null, 2), `${name}.json`);
            },

            /**
             * Save the project as a template.
             */
            saveAsTemplate() {
                const templates = useTemplateStore();

                const project = this.clone();

                project.tab.created_at = new Date();

                project.tab.name = project.tab.name || 'Untitled Project';

                templates.add(project);
            },
        },
    });
}
