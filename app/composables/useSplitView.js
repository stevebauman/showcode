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
        const options = unref(config) ?? {};
        const direction = options.direction ?? 'horizontal';

        if (resolved.length > 1) {
            split.value = Split(resolved, {
                cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
                snapOffset: 0,
                dragInterval: 1,
                ...options,
            });
        }
    }

    onBeforeUnmount(destroy);

    return { init, destroy };
}
