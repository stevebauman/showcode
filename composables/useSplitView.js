import Split from 'split.js';
import { castArray } from 'lodash';
import { ref, onBeforeUnmount, computed, unref } from 'vue';

export default function (elements = [], config) {
    const split = ref(null);

    const containers = computed(() => castArray(unref(elements)).map((element) => unref(element)));

    const resolveElements = () =>
        containers.value.map((container) => (container?.$el ?? container));

    const destroy = () => {
        split.value?.destroy();
        split.value = null;
    };

    const init = () => {
        destroy();

        if (containers.value.length > 1) {
            split.value = Split(resolveElements(), config.value);
        }
    };

    onBeforeUnmount(destroy);

    return { init, destroy };
}
