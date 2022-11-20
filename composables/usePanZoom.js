import Panzoom from '@panzoom/panzoom';
import { onBeforeUnmount, ref, unref } from 'vue';

export default function (options = {}) {
    const zoom = ref(1);
    const panzoom = ref(null);

    const createPanZoom = (element) => (panzoom.value = Panzoom(unref(element), options));

    const destroyPanZoom = () => panzoom.value?.destroy();

    const resetViewport = () => {
        zoom.value = 1;
        panzoom.value?.reset();
    };

    const zoomTo = (value) => {
        zoom.value = value;
        panzoom.value?.zoom(value);
    };

    onBeforeUnmount(destroyPanZoom);

    return {
        zoom,
        zoomTo,
        panzoom,
        resetViewport,
        createPanZoom,
        destroyPanZoom,
    };
}
