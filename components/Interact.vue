<template>
    <component :is="as" ref="root" v-bind="$attrs" v-on="$listeners">
        <slot />
    </component>
</template>

<script>
import Vue from 'vue';
import interact from 'interactjs';
import { ref, watch, toRefs, computed, onMounted, onBeforeUnmount } from '@nuxtjs/composition-api';

export default {
    props: {
        as: {
            type: String,
            default: 'div',
        },
        draggable: Object,
        resizable: Object,
    },

    setup(props, { emit }) {
        const root = ref(null);
        const instance = ref(null);

        const { draggable, resizable } = toRefs(props);

        const element = computed(() => (root.value instanceof Vue ? root.value.$el : root.value));

        const destroy = () => instance.value?.unset();

        onMounted(() => {
            instance.value = interact(element.value);

            instance.value.on('dragmove', (event) => emit('dragmove', event));
            instance.value.on('resizemove', (event) => emit('resizemove', event));

            watch(draggable, (config) => instance.value?.draggable(config), { immediate: true });
            watch(resizable, (config) => instance.value?.resizable(config), { immediate: true });
        });

        onBeforeUnmount(destroy);

        return { root };
    },
};
</script>
