<template>
    <div class="justify-center flex-shrink-0 hidden rounded-lg shadow md:flex">
        <Button
            v-for="([x, y], index) in aspectRatios"
            size="xs"
            :key="index"
            :rounded="false"
            :disabled="lockWindowSize"
            :active="isEqual(aspectRatio, [x, y])"
            class="justify-center w-16"
            :class="{ 'rounded-l-lg': index === 0 }"
            @click.native="$emit('select', x, y)"
        >
            {{ x }}:{{ y }}
        </Button>

        <Button
            size="xs"
            :rounded="false"
            :active="aspectRatio === null"
            class="justify-center rounded-r-lg"
            @click.native="$emit('custom')"
        >
            Custom
        </Button>
    </div>
</template>

<script>
import { isEqual } from 'lodash';

export default {
    props: {
        aspectRatio: {
            type: Array,
            required: false,
        },
        aspectRatios: {
            type: Array,
            required: true,
        },
        lockWindowSize: {
            type: Boolean,
            required: true,
        },
    },

    setup: () => ({ isEqual }),
};
</script>
