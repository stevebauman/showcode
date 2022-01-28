import { computed, ref } from '@nuxtjs/composition-api';
import { gradients } from '~/data/gradients';

export const DEFAULT_BACKGROUND = 'candy';

export default function () {
    const backgrounds = ref([]);

    backgrounds.value.push(...gradients);

    const defaultBackground = computed(() =>
        backgrounds.value.find(({ name }) => name === DEFAULT_BACKGROUND)
    );

    return {
        backgrounds,
        defaultBackground,
    };
}
