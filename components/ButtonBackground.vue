<template>
    <button
        :class="[
            `background-${background}`,
            selected ? 'border-2 border-gray-300' : null,
        ]"
        @click="$emit('background-chosen', background)"
        class="relative w-10 h-10 rounded"
    >
        <div
            v-if="selected"
            class="absolute inline-flex items-center justify-center w-4 h-4 bg-gray-800 border border-gray-600 rounded-full shadow-sm  -top-2 -right-2"
        >
            <CheckIcon class="w-2 h-2 text-green-300" />
        </div>
    </button>
</template>

<script>
import { CheckIcon } from 'vue-feather-icons';

export default {
    props: ['background', 'selected'],

    components: { CheckIcon },
};
</script>
