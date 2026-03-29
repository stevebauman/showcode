import Split from 'split.js';
import { castArray } from 'lodash';
import { ref, onBeforeUnmount, unref } from 'vue';

export default function (elements = [], config) {
    const split = ref(null);

    function resolveElements() {
        return castArray(unref(elements))
            .map((element) => unref(element))
            .map((container) => container.$el ?? container);
    }

    function destroy() {
        split.value?.destroy();
        split.value = null;
    }

    function init() {
        destroy();

        const resolved = resolveElements();

        if (resolved.length > 1) {
            split.value = Split(resolved, config.value);
        }
    }

    onBeforeUnmount(destroy);

    return { init, destroy };
}
