<template>
    <button
        :class="[active ? 'border-2 border-ui-gray-200' : null]"
        class="relative w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ui-gray-700 focus:ring-ui-focus"
    >
        <div
            v-if="active"
            class="absolute inline-flex items-center justify-center w-5 h-5 bg-green-400 rounded-full shadow -top-2 -right-2"
        >
            <CheckIcon class="w-4 h-4 text-white" />
        </div>
    </button>
</template>

<script>
import { CheckIcon } from 'vue-feather-icons';

export default {
    props: { active: Boolean },

    components: { CheckIcon },
};
</script>
