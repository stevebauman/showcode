<template>
    <div class="min-w-full min-h-screen">
        <div
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
import useEditorUtils from '@/composables/useEditorUtils';
import { default as useBackgrounds, DEFAULT_BACKGROUND } from '@/composables/useBackgrounds';
import { ref, watch, reactive, computed, useContext, onBeforeMount } from '@nuxtjs/composition-api';

export default {
    setup() {
        const { $shiki } = useContext();
        const { buildCodeBlocks } = useShiki();
        const { getBackgroundAttrs } = useBackgrounds();

        const { generateCodeFromEditors, generateLanguagesFromEditors } = useEditorUtils();

        const blocks = ref(null);

        const editors = ref([]);

        const settings = reactive({
            showHeader: true,
            showTitle: true,
            showShadow: true,
            showMenu: true,
            showColorMenu: false,
            showLineNumbers: true,
            title: 'Beautiful Code Screenshots',
            themeType: 'light',
            themeOpacity: 1.0,
            themeName: 'github-light',
            themeBackground: '#fff',
            aspectRatio: null,
            background: DEFAULT_BACKGROUND,
            borderRadius: 16,
            borderRadiusLocked: true,
            fontSize: 16,
            fontFamily: 'font-mono-lisa',
            lineHeight: 20,
            padding: 16,
            width: 500,
            height: 500,
            paddingLocked: true,
            image: null,
            scale: 1.0,
        });

        window.loadSharedProject = (values) => {
            Object.assign(settings, values.settings);

            editors.value.push(...values.page.editors);
        };

        const backgroundAttrs = computed(() => getBackgroundAttrs(settings.background));

        const generateTokens = async () => {
            await buildCodeBlocks(
                {
                    code: generateCodeFromEditors(editors),
                    languages: generateLanguagesFromEditors(editors),
                    theme: settings.themeName,
                },
                ({ blocks: code, themeType: type, themeBackground: background }) => {
                    blocks.value = code;
                    settings.themeType = type;
                    settings.themeBackground = background;
                }
            );
        };

        onBeforeMount(generateTokens);

        watch(settings, generateTokens);

        return { settings, blocks, backgroundAttrs };
    },
};
</script>
