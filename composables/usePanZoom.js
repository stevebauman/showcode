import Panzoom from '@panzoom/panzoom';
import { onBeforeUnmount, ref, unref } from '@nuxtjs/composition-api';

export default function (options = {}) {
    const zoom = ref(1);
    const panzoom = ref(null);

    function createPanZoom(element) {
        panzoom.value = Panzoom(unref(element), options);
    }

    function destroyPanZoom() {
        return panzoom.value?.destroy();
    }

    function resetViewport() {
        zoom.value = 1;
        panzoom.value?.reset();
    }

    function zoomTo(value) {
        zoom.value = value;
        panzoom.value?.zoom(value);
    }

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
