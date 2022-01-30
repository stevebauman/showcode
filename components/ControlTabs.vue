<template>
    <div
        class="relative flex flex-col items-center justify-between mb-4 overflow-hidden rounded-xl bg-ui-gray-700"
    >
        <div class="flex items-center justify-center w-full h-full bg-ui-gray-800">
            <button
                v-for="(tab, index) in tabs"
                :key="index"
                :class="{
                    'text-ui-gray-50 bg-ui-gray-700 bg-opacity-60': active === tab,
                    'text-ui-gray-500 bg-ui-gray-800 bg-opacity-60 hover:bg-ui-gray-600 hover:text-ui-gray-400':
                        active !== tab,
                }"
                class="inline-flex items-center justify-center w-full gap-2 p-3 text-xs font-semibold leading-none tracking-widest uppercase rounded-t-lg"
                @click="active = tab"
            >
                <Dot v-if="active === tab" /> {{ tab }}
            </button>
        </div>

        <slot :active="active" />
    </div>
</template>

<script>
import { head } from 'lodash';
import { ref, toRefs } from '@nuxtjs/composition-api';

export default {
    props: { tabs: Array },

    setup(props) {
        const { tabs } = toRefs(props);

        const active = ref(head(tabs.value));

        return { active };
    },
};
</script>
