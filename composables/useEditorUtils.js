import { unref } from '@nuxtjs/composition-api';
import usePreferencesStore from '@/composables/usePreferencesStore';

export default function () {
    const preferences = usePreferencesStore();

    const stripInitialPhpTag = (value) => value.replace('<?php', '').replace(/(\n*)/, '');

    const generateCodeFromEditors = (editors) => {
        return unref(editors).map(({ id, value, added, removed, focused }) => {
            let newValue = preferences.stripIntialPhpTag ? stripInitialPhpTag(value) : value;

            let lineOffset = 0;

            if (preferences.stripIntialPhpTag) {
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
    };

    const generateLanguagesFromEditors = (editors) => {
        return unref(editors).map(({ id, language }) => ({
            id,
            name: language,
        }));
    };

    return { stripInitialPhpTag, generateCodeFromEditors, generateLanguagesFromEditors };
}
