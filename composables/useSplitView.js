import Vue from 'vue';
import Split from 'split.js';
import { castArray } from 'lodash';
import { ref, onBeforeUnmount, computed, unref } from '@nuxtjs/composition-api';

export default function (elements = [], config) {
    const split = ref(null);

    const containers = computed(() => castArray(unref(elements)).map((element) => unref(element)));

    const resolveElements = () =>
        containers.value.map((container) => (container instanceof Vue ? container.$el : container));

    const destroy = () => split.value?.destroy();

    const init = () => {
        if (containers.value.length) {
            destroy();

            split.value = Split(resolveElements(), config.value);
        }
    };

    onBeforeUnmount(destroy);

    return { init, destroy };
}
