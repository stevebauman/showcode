<template>
    <LazyComponent
        as="button"
        :threshold="0"
        rootMargin="500px 500px 500px 500px"
        @intersected="visible = $event"
        v-bind="hasBeenVisible ? attributes : {}"
        class="relative w-24 h-20 transition-all rounded hover:shadow-lg hover:-translate-y-0.5"
        style="will-change: auto"
    >
        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute inline-flex items-center justify-center size-6 rounded-full shadow active:bg-ui-gray-500 bg-ui-gray-400 -top-2 -right-2"
        >
            <XIcon class="w-4 h-4 text-white" />
        </button>

        <div
            v-if="active"
            class="absolute inline-flex items-center justify-center size-8 bg-green-400 rounded-full shadow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <CheckIcon class="size-6 text-white" />
        </div>

        <slot />
    </LazyComponent>
</template>

<script>
import { ref, watch } from '@nuxtjs/composition-api';
import { XIcon, CheckIcon } from 'vue-feather-icons';

export default {
    props: {
        custom: Boolean,
        active: Boolean,
        attributes: Object,
    },

    components: { XIcon, CheckIcon },

    setup() {
        const visible = ref(false);
        const hasBeenVisible = ref(false);

        watch(visible, (newVal) => {
            if (newVal) {
                hasBeenVisible.value = true;
            }
        });

        return { visible, hasBeenVisible };
    },
};
</script>
