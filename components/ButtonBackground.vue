<template>
    <LazyComponent
        as="button"
        :threshold="0.2"
        @intersected="visible = $event"
        v-bind="visible ? attributes : {}"
        class="relative w-24 h-20 transition-all rounded hover:shadow-lg hover:-translate-y-0.5"
    >
        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute inline-flex items-center justify-center w-5 h-5 rounded-full shadow active:bg-ui-gray-500 bg-ui-gray-400 -top-2 -left-2"
        >
            <XIcon class="w-4 h-4 text-white" />
        </button>

        <div
            v-if="active"
            class="absolute inline-flex items-center justify-center w-5 h-5 bg-green-400 rounded-full shadow -top-2 -right-2"
        >
            <CheckIcon class="w-4 h-4 text-white" />
        </div>

        <slot />
    </LazyComponent>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import { XIcon, CheckIcon } from 'vue-feather-icons';

export default {
    props: {
        custom: Boolean,
        active: Boolean,
        attributes: Object,
    },

    components: { XIcon, CheckIcon },

    setup() {
        return { visible: ref(false) };
    },
};
</script>
