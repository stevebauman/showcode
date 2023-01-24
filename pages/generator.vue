<template>
    <div class="min-w-full min-h-screen">
        <Canvas
            preview
            ref="canvas"
            dusk="canvas"
            class="relative flex"
            :width="settings.width"
            :height="settings.height"
            :position="settings.position"
            :aspect-ratio="settings.aspectRatio"
            :background="settings.background"
            :background-attributes="backgroundAttrs"
        >
            <Window
                v-if="blocks"
                preview
                ref="pane"
                class="my-6"
                :blocks="blocks"
                :settings="settings"
            />
        </Canvas>
    </div>
</template>

<script>
import useShiki from '@/composables/useShiki';
import useSettings from '@/composables/useSettings';
import useEditorUtils from '@/composables/useEditorUtils';
import { ref, computed, nextTick, watch } from '@nuxtjs/composition-api';
import { default as useBackgrounds } from '@/composables/useBackgrounds';

export default {
    setup() {
        const { buildCodeBlocks } = useShiki();
        const { addCustomBackground, getBackgroundAttrs } = useBackgrounds();

        const { getCodeFromEditors, getLanguagesFromEditors } = useEditorUtils();

        const { settings } = useSettings();

        const ready = ref(false);
        const pane = ref(null);
        const blocks = ref(null);
        const editors = ref([]);

        const backgroundAttrs = computed(() => getBackgroundAttrs(settings.background));

        const generateTokens = async () => {
            await buildCodeBlocks(
                {
                    theme: settings.themeName,
                    code: getCodeFromEditors(editors),
                    languages: getLanguagesFromEditors(editors),
                },
                ({ blocks: code, themeType: type, themeBackground: background }) => {
                    blocks.value = code;
                    settings.themeType = type;
                    settings.themeBackground = background;
                }
            );
        };

        watch(pane, (value) => {
            if (settings.lockWindowSize) {
                settings.width =
                    (pane.value.actualWidth() + Number(settings.lockWindowPaddingX)) *
                    settings.scale;

                settings.height =
                    (pane.value.actualHeight() + Number(settings.lockWindowPaddingY)) *
                    settings.scale;
            }

            nextTick(() => (ready.value = true));
        });

        window.load = (params) => {
            if (typeof params.settings?.background === 'object') {
                params.settings.background = addCustomBackground(params.settings.background);
            }

            if (params.settings) {
                Object.assign(settings, params.settings || {});
            }

            if (params.editors) {
                editors.value.push(...params.editors);
            }

            if (params.settings?.aspectRatio) {
                const [x, y] = settings.aspectRatio;

                params.settings?.height
                    ? (settings.width = settings.height * (x / y))
                    : (settings.height = settings.width / (x / y));
            }

            generateTokens();
        };

        return { pane, ready, settings, blocks, backgroundAttrs };
    },
};
</script>
