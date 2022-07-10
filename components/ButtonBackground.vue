<template>
    <button
        class="relative w-20 h-10 transition-all rounded hover:shadow-lg hover:-translate-y-0.5"
    >
        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute inline-flex items-center justify-center w-5 h-5 rounded-full shadow bg-ui-gray-400 -top-2 -left-2"
        >
            <XIcon class="w-4 h-4 text-white" />
        </button>

        <div
            v-if="active"
            class="absolute inline-flex items-center justify-center w-5 h-5 bg-green-400 rounded-full shadow -top-2 -right-2"
        >
            <CheckIcon class="w-4 h-4 text-white" />
        </div>
    </button>
</template>

<script>
import { XIcon, CheckIcon } from 'vue-feather-icons';

export default {
    props: {
        custom: Boolean,
        active: Boolean,
    },

    components: { XIcon, CheckIcon },
};
</script>
