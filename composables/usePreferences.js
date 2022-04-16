import { debounce, cloneDeep } from 'lodash';
import { reactive, useContext, watch, onMounted } from '@nuxtjs/composition-api';

export default function () {
    const defaults = {
        editorTabSize: 4,
        editorLanguage: 'php',
        editorOrientation: 'left',
        editorInitialValue: '<?php\n\n',
        stripIntialPhpTag: true,
    };

    const preferences = reactive(cloneDeep(defaults));

    const { $bus, $memory } = useContext();

    const getPreference = async (key) => {
        return (await $memory.settings.get('preferences')).get(key, defaults[key]);
    };

    const syncPreferences = async (values) => {
        await $memory.settings.sync('preferences', (record) => record.fill(values));

        $bus.$emit('preferences:updated');
    };

    watch(preferences, debounce(syncPreferences, 500));

    onMounted(async () => {
        const values = (await $memory.settings.get('preferences')).all();

        Object.keys(values).forEach((value, key) => (preferences[key] = value));
    });

    return {
        preferences,
        getPreference,
    };
}
