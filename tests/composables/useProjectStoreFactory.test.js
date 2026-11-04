import { describe, it, expect, beforeEach, vi } from 'vitest';
import useProjectStoreFactory from '~/composables/useProjectStoreFactory';
import useTemplateStore from '~/composables/useTemplateStore';
import { namespace } from '~/composables/useProjectStores';

const saveFile = vi.hoisted(() => vi.fn());
vi.mock('~/composables/useFileDialogs', () => ({ default: () => ({ saveFile }) }));

describe('useProjectStoreFactory', () => {
    beforeEach(() => {
        localStorage.clear();

        useTemplateStore().$reset();
        saveFile.mockClear();
    });

    it('creates a store with default state', () => {
        const store = useProjectStoreFactory(`${namespace}test-id`)();

        expect(store.tab.id).toBe('test-id');
        expect(store.tab.name).toBeNull();
        expect(store.tab.order).toBe(0);
        expect(store.modified).toBe(false);
    });

    it('excludes editor-only line number visibility from API exports', () => {
        const store = useProjectStoreFactory(`${namespace}export-line-numbers`)();
        store.page.editors = [
            { id: 'first', value: '<?php', language: 'php', tabSize: 4, showLineNumbers: false },
        ];
        store.settings.showLineNumbers = true;

        store.exportForApi();

        expect(JSON.parse(saveFile.mock.lastCall[0])).toEqual({
            settings: { showLineNumbers: true },
            editors: [{ value: '<?php', language: 'php' }],
        });
    });

    it('strips the namespace from the tab ID', () => {
        const store = useProjectStoreFactory(`${namespace}my-project`)();

        expect(store.tab.id).toBe('my-project');
    });

    it('clones a project with a new tab ID', () => {
        const store = useProjectStoreFactory(`${namespace}original`)();

        store.tab.name = 'My Project';

        const clone = store.clone();

        expect(clone.tab.id).not.toBe('original');
        expect(clone.tab.name).toBe('My Project');
    });

    it('saves as a template', () => {
        const templates = useTemplateStore();
        const store = useProjectStoreFactory(`${namespace}test`)();

        store.tab.name = 'Test Project';

        store.saveAsTemplate();

        expect(templates.all()).toHaveLength(1);
        expect(templates.all()[0].tab.name).toBe('Test Project');
        expect(templates.all()[0].tab.id).not.toBe('test');
    });

    it('uses "Untitled Project" when saving a nameless project as template', () => {
        const templates = useTemplateStore();
        const store = useProjectStoreFactory(`${namespace}nameless-test`)();

        store.saveAsTemplate();

        const saved = templates.all().find((t) => t.tab.name === 'Untitled Project');

        expect(saved).toBeTruthy();
    });
});
