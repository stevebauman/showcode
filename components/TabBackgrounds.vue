<template>
    <div dusk="control-backgrounds" class="flex flex-col justify-start w-full gap-4">
        <Scrollbar force-vertical-scroll>
            <div class="grid grid-flow-col grid-rows-3 gap-4 p-4 auto-cols-max">
                <ButtonBackground
                    slot="trigger"
                    :active="false"
                    v-tooltip.bottom="{
                        content: $config.isDesktop
                            ? 'Add Custom Background'
                            : 'Download the desktop app to add custom backgrounds.',
                    }"
                    @click.native="$emit('add')"
                    class="highlight flex items-center justify-center bg-ui-gray-600 active:bg-ui-gray-900 hover:bg-ui-gray-800"
                >
                    <PlusCircleIcon class="w-5 h-5 text-ui-gray-300" />
                </ButtonBackground>

                <ButtonBackground
                    v-for="{ id, custom, ...attrs } in backgrounds"
                    v-tooltip="{ content: id, delay: 500 }"
                    class="highlight"
                    :key="id"
                    :custom="custom"
                    :attributes="attrs"
                    :active="background === id"
                    :ref="`button-background-${id}`"
                    :dusk="`button-background-${id}`"
                    @delete="$emit('delete', id)"
                    @click.native="$emit('select', id)"
                />
            </div>
        </Scrollbar>
    </div>
</template>

<script>
import { PlusCircleIcon } from 'vue-feather-icons';
import { onMounted, toRefs, watch } from '@nuxtjs/composition-api';
import useScrollRefIntoView from '@/composables/useScrollRefIntoView';

export default {
    props: {
        background: {
            type: String,
            required: true,
        },
        backgrounds: {
            type: Array,
            required: true,
        },
    },

    components: { PlusCircleIcon },

    setup(props, { refs }) {
        const { background, backgrounds } = toRefs(props);

        const { scrollRefIntoView } = useScrollRefIntoView(refs);

        onMounted(() => scrollRefIntoView(`button-background-${background.value}`));

        watch(backgrounds, () => scrollRefIntoView(`button-background-${background.value}`));
    },
};
</script>
