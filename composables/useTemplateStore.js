import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import useIndexedDb from './useIndexedDb';
import useSettingsStore from './useSettingsStore';

function safeParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.warn('Failed to parse legacy templates from localStorage.', error);

        return fallback;
    }
}

const oldLocalTemplates = import.meta.client ? window.localStorage.getItem('templates') : null;

const storage = useIndexedDb('templates', safeParse(oldLocalTemplates, []));

if (import.meta.client) {
    window.localStorage.removeItem('templates');
}

export default defineStore('templates', () => {
    const templates = ref(Array.isArray(storage.value) ? storage.value : []);
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
            templates.value = Array.isArray(value) ? value : [];
        },
        { deep: true }
    );

    watch(
        templates,
        (value) => {
            if (syncingFromStorage) {
                syncingFromStorage = false;

                return;
            }

            syncingToStorage = true;
            storage.value = value;
        },
        { deep: true }
    );

    function all() {
        return templates.value;
    }

    function add(template) {
        templates.value.push(template);
    }

    function remove(template) {
        const index = templates.value.findIndex((t) => t.tab.id === template.tab.id);

        if (index !== -1) {
            templates.value.splice(index, 1);

            const settings = useSettingsStore();

            if (settings.getDefaultTemplate() === template.tab.id) {
                settings.clearDefaultTemplate();
            }
        }
    }

    function findById(templateId) {
        return templates.value.find((t) => t.tab.id === templateId) || null;
    }

    function getDefault() {
        const settings = useSettingsStore();
        const defaultTemplateId = settings.getDefaultTemplate();

        if (!defaultTemplateId) {
            return null;
        }

        return findById(defaultTemplateId);
    }

    function setAsDefault(template) {
        const settings = useSettingsStore();

        settings.setDefaultTemplate(template.tab.id);
    }

    function clearAsDefault() {
        const settings = useSettingsStore();

        settings.clearDefaultTemplate();
    }

    function rename(template, newName) {
        const index = templates.value.findIndex((t) => t.tab.id === template.tab.id);

        if (index !== -1) {
            templates.value[index].tab.name = newName;
        }
    }

    function isDefault(template) {
        const settings = useSettingsStore();

        return settings.getDefaultTemplate() === template.tab.id;
    }

    return {
        templates,
        all,
        add,
        remove,
        findById,
        getDefault,
        setAsDefault,
        clearAsDefault,
        rename,
        isDefault,
    };
});
