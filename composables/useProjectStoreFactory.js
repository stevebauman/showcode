import download from 'downloadjs';
import { v4 as uuid } from 'uuid';
import { cloneDeep, replace } from 'lodash';
import { defineStore } from 'pinia';
import { namespace } from './useProjectStores';
import useTemplateStore from './useTemplateStore';
import { useLocalStorage, RemovableRef } from '@vueuse/core';

export default function (id) {
    return defineStore(id, {
        state: () => ({
            page: {},
            settings: {},
            elements: [
                {
                    id: uuid(),
                    name: 'canvas',
                    title: 'Canvas',
                    removable: false,
                    component: 'ElementsCanvas',
                    attributes: [],
                },
                {
                    id: uuid(),
                    name: 'code',
                    title: 'Code Window',
                    removable: false,
                    component: 'ElementsCode',
                    attributes: [],
                },
            ],
            tab: {
                order: 0,
                name: null,
                created_at: new Date(),
                id: replace(id, namespace, ''),
            },
        }),

        actions: {
            /**
             * Sync the state into local storage.
             */
            sync() {
                this.storage().value = cloneDeep(this.$state);
            },

            /**
             * Load the state from local storage.
             */
            load() {
                Object.assign(this.$state, this.storage().value);
            },

            /**
             * Clear the state from local storage.
             */
            clear() {
                this.storage().value = null;
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
             * Get the local storage ref.
             *
             * @returns {RemovableRef}
             */
            storage() {
                return useLocalStorage(id, cloneDeep(this.$state));
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

            /**
             * Add a new element.
             *
             * @param {Object} element
             */
            addElement(element) {
                this.elements.push({
                    id: uuid(),
                    ...element,
                });
            },

            /**
             * Update an element.
             *
             * @param {Object} element
             */
            updateElement(id, attributes) {
                const index = this.elements.findIndex((el) => el.id === id);

                if (index !== -1) {
                    const element = this.elements[index];

                    element.attributes = attributes;

                    this.elements.splice(index, 1, element);
                }
            },

            /**
             * Remove an element.
             *
             * @param {Object} element
             */
            removeElement(element) {
                const index = this.elements.findIndex((el) => el.id === element.id);

                if (index !== -1) {
                    this.elements.splice(index, 1);
                }
            },
        },
    });
}
