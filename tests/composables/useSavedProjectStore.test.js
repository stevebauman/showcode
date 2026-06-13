import { describe, it, expect, beforeEach } from 'vitest';
import useSavedProjectStore from '~/composables/useSavedProjectStore';
import useProjectStoreFactory from '~/composables/useProjectStoreFactory';
import { namespace } from '~/composables/useProjectStores';

describe('useSavedProjectStore', () => {
    let savedProjects;

    beforeEach(() => {
        localStorage.clear();

        savedProjects = useSavedProjectStore();

        savedProjects.$reset();
    });

    it('starts with no saved projects', () => {
        expect(savedProjects.all()).toEqual([]);
    });

    it('saves a project', () => {
        const project = useProjectStoreFactory(`${namespace}project`)();

        project.tab.name = 'My Project';
        project.page = { editors: [{ code: 'echo "Hello";' }] };
        project.settings = { themeName: 'github-dark' };
        project.modified = true;

        const savedProject = savedProjects.save(project);

        expect(savedProjects.all()).toHaveLength(1);
        expect(savedProject.tab.name).toBe('My Project');
        expect(savedProject.tab.id).toBe(project.tab.saved_project_id);
        expect(savedProject.page).toEqual(project.page);
        expect(savedProject.settings).toEqual(project.settings);
        expect(project.modified).toBe(false);
    });

    it('updates an existing saved project', () => {
        const project = useProjectStoreFactory(`${namespace}project`)();

        project.tab.name = 'Original Name';

        const firstSave = savedProjects.save(project);

        project.tab.name = 'Updated Name';

        const secondSave = savedProjects.save(project);

        expect(savedProjects.all()).toHaveLength(1);
        expect(secondSave.tab.id).toBe(firstSave.tab.id);
        expect(savedProjects.findById(firstSave.tab.id).tab.name).toBe('Updated Name');
    });

    it('forces a new saved project', () => {
        const project = useProjectStoreFactory(`${namespace}project`)();

        project.tab.name = 'Original Name';

        const firstSave = savedProjects.save(project);
        const secondSave = savedProjects.save(project, { force: true, name: 'Copied Name' });

        expect(savedProjects.all()).toHaveLength(2);
        expect(secondSave.tab.id).not.toBe(firstSave.tab.id);
        expect(secondSave.tab.name).toBe('Copied Name');
        expect(project.tab.saved_project_id).toBe(secondSave.tab.id);
        expect(project.tab.name).toBe('Copied Name');
        expect(project.modified).toBe(false);
    });

    it('removes a saved project', () => {
        const project = useProjectStoreFactory(`${namespace}project`)();
        const savedProject = savedProjects.save(project);

        savedProjects.remove(savedProject);

        expect(savedProjects.all()).toHaveLength(0);
    });

    it('renames a saved project', () => {
        const project = useProjectStoreFactory(`${namespace}project`)();
        const savedProject = savedProjects.save(project);

        savedProjects.rename(savedProject, 'New Name');

        expect(savedProjects.findById(savedProject.tab.id).tab.name).toBe('New Name');
    });
});
