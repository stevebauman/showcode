<template>
    <button
        class="relative w-10 h-10 rounded  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ui-gray-700 focus:ring-ui-focus"
        :class="[active ? 'border-2 border-ui-gray-200' : null]"
    >
        <div
            v-if="active"
            class="absolute inline-flex items-center justify-center w-4 h-4 border rounded-full shadow-sm  bg-ui-gray-800 border-ui-gray-600 -top-2 -right-2"
        >
            <CheckIcon class="w-2 h-2 text-green-500" />
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
