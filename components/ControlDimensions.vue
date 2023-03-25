<template>
    <div class="justify-center hidden md:flex">
        <div
            class="flex items-center justify-center gap-2 rounded-lg shadow bg-ui-gray-700 py-0.5 highlight"
        >
            <div class="flex items-center">
                <div class="px-2 text-xs font-semibold text-ui-gray-500">W</div>

                <Input
                    size="xs"
                    type="number"
                    min="1"
                    max="5000"
                    class="text-center appearance-none w-14"
                    :value="width"
                    :disabled="lockWindowSize"
                    @input="$emit('update:width', $event)"
                />
            </div>

            <div><XIcon class="w-3 h-3 text-ui-gray-500" /></div>

            <div class="flex items-center">
                <Input
                    size="xs"
                    type="number"
                    min="1"
                    max="5000"
                    class="text-center appearance-none w-14"
                    :value="height"
                    :disabled="lockWindowSize"
                    @input="$emit('height:width', $event)"
                />

                <div class="px-2 text-xs font-semibold text-ui-gray-500">H</div>
            </div>
        </div>
    </div>
</template>

<script>
import { XIcon } from 'vue-feather-icons';

export default {
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        lockWindowSize: {
            type: Boolean,
            required: true,
        },
    },

    components: { XIcon },
};
</script>
