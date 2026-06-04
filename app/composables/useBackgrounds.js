import collect from 'collect.js';
import { v4 as uuid } from 'uuid';
import { computed } from 'vue';
import useSettingsStore from './useSettingsStore';
import defaultBackgrounds from '~/data/backgrounds';

export const DEFAULT_BACKGROUND = 'tailwind-dark';
export const BACKGROUND_THUMBNAIL_PATH = '/background-thumbnails';

export function backgroundThumbnailUrl(id) {
    return `${BACKGROUND_THUMBNAIL_PATH}/${id.replace(/[^a-zA-Z0-9_-]/g, '-')}.png`;
}

export default function () {
    const settings = useSettingsStore();

    const backgrounds = computed(() => {
        const values = [];

        values.push(
            ...defaultBackgrounds.map((background) => ({
                ...background,
                thumbnail: backgroundThumbnailUrl(background.id),
            }))
        );

        // Here we are inserting custom backgrounds that the
        // user has created after the default "transparent"
        // background, so that they are easily accessible
        values.splice(1, 0, ...settings.getDisplayableBackgrounds());

        return values;
    });

    const defaultBackground = computed(() =>
        backgrounds.value.find(({ id }) => id === DEFAULT_BACKGROUND)
    );

    function addCustomBackground(attrs) {
        const id = uuid();

        settings.addBackground(id, attrs);

        return id;
    }

    function deleteCustomBackground(id) {
        settings.deleteBackground(id);
    }

    function getBackgroundAttrs(background) {
        if (!backgrounds.value.length) {
            return {};
        }

        const { id, thumbnail, ...attrs } = collect(backgrounds.value).first(
            ({ id }) => id === background,
            () => defaultBackground.value
        );

        return attrs;
    }

    return {
        backgrounds,
        defaultBackground,
        getBackgroundAttrs,
        addCustomBackground,
        deleteCustomBackground,
    };
}
