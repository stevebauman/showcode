import { v4 as uuid } from 'uuid';
import { cloneDeep, defaults, isPlainObject } from 'lodash';
import { createSettings } from './settings';

export function createEditor(preferences, attributes = {}) {
    return defaults(cloneDeep(attributes), {
        id: uuid(),
        added: [],
        removed: [],
        focused: [],
        language: preferences.editorLanguage,
        tabSize: preferences.editorTabSize,
        value: preferences.editorInitialValue,
    });
}

export function createProject(preferences, id = uuid()) {
    return {
        version: '1.26.1',
        modified: false,
        page: {
            editors: [createEditor(preferences)],
            sizes: [40, 60],
            editorSizes: [100],
            previousOrientation: null,
            orientation: preferences.editorOrientation,
        },
        settings: createSettings(preferences),
        viewport: { x: 0, y: -150, zoom: 1 },
        tab: {
            kind: 'project',
            order: 0,
            name: null,
            created_at: new Date(),
            id,
        },
    };
}

export function normalizeProject(data, preferences) {
    if (
        !isPlainObject(data) ||
        !['tab', 'page', 'settings'].every((key) => isPlainObject(data[key]))
    ) {
        throw new Error('The project must contain tab, page, and settings objects.');
    }

    if (
        data.page.editors !== undefined &&
        (!Array.isArray(data.page.editors) || !data.page.editors.every(isPlainObject))
    ) {
        throw new Error('The project editors must be an array of objects.');
    }

    const initial = createProject(preferences, data.tab.id);
    const project = defaults(cloneDeep(data), initial);

    project.tab = defaults(project.tab, initial.tab);
    project.page = defaults(project.page, initial.page);
    project.settings = defaults(project.settings, initial.settings);
    project.viewport = defaults(project.viewport, initial.viewport);
    project.page.editors = project.page.editors.length
        ? project.page.editors.map((editor) => createEditor(preferences, editor))
        : initial.page.editors;

    if (!data.page.editorSizes?.length) {
        project.page.editorSizes = project.page.editors.map(
            () => 100 / project.page.editors.length
        );
    }

    if (['portrait', 'landscape'].includes(project.page.orientation)) {
        project.page.orientation = 'left';
    }

    return project;
}
