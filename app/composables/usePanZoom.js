import { debounce } from 'lodash';
import Panzoom from '@panzoom/panzoom';
import { onBeforeUnmount, reactive, ref, unref } from 'vue';

export default function (viewport, options = {}) {
    const zoom = ref(viewport.zoom ?? 1);
    const panzoom = ref(null);
    const centerGuides = reactive({ x: false, y: false });
    let element = null;
    let dragging = false;

    const {
        centerSnapThreshold = 0,
        centerGuideThreshold = centerSnapThreshold * 2,
        ...panzoomOptions
    } = options;
    const centerX = panzoomOptions.startX ?? 0;
    const centerY = panzoomOptions.startY ?? 0;

    const syncViewport = debounce(() => {
        if (!panzoom.value) return;

        const { x, y } = panzoom.value.getPan();

        viewport.x = x;
        viewport.y = y;
        viewport.zoom = zoom.value;
    }, 300);

    function snapToCenter() {
        if (!panzoom.value || !centerSnapThreshold) return;

        const { x, y } = panzoom.value.getPan();
        const scale = panzoom.value.getScale();
        const snapX = Math.abs(x - centerX) * scale <= centerSnapThreshold;
        const snapY = Math.abs(y - centerY) * scale <= centerSnapThreshold;

        if (!snapX && !snapY) return;

        panzoom.value.pan(snapX ? centerX : x, snapY ? centerY : y, {
            animate: true,
            duration: 160,
            easing: 'ease-out',
        });
    }

    function hideCenterGuides() {
        centerGuides.x = false;
        centerGuides.y = false;
    }

    function onPanZoomStart() {
        dragging = true;
        hideCenterGuides();
    }

    function onPanZoomPan(event) {
        if (!dragging || !centerGuideThreshold) return;

        const { x, y, scale } = event.detail;

        centerGuides.x = Math.abs(x - centerX) * scale <= centerGuideThreshold;
        centerGuides.y = Math.abs(y - centerY) * scale <= centerGuideThreshold;
    }

    function onPanZoomEnd() {
        dragging = false;
        hideCenterGuides();
        snapToCenter();
        syncViewport();
    }

    function createPanZoom(elementRef) {
        element = unref(elementRef);

        panzoom.value = Panzoom(element, {
            ...panzoomOptions,
            startX: viewport.x ?? 0,
            startY: viewport.y ?? panzoomOptions.startY ?? 0,
            startScale: viewport.zoom ?? 1,
        });

        element.addEventListener('panzoomstart', onPanZoomStart);
        element.addEventListener('panzoompan', onPanZoomPan);
        element.addEventListener('panzoomend', onPanZoomEnd);
        element.addEventListener('panzoomzoom', syncViewport);
    }

    function destroyPanZoom() {
        if (element) {
            element.removeEventListener('panzoomstart', onPanZoomStart);
            element.removeEventListener('panzoompan', onPanZoomPan);
            element.removeEventListener('panzoomend', onPanZoomEnd);
            element.removeEventListener('panzoomzoom', syncViewport);
        }

        dragging = false;
        hideCenterGuides();
        syncViewport.cancel();

        return panzoom.value?.destroy();
    }

    function resetViewport() {
        zoom.value = 1;
        panzoom.value?.reset();

        viewport.x = 0;
        viewport.y = panzoomOptions.startY ?? 0;
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
        centerGuides,
        resetViewport,
        createPanZoom,
        destroyPanZoom,
    };
}
