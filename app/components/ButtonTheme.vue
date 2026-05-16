<template>
    <button
        v-bind="$attrs"
        class="relative h-48 w-64 cursor-pointer overflow-hidden rounded-xl text-left focus:outline-hidden"
        :class="active ? 'ring-[3px] ring-violet-500 dark:ring-violet-400' : ''"
    >
        <div v-if="!hasScene" class="absolute inset-0" v-bind="background" />

        <DeferredComponent
            as="div"
            :show="rendered"
            :threshold="[0, 0.2]"
            @intersected="visible = $event"
            class="relative flex h-full w-full items-center justify-center"
        >
            <div v-if="blocks && hasScene" class="relative h-full w-full overflow-hidden">
                <Canvas
                    preview
                    class="absolute top-1/2 left-1/2 flex origin-center items-center justify-center"
                    :style="{ transform: `translate(-50%, -50%) scale(${previewScale})` }"
                    :width="previewWidth"
                    :height="previewHeight"
                    :position="themeSettings.position"
                    :background="themeSettings.background"
                    :background-attributes="background"
                    :scene="themeSettings.scene"
                    :theme-type="themeSettings.themeType"
                >
                    <template #default="{ sceneGutters }">
                        <Window
                            preview
                            class="absolute z-1 shrink-0"
                            :blocks="blocks"
                            :settings="themeSettings"
                            :scene-gutters="sceneGutters"
                        />
                    </template>
                </Canvas>
            </div>

            <Window v-else-if="blocks" preview :blocks="blocks" :settings="themeSettings" />
        </DeferredComponent>

        <div v-if="rendering" class="absolute inset-0 flex items-center justify-center">
            <span
                class="flex items-center justify-center rounded-lg bg-zinc-200/80 p-2 backdrop-blur-xs dark:bg-zinc-950/80"
            >
                <Spinner class="text-zinc-700 dark:text-zinc-200" />
            </span>
        </div>

        <div class="absolute inset-x-0 bottom-2 flex justify-center">
            <span
                class="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-medium tracking-wide text-white shadow-xs backdrop-blur-md"
            >
                {{ theme }}
            </span>
        </div>
    </button>
</template>

<script setup>
import useShiki from '@/composables/useShiki';
import { debounce, defaults, cloneDeep } from 'lodash';
import { ref, watch, reactive, toRefs, computed, onMounted } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    code: { type: Array, required: true },
    theme: { type: String, required: true },
    active: { type: Boolean, required: true },
    settings: { type: Object, required: true },
    languages: { type: Array, required: true },
    background: { type: Object, required: true },
});

const { code, theme, settings, languages } = toRefs(props);

const { $shiki } = useNuxtApp();
const { buildCodeBlocks } = useShiki();

const blocks = ref(null);
const visible = ref(false);
const rendered = ref(false);
const rendering = ref(true);
const themeSettings = reactive({});
const previouslyRendered = ref(null);
const previewWidth = 640;
const previewHeight = 480;
const previewScale = 0.4;

const settingOverrides = {
    scale: 0.5,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    position: 'center',
};

const hasScene = computed(() => themeSettings.scene && themeSettings.scene !== 'none');

function generateTokens() {
    rendering.value = true;

    return buildCodeBlocks(
        { code: code.value, theme: theme.value, languages: languages.value },
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
    (values) => {
        const { themeType, themeBackground, ...rest } = cloneDeep(values);
        Object.assign(themeSettings, defaults(settingOverrides, rest));
    },
    { immediate: true, deep: true }
);

onMounted(() => {
    watch(visible, (vis) => {
        if (vis && code.value != previouslyRendered.value) {
            generateTokens().then(() => (rendered.value = true));
        }
    });

    watch(
        code,
        debounce(() => visible.value && generateTokens(), 750)
    );
});
</script>
