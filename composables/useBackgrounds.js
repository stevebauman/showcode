import { computed, ref, useContext } from '@nuxtjs/composition-api';
import { gradients } from '~/data/gradients';

export const DEFAULT_BACKGROUND = 'candy';

export default function () {
    const backgrounds = ref([]);

    const { $memory } = useContext();

    backgrounds.value.push(...gradients);

    const defaultBackground = computed(() =>
        backgrounds.value.find(({ name }) => name === DEFAULT_BACKGROUND)
    );

    const fetchCustom = async () => await $memory.settings.get('backgrounds');

    const loadCustom = async () => {
        const custom = await fetchCustom();

        backgrounds.value.push(
            ...custom.value
                .toCollection()
                .map((bg, key) => ({
                    name: key,
                    class: `${bg.direction} from-${bg.from} via-${bg.via} to-${bg.to}`,
                }))
                .toArray()
        );
    };

    return {
        loadCustom,
        backgrounds,
        defaultBackground,
    };
}
