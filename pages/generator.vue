<template>
    <div class="min-w-full min-h-screen">
        <div
            v-if="generated"
            dusk="capture"
            v-bind="backgroundAttrs"
            class="flex items-center justify-center w-full h-full p-4 overflow-hidden"
            :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
        >
            <Window v-if="blocks" preview class="my-6" :blocks="blocks" :settings="settings" />
        </div>
    </div>
</template>

<script>
import useShiki from '@/composables/useShiki';
import useSettings from '~/composables/useSettings';
import useEditorUtils from '@/composables/useEditorUtils';
import { ref, computed } from '@nuxtjs/composition-api';
import { default as useBackgrounds } from '@/composables/useBackgrounds';

export default {
    setup() {
        const { buildCodeBlocks } = useShiki();
        const { getBackgroundAttrs } = useBackgrounds();

        const { getCodeFromEditors, getLanguagesFromEditors } = useEditorUtils();

        const { settings } = useSettings();

        const generated = ref(false);
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

            generated.value = true;
        };

        window.load = (params) => {
            if (params.settings) {
                Object.assign(settings, params.settings || {});
            }

            if (params.page?.editors) {
                editors.value.push(...params.page.editors);
            }

            generateTokens();
        };

        return { generated, settings, blocks, backgroundAttrs };
    },
};
</script>
