import { reactive, toRefs, watch } from 'vue';
import collect from 'collect.js';
import { isArray } from 'lodash';
import { defineStore } from 'pinia';
import useIndexedDb from './useIndexedDb';

function mapBackgroundsToArray(backgrounds) {
    return collect(backgrounds)
        .map((attrs, id) => ({
            id,
            ...attrs,
        }))
        .toArray();
}

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.warn('Failed to parse legacy settings from localStorage.', error);

        return fallback;
    }
}

function normalizeState(value = {}) {
    return {
        tab: value.tab ?? '',
        defaultTemplate: value.defaultTemplate ?? null,
        backgrounds: isArray(value.backgrounds)
            ? value.backgrounds
            : mapBackgroundsToArray(value.backgrounds ?? []),
    };
}

function getOldBackgrounds() {
    if (!import.meta.client) {
        return [];
    }

    return mapBackgroundsToArray(safeParse(window.localStorage.getItem('settings/backgrounds'), []));
}

const storage = useIndexedDb('settings', {
    tab: '',
    defaultTemplate: null,
    backgrounds: getOldBackgrounds(),
});

if (import.meta.client) {
    window.localStorage.removeItem('settings/backgrounds');
}

export default defineStore('settings', () => {
    const state = reactive(normalizeState(storage.value));
    let syncingFromStorage = false;
    let syncingToStorage = false;

    watch(
        storage,
        (value) => {
            if (syncingToStorage) {
                syncingToStorage = false;

                return;
            }

            syncingFromStorage = true;
            Object.assign(state, normalizeState(value));
        },
        { deep: true }
    );

    watch(
        state,
        (value) => {
            if (syncingFromStorage) {
                syncingFromStorage = false;

                return;
            }

            syncingToStorage = true;
            storage.value = normalizeState(value);
        },
        { deep: true }
    );

    function addBackground(id, attrs) {
        state.backgrounds.push({ ...attrs, id });
    }

    function deleteBackground(id) {
        const index = state.backgrounds.findIndex((bg) => bg?.id === id);

        if (index !== -1) {
            state.backgrounds.splice(index, 1);
        }
    }

    function getDisplayableBackgrounds() {
        return collect(state.backgrounds)
            .map((attrs, id) => ({
                id,
                custom: true,
                ...attrs,
            }))
            .toArray();
    }

    function setDefaultTemplate(templateId) {
        state.defaultTemplate = templateId;
    }

    function getDefaultTemplate() {
        return state.defaultTemplate;
    }

    function clearDefaultTemplate() {
        state.defaultTemplate = null;
    }

    return {
        ...toRefs(state),
        addBackground,
        deleteBackground,
        getDisplayableBackgrounds,
        setDefaultTemplate,
        getDefaultTemplate,
        clearDefaultTemplate,
    };
});
