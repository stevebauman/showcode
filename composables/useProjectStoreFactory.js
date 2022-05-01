import download from 'downloadjs';
import { v4 as uuid } from 'uuid';
import { cloneDeep } from 'lodash';
import { defineStore } from 'pinia';
import { useLocalStorage, RemovableRef } from '@vueuse/core';

export default function (id) {
    return defineStore(id, {
        state: () => ({
            page: {},
            settings: {},
            tab: {
                order: 0,
                id: uuid(),
                name: 'Untitled',
                created_at: new Date(),
            },
        }),

        getters: {
            /**
             * @returns {RemovableRef}
             */
            storage() {
                return useLocalStorage(id, this.$state);
            },
        },

        actions: {
            /**
             * Sync the state into local storage.
             */
            sync() {
                this.storage.value = this.$state;
            },

            /**
             * Load the state from local storage.
             */
            load() {
                Object.assign(this.$state, this.storage.value);
            },

            /**
             * Clear the state from local storage.
             */
            clear() {
                this.storage.value = null;
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
        },
    });
}
