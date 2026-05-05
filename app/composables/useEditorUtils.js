import { unref } from 'vue';
import usePreferencesStore from '@/composables/usePreferencesStore';

export default function () {
    const preferences = usePreferencesStore();

    function stripInitialPhpTag(value) {
        return value.replace(/^<\?php\s*/, '');
    }

    function getCodeFromEditors(editors) {
        return unref(editors).map(({ id, language, value, added, removed, focused }) => {
            const shouldStripInitialPhpTag = preferences.stripIntialPhpTag && language === 'php';

            const newValue = shouldStripInitialPhpTag ? stripInitialPhpTag(value) : value;

            const lineOffset = shouldStripInitialPhpTag
                ? value.split('\n').length - newValue.split('\n').length
                : 0;

            // prettier-ignore
            return {
                id,
                value: newValue,
                added: added?.map(line => line - lineOffset) || [],
                removed: removed?.map(line => line - lineOffset) || [],
                focused: focused?.map(line => line - lineOffset) || [],
            };
        });
    }

    function getLanguagesFromEditors(editors) {
        return unref(editors).map(({ id, language }) => ({
            id,
            name: language,
        }));
    }

    return { stripInitialPhpTag, getCodeFromEditors, getLanguagesFromEditors };
}
