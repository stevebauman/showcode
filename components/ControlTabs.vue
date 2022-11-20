<template>
    <div class="flex flex-col items-stretch justify-between overflow-hidden bg-ui-gray-700">
        <div class="flex items-center justify-center bg-ui-gray-800">
            <ControlTab
                v-for="{ name, title } in tabs"
                :key="name"
                class="w-full"
                :dusk="`button-tab-${name}`"
                :active="active === name && open"
                @click.native="
                    () => {
                        active = name;
                        open = true;
                    }
                "
            >
                {{ title }}
            </ControlTab>

            <ControlTab @click.native="open = !open" class="w-44">
                <Icon type="arrow-up" class="w-5 h-5" :class="{ 'rotate-180 transform': open }" />
            </ControlTab>
        </div>

        <div v-auto-animate>
            <div v-if="open" class="w-full overflow-x-auto scrollbar-hide max-h-52 lg:max-h-max">
                <slot :active="active" />
            </div>
        </div>
    </div>
</template>

<script>
import { head } from 'lodash';
import { ref, watch, toRefs } from 'vue';

export default {
    props: { tabs: Array },

    setup(props, context) {
        const { tabs } = toRefs(props);

        const { emit } = context;

        const open = ref(true);
        const active = ref(head(tabs.value).name);

        watch(active, (value) => emit('changed', value));

        return { open, active };
    },
};
</script>
