import { describe, it, expect, beforeEach } from 'vitest';
import useCurrentTab from '~/composables/useCurrentTab';

describe('useCurrentTab', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('starts with an empty current tab', () => {
        const { currentTab } = useCurrentTab();

        expect(currentTab.value).toBe('');
    });

    it('sets the tab from a project', () => {
        const { currentTab, setTabFromProject } = useCurrentTab();

        setTabFromProject({ tab: { id: 'test-id' } });

        expect(currentTab.value).toBe('test-id');
    });

    it('does not change the tab when project is null', () => {
        const { currentTab, setTabFromProject } = useCurrentTab();

        setTabFromProject({ tab: { id: 'existing-id' } });
        setTabFromProject(null);

        expect(currentTab.value).toBe('existing-id');
    });

    it('determines if a project is active', () => {
        const { setTabFromProject, projectIsActive } = useCurrentTab();

        const project = { tab: { id: 'active-id' } };

        setTabFromProject(project);

        expect(projectIsActive(project)).toBe(true);
        expect(projectIsActive({ tab: { id: 'other-id' } })).toBe(false);
    });
});

