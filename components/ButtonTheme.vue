<template>
    <div class="relative cursor-pointer">
        <div
            class="relative flex items-center justify-center w-64 h-48 overflow-hidden transition-all rounded-lg hover:shadow-lg hover:-translate-y-1"
        >
            <button
                v-bind="$attrs"
                v-on="$listeners"
                class="relative text-left rounded-lg focus:outline-none focus:ring-0"
            >
                <div class="absolute inset-0" v-bind="background" />

                <LazyComponent
                    as="div"
                    :show="rendered"
                    :threshold="[0, 0.2]"
                    @intersected="visible = $event"
                    class="relative flex items-center justify-center w-64 h-48"
                >
                    <Window v-if="blocks" preview :blocks="blocks" :settings="themeSettings" />
                </LazyComponent>

                <div v-if="rendering" class="absolute inset-0">
                    <div class="flex h-full items-center justify-center w-full">
                        <span
                            class="flex items-center justify-center rounded-lg bg-ui-gray-800 p-2"
                        >
                            <Spinner class="text-ui-gray-200" />
                        </span>
                    </div>
                </div>
            </button>

            <div class="absolute top-0 inline-flex justify-center w-full">
                <span
                    class="px-4 py-1 text-xs font-bold tracking-wide text-center uppercase rounded-b-lg shadow text-ui-gray-300 bg-ui-gray-900"
                >
                    {{ theme }}
                </span>
            </div>
        </div>

        <div
            v-if="active"
            class="absolute inline-flex items-center justify-center w-5 h-5 bg-green-400 rounded-full shadow -top-2 -right-2"
        >
            <CheckIcon class="w-4 h-4 text-white" />
        </div>
    </div>
</template>

<script>
import { CheckIcon } from 'vue-feather-icons';
import useShiki from '@/composables/useShiki';
import { debounce, defaults, cloneDeep } from 'lodash';
import { ref, watch, reactive, toRefs, onMounted, useContext } from '@nuxtjs/composition-api';

export default {
    inheritAttrs: false,

    props: {
        code: {
            type: Array,
            required: true,
        },
        theme: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
        settings: {
            type: Object,
            required: true,
        },
        languages: {
            type: Array,
            required: true,
        },
        background: {
            type: Object,
            required: true,
        },
    },

    components: { CheckIcon },

    setup(props) {
        const { code, theme, settings, languages } = toRefs(props);

        const { $shiki } = useContext();

        const { buildCodeBlocks } = useShiki();

        const blocks = ref(null);
        const visible = ref(false);
        const rendered = ref(false);
        const rendering = ref(true);
        const themeSettings = reactive({});
        const previouslyRendered = ref(null);

        const settingOverrides = {
            scale: 0.5,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            position: 'center',
        };

        function generateTokens() {
            rendering.value = true;

            buildCodeBlocks(
                {
                    code: code.value,
                    theme: theme.value,
                    languages: languages.value,
                },
                ({ blocks: code, themeType: type, themeBackground: background }) => {
                    themeSettings.themeType = type;
                    themeSettings.themeBackground = background;

                    blocks.value = code;
                },
                5
            ).then(() => {
                rendering.value = false;
                previouslyRendered.value = code.value;
            });
        }

        watch(
            settings,
            (values) => Object.assign(themeSettings, defaults(settingOverrides, cloneDeep(values))),
            { immediate: true, deep: true }
        );

        onMounted(() => {
            watch(visible, (visible) => {
                if (visible && code.value != previouslyRendered.value) {
                    $shiki
                        .loadTheme(theme.value)
                        .then(generateTokens)
                        .then(() => (rendered.value = true));
                }
            });

            watch(
                code,
                debounce(() => visible.value && generateTokens(), 750)
            );
        });

        return { blocks, visible, rendered, rendering, themeSettings };
    },
};
</script>
