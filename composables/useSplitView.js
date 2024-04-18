import Vue from 'vue';
import Split from 'split.js';
import { castArray } from 'lodash';
import { ref, onBeforeUnmount, computed, unref } from '@nuxtjs/composition-api';

export default function (elements = [], config) {
    const split = ref(null);

    const containers = computed(() => castArray(unref(elements)).map((element) => unref(element)));

    function resolveElements() {
        return containers.value.map((container) =>
            container instanceof Vue ? container.$el : container
        );
    }

    function destroy() {
        split.value?.destroy();
        split.value = null;
    }

    function init() {
        destroy();

        if (containers.value.length > 1) {
            split.value = Split(resolveElements(), config.value);
        }
    }

    onBeforeUnmount(destroy);

    return { init, destroy };
}
