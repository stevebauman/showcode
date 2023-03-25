<template>
    <Scrollbar force-vertical-scroll dusk="control-themes" class="w-full">
        <div class="grid grid-flow-col grid-rows-2 gap-4 p-4 auto-cols-max">
            <ButtonTheme
                v-for="availableTheme in themes"
                :code="code"
                :settings="settings"
                :languages="languages"
                :key="availableTheme"
                :theme="availableTheme"
                :background="background"
                :active="availableTheme === theme"
                :ref="`button-theme-${availableTheme}`"
                :dusk="`button-theme-${availableTheme}`"
                @click.native="$emit('select', availableTheme)"
            />
        </div>
    </Scrollbar>
</template>

<script>
import { onMounted } from '@nuxtjs/composition-api';
import useScrollRefIntoView from '@/composables/useScrollRefIntoView';

export default {
    props: {
        code: {
            type: Array,
            required: true,
        },
        theme: {
            type: String,
            default: true,
        },
        themes: {
            type: Array,
            required: true,
        },
        settings: {
            type: Object,
            required: true,
        },
        background: {
            type: Object,
            required: true,
        },
        languages: {
            type: Array,
            required: true,
        },
    },

    setup(props, { refs }) {
        const { scrollRefIntoView } = useScrollRefIntoView(refs);

        onMounted(() => scrollRefIntoView(`button-theme-${props.theme}`));
    },
};
</script>
