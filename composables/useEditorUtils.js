import { unref } from '@nuxtjs/composition-api';
import usePreferencesStore from '@/composables/usePreferencesStore';

export default function () {
    const preferences = usePreferencesStore();

    function stripInitialPhpTag(value) {
        return value.replace('<?php', '').replace(/(\n*)/, '');
    }

    function getCodeFromEditors(editors) {
        return unref(editors).map(({ id, language, value, added, removed, focused }) => {
            const shouldStripInitialPhpTag = preferences.stripIntialPhpTag && language === 'php';

            let newValue = shouldStripInitialPhpTag ? stripInitialPhpTag(value) : value;

            let lineOffset = 0;

            if (shouldStripInitialPhpTag) {
                const matches = value.replace('<?php', '').match(/(\n+)/);

                if (matches) {
                    lineOffset = matches[0].split(/\n/g).length - 1;
                }
            }

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
