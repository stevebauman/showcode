<template>
    <component :is="as" ref="root" v-bind="$attrs">
        <slot />
    </component>
</template>

<script setup>
import interact from 'interactjs';
import { ref, watch, toRefs, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    as: { type: String, default: 'div' },
    drag: { type: [Boolean, Object], required: false },
    resize: { type: [Boolean, Object], required: false },
});

const emit = defineEmits(['dragmove', 'resizemove']);

const root = ref(null);
const instance = ref(null);

const { drag, resize } = toRefs(props);

const element = computed(() => root.value?.$el ?? root.value);

const destroy = () => instance.value?.unset();

const applyConfigToInteract = (config, method) => {
    if (typeof config === 'object') return instance.value[method](config);
    if (config === true) return instance.value[method]({});
};

onMounted(() => {
    instance.value = interact(element.value);

    instance.value.on('dragmove', (event) => emit('dragmove', event));
    instance.value.on('resizemove', (event) => emit('resizemove', event));

    watch(drag, (config) => applyConfigToInteract(config, 'draggable'), { immediate: true });
    watch(resize, (config) => applyConfigToInteract(config, 'resizable'), { immediate: true });
});

onBeforeUnmount(destroy);
</script>
