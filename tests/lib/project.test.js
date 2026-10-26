import { describe, expect, it } from 'vitest';
import { createEditor, createProject, normalizeProject } from '~/lib/project';
import { defaults as preferences } from '~/composables/usePreferencesStore';

describe('projects', () => {
    it('creates a complete project from the current preferences without rendering a component', () => {
        const project = createProject(
            {
                ...preferences,
                editorLanguage: 'javascript',
                editorInitialValue: 'const count = 1;',
                editorOrientation: 'right',
                previewFontSize: 20,
            },
            'project-id'
        );

        expect(project.tab.id).toBe('project-id');
        expect(project.page.orientation).toBe('right');
        expect(project.page.sizes).toEqual([40, 60]);
        expect(project.page.editors).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                language: 'javascript',
                value: 'const count = 1;',
                added: [],
                removed: [],
                focused: [],
            }),
        ]);
        expect(project.settings.fontSize).toBe(20);
        expect(project.settings.borderColor).toEqual({ red: 0, green: 0, blue: 0, alpha: 1 });
    });

    it('keeps mutable defaults independent between projects and editors', () => {
        const first = createProject(preferences);
        const second = createProject(preferences);
        const editor = createEditor(preferences);

        first.page.editors[0].added.push(2);
        first.settings.borderColor.red = 200;
        first.page.sizes[0] = 20;

        expect(second.page.editors[0].added).toEqual([]);
        expect(editor.added).toEqual([]);
        expect(second.settings.borderColor.red).toBe(0);
        expect(second.page.sizes).toEqual([40, 60]);
        expect(second.tab.id).not.toBe(first.tab.id);
    });

    it('normalizes an old project without changing its source or existing content', () => {
        const source = {
            tab: { id: 'legacy', name: 'Old project' },
            page: {
                orientation: 'portrait',
                editors: [{ id: 'old-editor', value: 'saved code', language: 'php' }],
            },
            settings: { fontSize: 22, background: 'custom-background' },
        };
        const project = normalizeProject(source, preferences);

        expect(project.page.orientation).toBe('left');
        expect(project.page.editors[0]).toMatchObject({
            id: 'old-editor',
            value: 'saved code',
            language: 'php',
            tabSize: 4,
            added: [],
            removed: [],
            focused: [],
        });
        expect(project.settings.fontSize).toBe(22);
        expect(project.settings.background).toBe('custom-background');
        expect(project.settings.showHeader).toBe(true);
        expect(project.viewport).toEqual({ x: 0, y: -150, zoom: 1 });
        expect(source.page.orientation).toBe('portrait');
        expect(source.page.editors[0].added).toBeUndefined();
        expect(source.settings.showHeader).toBeUndefined();
        expect(normalizeProject(project, preferences)).toEqual(project);
    });

    it('preserves saved layout, editor markers, and metadata when filling missing fields', () => {
        const source = {
            version: '1.26.1',
            modified: true,
            tab: { id: 'saved', saved_project_id: 'original', order: 3 },
            viewport: { x: 20, y: 30, zoom: 1.5 },
            page: {
                orientation: 'bottom',
                sizes: [30, 70],
                editorSizes: [60, 40],
                editors: [
                    { id: 'one', value: 'first', added: [1], removed: [2], focused: [3] },
                    { id: 'two', value: 'second', tabSize: 2 },
                ],
            },
            settings: { width: 1200, height: 900, image: 'saved-thumbnail' },
        };
        const project = normalizeProject(source, preferences);

        expect(project).toMatchObject(source);
        expect(project.page.editors[1].focused).toEqual([]);
        expect(project.settings.fontFamily).toBe(preferences.previewFontFamily);
    });

    it('assigns equal split sizes when an older project has multiple editors but no saved sizes', () => {
        const project = normalizeProject(
            {
                tab: {},
                page: { editors: [{ value: 'first' }, { value: 'second' }] },
                settings: {},
            },
            preferences
        );

        expect(project.page.editorSizes).toEqual([50, 50]);
    });

    it('initializes an empty editor list before the project reaches a component', () => {
        const project = normalizeProject(
            { tab: {}, page: { editors: [] }, settings: {} },
            preferences
        );

        expect(project.page.editors).toHaveLength(1);
        expect(project.page.editors[0].value).toBe(preferences.editorInitialValue);
    });

    it.each([
        null,
        { page: {}, settings: {} },
        { tab: {}, page: {}, settings: [] },
        { tab: {}, page: { editors: 'code' }, settings: {} },
        { tab: {}, page: { editors: [null] }, settings: {} },
    ])('rejects invalid project structure: %j', (data) => {
        expect(() => normalizeProject(data, preferences)).toThrow();
    });
});
