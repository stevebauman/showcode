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
        values.push(...settings.displayableBackgrounds);

        return values;
    });

    const defaultBackground = computed(() =>
        backgrounds.value.find(({ name }) => name === DEFAULT_BACKGROUND)
    );

    const addCustomBackground = (attrs) => {
        const id = uuid();

        settings.backgrounds.push({ id, ...attrs });

        return id;
    };

    const deleteCustomBackground = async (id) => {
        const index = settings.backgrounds.findIndex((background) => background.id === id);

        if (index !== false) {
            settings.backgrounds.splice(index, 1);
        }
    };

    const getBackgroundAttrs = (background) => {
        if (!backgrounds.value.length) {
            return {};
        }

        const { name, ...attrs } = collect(backgrounds.value).first(
            ({ name }) => name === background,
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
