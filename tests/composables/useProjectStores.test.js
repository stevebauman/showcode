import { describe, it, expect, beforeEach } from 'vitest';
import useProjectStores from '~/composables/useProjectStores';
import useCurrentTab from '~/composables/useCurrentTab';

describe('useProjectStores', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('adds a new project', () => {
        const { projects, addNewProject } = useProjectStores();

        expect(projects.value).toHaveLength(0);

        addNewProject();

        expect(projects.value).toHaveLength(1);
    });

    it('sets the new project as the current tab', () => {
        const { addNewProject } = useProjectStores();
        const { currentTab } = useCurrentTab();

        const project = addNewProject();

        expect(currentTab.value).toBe(project.tab.id);
    });

    it('adds multiple projects', () => {
        const { projects, addNewProject } = useProjectStores();

        addNewProject();
        addNewProject();
        addNewProject();

        expect(projects.value).toHaveLength(3);
    });

    it('finds a project by tab ID', () => {
        const { addNewProject, findProjectByTabId } = useProjectStores();

        const project = addNewProject();

        expect(findProjectByTabId(project.tab.id)).toBe(project);
    });

    it('returns undefined when finding a project by non-existent tab ID', () => {
        const { addNewProject, findProjectByTabId } = useProjectStores();

        addNewProject();

        expect(findProjectByTabId('non-existent')).toBeUndefined();
    });

    it('returns the current project', () => {
        const { addNewProject, currentProject } = useProjectStores();

        const project = addNewProject();

        expect(currentProject.value).toBe(project);
    });

    it('deletes a project', () => {
        const { projects, addNewProject, deleteProject } = useProjectStores();

        const project = addNewProject();

        deleteProject(project);

        // Deleting the last project auto-creates a new one.
        expect(projects.value).toHaveLength(1);
        expect(projects.value[0].tab.id).not.toBe(project.tab.id);
    });

    it('switches to the next project when deleting the current one', () => {
        const { addNewProject, deleteProject } = useProjectStores();
        const { currentTab } = useCurrentTab();

        const first = addNewProject();
        const second = addNewProject();

        // Switch back to the first tab.
        currentTab.value = first.tab.id;

        deleteProject(first);

        expect(currentTab.value).toBe(second.tab.id);
    });

    it('switches to the previous project when deleting the last tab', () => {
        const { addNewProject, deleteProject } = useProjectStores();
        const { currentTab } = useCurrentTab();

        const first = addNewProject();
        const second = addNewProject();

        // Second tab is active (it was just created).
        expect(currentTab.value).toBe(second.tab.id);

        deleteProject(second);

        expect(currentTab.value).toBe(first.tab.id);
    });

    it('does not switch tabs when deleting a non-active project', () => {
        const { addNewProject, deleteProject } = useProjectStores();
        const { currentTab } = useCurrentTab();

        const first = addNewProject();
        const second = addNewProject();

        // Second is active.
        expect(currentTab.value).toBe(second.tab.id);

        deleteProject(first);

        // Should remain on the second tab.
        expect(currentTab.value).toBe(second.tab.id);
    });

    it('auto-creates a new project when deleting the only project', () => {
        const { projects, addNewProject, deleteProject } = useProjectStores();
        const { currentTab } = useCurrentTab();

        const project = addNewProject();

        deleteProject(project);

        expect(projects.value).toHaveLength(1);
        expect(projects.value[0].tab.id).not.toBe(project.tab.id);
        expect(currentTab.value).toBe(projects.value[0].tab.id);
    });

    it('does nothing when deleting a project that does not exist', () => {
        const { projects, addNewProject, deleteProject } = useProjectStores();

        addNewProject();

        deleteProject({ tab: { id: 'non-existent' } });

        expect(projects.value).toHaveLength(1);
    });

    it('duplicates a project', () => {
        const { projects, addNewProject, duplicateProject } = useProjectStores();
        const { currentTab } = useCurrentTab();

        const project = addNewProject();

        project.$patch({
            page: { editors: [{ code: 'echo "Hello";' }] },
            settings: { themeName: 'github-dark' },
            tab: { name: 'Original Project' },
        });

        const duplicate = duplicateProject(project);

        expect(projects.value).toHaveLength(2);
        expect(projects.value[1].tab.id).not.toBe(project.tab.id);
        expect(duplicate.tab.name).toBe('Original Project');
        expect(duplicate.page).toEqual(project.page);
        expect(duplicate.settings).toEqual(project.settings);
        expect(currentTab.value).toBe(duplicate.tab.id);
    });

    it('adds a project from a saved project', () => {
        const { projects, addProjectFromSavedProject } = useProjectStores();
        const { currentTab } = useCurrentTab();

        const savedProject = {
            version: '1.26.1',
            page: { editors: [{ code: 'echo "Saved";' }] },
            settings: { themeName: 'github-dark' },
            tab: {
                id: 'saved-project',
                name: 'Saved Project',
            },
        };

        const project = addProjectFromSavedProject(savedProject);

        expect(projects.value).toHaveLength(1);
        expect(project.tab.id).not.toBe(savedProject.tab.id);
        expect(project.tab.saved_project_id).toBe(savedProject.tab.id);
        expect(project.tab.name).toBe('Saved Project');
        expect(project.page).toEqual(savedProject.page);
        expect(project.settings).toEqual(savedProject.settings);
        expect(project.modified).toBe(false);
        expect(currentTab.value).toBe(project.tab.id);
    });
});
