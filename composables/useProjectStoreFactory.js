import download from 'downloadjs';
import { v4 as uuid } from 'uuid';
import { cloneDeep, replace } from 'lodash';
import { defineStore } from 'pinia';
import { namespace } from './useProjectStores';
import { useLocalStorage } from '@vueuse/core';
import useTemplateStore from './useTemplateStore';

export default function (id) {
    const storage = useLocalStorage(id, {
        version: '1.11.0',
        page: {},
        settings: {},
        tab: {
            order: 0,
            name: null,
            created_at: new Date(),
            id: replace(id, namespace, ''),
        },
    });

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

                window.localStorage.removeItem(`${namespace}/${this.tab.id}`);
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
