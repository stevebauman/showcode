import Vue from 'vue';
import Split from 'split.js';
import { ref, onBeforeUnmount, computed } from '@nuxtjs/composition-api';
import { castArray } from 'lodash';

export default function (elements = [], config) {
    const split = ref(null);

    const containers = computed(() => castArray(elements?.value || elements));

    const resolveElements = () =>
        containers.value.map((container) => {
            const element = ref(container).value;

            return element instanceof Vue ? element.$el : element;
        });

    const destroy = () => split.value?.destroy();

    const init = () => {
        destroy();

        if (containers.value.length > 1) {
            split.value = Split(resolveElements(), config.value);
        }
    };

    onBeforeUnmount(destroy);

    return { init, destroy };
}
