import { v4 as uuid } from 'uuid';
import { defineStore } from 'pinia';

function timestamp(project, key) {
    return project?.tab?.[key] ? new Date(project.tab[key]).getTime() : 0;
}

export default defineStore('saved-projects', {
    state: () => ({
        items: [],
    }),

    actions: {
        /**
         * Get all of the saved projects.
         *
         * @returns {Array}
         */
        all() {
            return [...this.items].sort(
                (a, b) => timestamp(b, 'saved_at') - timestamp(a, 'saved_at')
            );
        },

        /**
         * Get the most recently opened or saved projects.
         *
         * @param {Number} limit
         *
         * @returns {Array}
         */
        recent(limit = 5) {
            return [...this.items]
                .sort((a, b) => {
                    const latestA = timestamp(a, 'opened_at') || timestamp(a, 'saved_at');
                    const latestB = timestamp(b, 'opened_at') || timestamp(b, 'saved_at');

                    return latestB - latestA;
                })
                .slice(0, limit);
        },

        /**
         * Save the given project.
         *
         * @param {Store} project
         *
         * @returns {*}
         */
        save(project, options = {}) {
            const savedProjectId = options.force
                ? uuid()
                : (project.tab.saved_project_id ?? uuid());
            const savedProject = project.clone();

            savedProject.tab.id = savedProjectId;
            savedProject.tab.saved_project_id = savedProjectId;
            savedProject.tab.saved_at = new Date();
            savedProject.tab.name = options.name || savedProject.tab.name || 'Untitled Project';

            const index = this.items.findIndex((item) => item.tab.id === savedProjectId);

            if (index === -1) {
                this.items.push(savedProject);
            } else {
                this.items[index] = savedProject;
            }

            project.$patch((state) => {
                state.modified = false;
                state.tab.saved_project_id = savedProjectId;
                state.tab.name = savedProject.tab.name;
            });

            return savedProject;
        },

        /**
         * Mark the given saved project as recently opened.
         *
         * @param {*} project
         */
        touch(project) {
            const savedProject = this.findById(project.tab.id);

            if (savedProject) {
                savedProject.tab.opened_at = new Date();
            }
        },

        /**
         * Remove the given saved project.
         *
         * @param {*} project
         */
        remove(project) {
            const index = this.items.findIndex((item) => item.tab.id === project.tab.id);

            if (index !== -1) {
                this.items.splice(index, 1);
            }
        },

        /**
         * Rename the given saved project.
         *
         * @param {*} project
         * @param {String} name
         */
        rename(project, name) {
            const savedProject = this.findById(project.tab.id);

            if (savedProject) {
                savedProject.tab.name = name;
            }
        },

        /**
         * Find a saved project by its ID.
         *
         * @param {String} id
         *
         * @returns {*|null}
         */
        findById(id) {
            return this.items.find((item) => item.tab.id === id) || null;
        },
    },

    persist: {
        key: 'saved-projects',
        storage: import.meta.client ? localStorage : undefined,
    },
});
