<template>
    <div
        class="flex items-center h-full"
        :class="{
            'text-gray-600 bg-white hover:bg-gray-50': active,
            'text-gray-300 bg-gray-600 hover:bg-gray-500': !active,
        }"
    >
        <button
            @click="$emit('navigate')"
            :class="{ 'font-semibold tracking-wide': active }"
            class="flex items-center w-40 h-full px-4 py-1 space-x-4 text-xs"
        >
            <slot />
        </button>

        <button
            @click="$emit('close')"
            class="p-0.5 mx-1 text-gray-400 rounded hover:bg-gray-400 hover:text-gray-100"
        >
            <XIcon class="w-5 h-5" />
        </button>
    </div>
</template>

<script>
import { XIcon } from 'vue-feather-icons';

export default {
    props: {
        active: Boolean,
    },

    components: { XIcon },
};
</script>
