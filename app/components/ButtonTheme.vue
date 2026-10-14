<template>
    <button
        v-bind="$attrs"
        class="rounded-emphasis relative h-48 w-64 cursor-pointer overflow-hidden text-left focus:outline-hidden"
        :class="active ? 'ring-1 ring-violet-500 dark:ring-violet-400' : ''"
    >
        <div v-if="!hasScene" class="absolute inset-0" v-bind="background" />

        <DeferredComponent
            as="div"
            :show="rendered"
            :threshold="[0, 0.2]"
            @intersected="visible = $event"
            class="relative flex size-full items-center justify-center"
        >
            <div v-if="blocks && hasScene" class="relative size-full overflow-hidden">
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
                class="rounded-control flex items-center justify-center bg-zinc-200/80 p-2 backdrop-blur-xs dark:bg-zinc-950/80"
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
import useHighlightedCode from '@/composables/useHighlightedCode';
import { defaults, cloneDeep } from 'lodash';
import { ref, watch, reactive, toRefs, computed } from 'vue';

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

const visible = ref(false);
const themeSettings = reactive({});
const { result: highlighted, loading: rendering } = useHighlightedCode(
    () => ({ code: code.value, theme: theme.value, languages: languages.value }),
    { enabled: visible, delay: 750, limit: 5 }
);
const blocks = computed(() => highlighted.value?.blocks ?? null);
const rendered = computed(() => highlighted.value !== null);

watch(highlighted, (value) => {
    themeSettings.themeType = value.themeType;
    themeSettings.themeBackground = value.themeBackground;
});

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

watch(
    settings,
    (values) => {
        const { themeType, themeBackground, ...rest } = cloneDeep(values);
        Object.assign(themeSettings, defaults({}, settingOverrides, rest));
    },
    { immediate: true, deep: true }
);
</script>
