import { v4 as uuid } from 'uuid';
import { fileDialog } from 'file-select-dialog';
import useCurrentTab from './useCurrentTab';
import useProjectStoreFactory from './useProjectStoreFactory';
import useTemplateStore from './useTemplateStore';
import { computed, ref } from 'vue';
import { has, head, sortBy, debounce, startsWith, cloneDeep } from 'lodash';

export const namespace = 'pages/';

export default function () {
    const { $bus } = useNuxtApp();

    const { currentTab, setTabFromProject } = useCurrentTab();

    const projects = ref([]);

    const currentProject = computed(() => {
        return findProjectByTabId(currentTab.value);
    });

    /**
     * Make a new project store.
     *
     * @param {String} id
     *
     * @returns {Store}
     */
    function makeProjectStore(id = null) {
        id = id ?? uuid();

        const name = startsWith(id, namespace) ? id : namespace + id;

        return useProjectStoreFactory(name)();
    }

    /**
     * Add a new project.
     *
     * @param {string|null} id
     *
     * @returns {Store|null}
     */
    function addNewProject(id = null) {
        const templates = useTemplateStore();

        const defaultTemplate = templates.getDefault();

        const newProject = makeProjectStore(id);

        projects.value.push(newProject);

        setTabFromProject(newProject);

        // Apply default template if one is set
        if (defaultTemplate) {
            syncProjectStateWithData(newProject, cloneDeep(defaultTemplate));
        }

        return newProject;
    }

    /**
     * Sync the project state with the given data.
     *
     * @param {Store} project
     * @param {*} data
     */
    function syncProjectStateWithData(project, data) {
        project.$patch((state) => {
            state.page = data.page;
            state.settings = data.settings;
            state.tab.name = data.tab.name;

            // Here we will port old editors that don't contain the newly added
            // properties from the new v1.9.0 update. v1.9.0 has also added a
            // new "version" property to projects, so we can target this
            // property to determine if we need to add these attributes.
            if (!data.hasOwnProperty('version')) {
                state.page.editors.map((editor) => {
                    editor.added = [];
                    editor.removed = [];
                    editor.focused = [];
                });
            }

            // Here we will port the old orientation setting,
            // so templates that were saved in an older
            // version can be restored properly.
            if (['portrait', 'landscape'].includes(state.page.orientation)) {
                state.page.orientation = 'left';
            }
        });
    }

    /**
     * Attempt to import a new project from a JSON file.
     */
    async function importNewProject() {
        const files = await fileDialog({ accept: '.json' });

        const file = head(files);

        if (!file) {
            return;
        }

        const data = await new Response(file).json();

        ['tab', 'page', 'settings'].forEach((requiredKey) => {
            if (!has(data, requiredKey)) {
                $bus.$emit(
                    'alert',
                    'danger',
                    'Error importing configuration. Required data is missing.'
                );

                console.error(`The configuration file is missing the data key [${requiredKey}].`);
            }
        });

        const project = addNewProject();

        if (project) {
            syncProjectStateWithData(project, data);
        }
    }

    /**
     * Add a new project from the given template.
     *
     * @param {*} template
     *
     * @returns {Store}
     */
    function addProjectFromTemplate(template) {
        const data = cloneDeep(template);

        const project = addNewProject();

        if (project) {
            syncProjectStateWithData(project, data);
        }
    }

    /**
     * Find a project by its tab ID.
     *
     * @param {String} tabId
     *
     * @returns {Store|null}
     */
    function findProjectByTabId(tabId) {
        return projects.value.find((project) => project.tab.id === tabId);
    }

    /**
     * Duplicate a project.
     *
     * @param {Store} project
     */
    function duplicateProject(project) {
        const data = cloneDeep(project);

        const newProject = addNewProject();

        if (newProject) {
            syncProjectStateWithData(newProject, data);
        }
    }

    /**
     * Delete a project.
     *
     * @param {Store} project
     */
    function deleteProject(project) {
        const index = projects.value.findIndex((p) => p.tab.id === project.tab.id);

        if (index === -1) {
            return;
        }

        projects.value.splice(index, 1);

        if (projects.value.length === 0) {
            addNewProject();
        } else if (currentTab.value === project.tab.id) {
            // Only switch tabs if we're closing the currently active
            // project. We'll try to switch to the next project,
            // or the previous one if we were at the end.
            setTabFromProject(projects.value[index] || projects.value[index - 1]);
        }

        localStorage.removeItem(project.$id);
        project.$dispose();
    }

    /**
     * Hydrate the projects from local storage.
     */
    function hydrateFromStorage() {
        const stored = Object.keys(localStorage)
            .filter((key) => key.startsWith(namespace))
            .map((key) => makeProjectStore(key));

        projects.value = sortBy(stored, ({ tab }) => tab.order ?? tab.created_at);
    }

    /**
     * Sync the project tab order when they have changed.
     */
    const syncTabOrder = debounce(() => {
        projects.value.map((project, index) => {
            project.$patch((state) => (state.tab.order = index));
        });
    }, 2500);

    return {
        projects,
        syncTabOrder,
        addNewProject,
        deleteProject,
        duplicateProject,
        currentProject,
        importNewProject,
        findProjectByTabId,
        hydrateFromStorage,
        addProjectFromTemplate,
    };
}
