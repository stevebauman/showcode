import collect from 'collect.js';
import { v4 as uuid } from 'uuid';
import { gradients } from '~/data/gradients';
import { computed } from '@nuxtjs/composition-api';
import useSettingsStore from './useSettingsStore';

export const DEFAULT_BACKGROUND = 'candy';

export default function () {
    const settings = useSettingsStore();

    const backgrounds = computed(() => {
        const values = [];

        values.push(...gradients);
        values.push(...settings.getDisplayableBackgrounds());

        return values;
    });

    const defaultBackground = computed(() =>
        backgrounds.value.find(({ id }) => id === DEFAULT_BACKGROUND)
    );

    const addCustomBackground = (attrs) => {
        const id = uuid();

        settings.addBackground(id, attrs);

        return id;
    };

    const deleteCustomBackground = (id) => {
        settings.deleteBackground(id);
    };

    const getBackgroundAttrs = (background) => {
        if (!backgrounds.value.length) {
            return {};
        }

        const { id, ...attrs } = collect(backgrounds.value).first(
            ({ id }) => id === background,
            () => defaultBackground.value
        );

        return attrs;
    };

    return {
        backgrounds,
        defaultBackground,
        getBackgroundAttrs,
        addCustomBackground,
        deleteCustomBackground,
    };
}
