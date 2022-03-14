import collect from 'collect.js';
import { v4 as uuid } from 'uuid';
import { gradients } from '~/data/gradients';
import { computed, ref, useContext } from '@nuxtjs/composition-api';

export const DEFAULT_BACKGROUND = 'candy';

export default function () {
    const backgrounds = ref([]);

    const { $memory } = useContext();

    const defaultBackground = computed(() =>
        backgrounds.value.find(({ name }) => name === DEFAULT_BACKGROUND)
    );

    const addCustomBackground = async (attrs) => {
        const id = uuid();

        await $memory.settings.sync('backgrounds', (record) => record.set(id, attrs));

        return id;
    };

    const fetchCustomBackgrounds = async () => await $memory.settings.get('backgrounds');

    const loadBackgrounds = async () => {
        backgrounds.value = [];
        backgrounds.value.push(...gradients);

        const custom = await fetchCustomBackgrounds();

        backgrounds.value.push(
            ...custom
                .toCollection()
                .map((attrs, key) => ({
                    name: key,
                    custom: true,
                    ...attrs,
                }))
                .toArray()
        );
    };

    const deleteCustomBackground = async (id) => {
        await $memory.settings.sync('backgrounds', (backgrounds) => backgrounds.remove(id));

        await loadBackgrounds();
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
        loadBackgrounds,
        getBackgroundAttrs,
        addCustomBackground,
        deleteCustomBackground,
    };
}
