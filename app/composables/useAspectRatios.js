import { computed } from 'vue';
import usePreferencesStore from '@/composables/usePreferencesStore';

function validAspectRatio(ratio) {
    return (
        Array.isArray(ratio) &&
        ratio.length === 2 &&
        ratio.every((value) => Number.isFinite(Number(value)) && Number(value) > 0)
    );
}

function normalizeAspectRatio([x, y]) {
    return [Number(x), Number(y)];
}

export default function () {
    const preferences = usePreferencesStore();

    const aspectRatios = computed(() => {
        const ratios = preferences.previewAspectRatios
            .filter(validAspectRatio)
            .map(normalizeAspectRatio);

        return ratios.filter((ratio, index, collection) => {
            const [x, y] = ratio;

            return collection.findIndex(([rx, ry]) => rx === x && ry === y) === index;
        });
    });

    function calculateAspectRatio([x, y], height) {
        return Math.round((height / y) * x);
    }

    return {
        aspectRatios,
        calculateAspectRatio,
    };
}
