import { reactive } from 'vue';
import { cloneDeep, defaults as applyDefaults, pick } from 'lodash';
import { createSettings } from '~/lib/settings';
import usePreferencesStore from '~/composables/usePreferencesStore';

export default function (defaults = {}) {
    const settingsDefaults = createSettings(usePreferencesStore());

    const settings = reactive(
        pick(applyDefaults(cloneDeep(defaults), settingsDefaults), Object.keys(settingsDefaults))
    );

    return { settings, settingsDefaults };
}
