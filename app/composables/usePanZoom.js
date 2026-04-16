import { debounce } from 'lodash';
import Panzoom from '@panzoom/panzoom';
import { onBeforeUnmount, ref, unref } from 'vue';

export default function (viewport, options = {}) {
    const zoom = ref(viewport.zoom ?? 1);
    const panzoom = ref(null);
    let element = null;

    const syncViewport = debounce(() => {
        if (!panzoom.value) return;

        const { x, y } = panzoom.value.getPan();

        viewport.x = x;
        viewport.y = y;
        viewport.zoom = zoom.value;
    }, 300);

    function createPanZoom(elementRef) {
        element = unref(elementRef);

        panzoom.value = Panzoom(element, {
            ...options,
            startX: viewport.x ?? 0,
            startY: viewport.y ?? options.startY ?? 0,
            startScale: viewport.zoom ?? 1,
        });

        element.addEventListener('panzoomend', syncViewport);
        element.addEventListener('panzoomzoom', syncViewport);
    }

    function destroyPanZoom() {
        if (element) {
            element.removeEventListener('panzoomend', syncViewport);
            element.removeEventListener('panzoomzoom', syncViewport);
        }

        syncViewport.cancel();

        return panzoom.value?.destroy();
    }

    function resetViewport() {
        zoom.value = 1;
        panzoom.value?.reset();

        viewport.x = 0;
        viewport.y = options.startY ?? 0;
        viewport.zoom = 1;
    }

    function zoomTo(value) {
        zoom.value = value;
        panzoom.value?.zoom(value);
        syncViewport();
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
