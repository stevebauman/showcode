<template>
    <div class="relative bg-zinc-100 dark:bg-zinc-950" :class="{ 'is-resizing': resizing }">
        <ModalCustomBackground
            v-model="showingBackgroundsModal"
            :blocks="blocks"
            :settings="settings"
            @saved="updateWithCustomBackground"
            @cancelled="showingBackgroundsModal = false"
        />

        <div class="absolute z-20 flex w-full items-center justify-end p-2">
            <div class="flex h-10 flex-wrap items-center justify-center gap-2">
                <Button
                    aria-label="Copy Image"
                    variant="ghost"
                    :class="canvasButtonClasses"
                    @click="copyToClipboard"
                >
                    <CheckCircleIcon v-if="copied" class="!size-3.5 text-green-500" />
                    <ClipboardIcon v-else class="!size-3.5" />
                    <span class="hidden sm:inline">
                        {{ copied ? 'Copied!' : 'Copy Image' }}
                    </span>
                </Button>

                <Dropdown
                    variant="ghost"
                    :items="fileTypes"
                    button-aria-label="Export Image"
                    :button-class="canvasButtonClasses"
                >
                    <ShareIcon class="!size-3.5" />
                    <span class="hidden sm:inline">Export Image</span>
                </Dropdown>
            </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center">
            <div
                aria-hidden="true"
                data-center-guide="x"
                class="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-violet-500/50 transition-opacity duration-100"
                :class="centerGuides.x ? 'opacity-100' : 'opacity-0'"
            />

            <div
                aria-hidden="true"
                data-center-guide="y"
                class="pointer-events-none absolute inset-x-0 h-px bg-violet-500/50 transition-opacity duration-100"
                :class="centerGuides.y ? 'opacity-100' : 'opacity-0'"
                :style="{ top: `calc(50% + ${previewRestingY * zoom}px)` }"
            />

            <div ref="preview" data-preview-viewport class="relative z-10">
                <Canvas
                    ref="canvas"
                    class="canvas relative flex items-center justify-center"
                    :zoom="zoom"
                    :resizable="!lockWindowSize"
                    :position="settings.position"
                    :width="Number(settings.width)"
                    :height="Number(settings.height)"
                    :aspect-ratio="settings.aspectRatio"
                    :background="settings.background"
                    :background-attributes="backgroundAttrs"
                    :scene="settings.scene"
                    :theme-type="settings.themeType"
                    @update:width="setWidth($event)"
                    @update:height="setHeight($event)"
                    @resize-start="resizing = true"
                    @resize-end="resizing = false"
                >
                    <template #default="{ sceneGutters }">
                        <Window
                            ref="pane"
                            class="z-1 shrink-0"
                            :zoom="zoom"
                            :blocks="blocks"
                            :settings="settings"
                            :scene-gutters="sceneGutters"
                            @update:title="settings.title = $event"
                            @update:scale="updateScale"
                        />
                    </template>
                </Canvas>
            </div>
        </div>

        <div class="absolute bottom-0 z-20 w-full p-1">
            <div
                class="flex flex-row-reverse flex-wrap items-center justify-between gap-2 p-2 pb-3 md:flex-row"
            >
                <div class="flex shrink-0 items-stretch gap-2">
                    <ControlFitToWindow
                        :lock-window-size="lockWindowSize"
                        :lock-window-padding-y="Number(lockWindowPaddingY)"
                        :lock-window-padding-x="Number(lockWindowPaddingX)"
                        @apply="resetWindowSize"
                        @update:lock-window-size="lockWindowSize = $event"
                        @update:lock-window-padding-y="lockWindowPaddingY = Number($event)"
                        @update:lock-window-padding-x="lockWindowPaddingX = Number($event)"
                    />

                    <Button
                        aria-label="Reset Viewport"
                        variant="ghost"
                        :class="canvasButtonClasses"
                        @click="resetViewport"
                    >
                        <RefreshCwIcon class="!size-3.5" />
                        <span class="hidden md:inline">Reset Viewport</span>
                    </Button>
                </div>

                <div class="flex flex-col justify-center space-y-2">
                    <ControlDimensions
                        :width="Number(settings.width)"
                        :height="Number(settings.height)"
                        :lock-window-size="lockWindowSize"
                        @update:width="setWidth($event)"
                        @update:height="setHeight($event)"
                    />

                    <div>
                        <ControlAspectRatios
                            :lock-window-size="lockWindowSize"
                            :aspect-ratios="aspectRatios"
                            :aspect-ratio="settings.aspectRatio"
                            @custom="settings.aspectRatio = null"
                            @select="(x, y) => setAspectRatio(x, y)"
                        />
                    </div>
                </div>

                <CanvasControlSurface class="flex items-center gap-2 px-2.5">
                    <ZoomOutIcon class="size-3.5 text-zinc-500 dark:text-zinc-400" />

                    <Slider
                        aria-label="Canvas zoom"
                        :max="2"
                        :min="0.2"
                        :step="0.01"
                        class="w-40"
                        :model-value="[zoom]"
                        @update:model-value="zoomTo($event[0])"
                    />

                    <ZoomInIcon class="size-3.5 text-zinc-500 dark:text-zinc-400" />
                </CanvasControlSurface>
            </div>

            <ControlTabs
                :tabs="[
                    { name: 'code-preview', title: 'Preview', icon: EyeIcon },
                    { name: 'themes', title: 'Themes', icon: PaletteIcon },
                    {
                        name: 'backgrounds',
                        title: 'Backgrounds',
                        icon: ImageIcon,
                        disabled: hasScene,
                        locked: hasScene,
                    },
                    { name: 'scenes', title: 'Scenes', icon: SparklesIcon },
                ]"
            >
                <template #default="{ active }">
                    <TabPreview
                        v-if="active === 'code-preview'"
                        :blocks="blocks"
                        :settings="settings"
                        :themes="$shiki.themes()"
                        @update="Object.assign(settings, $event)"
                    />

                    <TabThemes
                        v-if="active === 'themes'"
                        :code="code"
                        :settings="settings"
                        :languages="languages"
                        :themes="$shiki.themes()"
                        :theme="settings.themeName"
                        :background="backgroundAttrs"
                        @select="settings.themeName = $event"
                    />

                    <TabBackgrounds
                        v-if="active === 'backgrounds'"
                        :backgrounds="backgrounds"
                        :background="settings.background"
                        :background-color="backgroundColor"
                        @delete="deleteBackground"
                        @add="showingBackgroundsModal = true"
                        @select="settings.background = $event"
                        @color="settings.backgroundColor = $event"
                    />

                    <TabScenes
                        v-if="active === 'scenes'"
                        :scenes="scenes"
                        :active-scene="settings.scene"
                        @select="selectScene"
                    />
                </template>
            </ControlTabs>
        </div>
    </div>
</template>

<script setup>
import download from 'downloadjs';
import { cloneDeep, debounce } from 'lodash';
import { UAParser } from 'ua-parser-js';
import {
    ShareIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ClipboardIcon,
    RefreshCwIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
    EyeIcon,
    PaletteIcon,
    ImageIcon,
    SparklesIcon,
} from 'lucide-vue-next';
import useHighlightedCode from '@/composables/useHighlightedCode';
import usePreviewCapture from '@/composables/usePreviewCapture';
import useScenes from '@/composables/useScenes';
import usePanZoom from '@/composables/usePanZoom';
import usePreview from '@/composables/usePreview';
import useClipboard from '@/composables/useClipboard';
import useBackgrounds from '@/composables/useBackgrounds';
import useAspectRatios from '@/composables/useAspectRatios';
import usePreferencesStore from '@/composables/usePreferencesStore';
import {
    ref,
    watch,
    toRefs,
    nextTick,
    computed,
    onMounted,
    onDeactivated,
    onBeforeUnmount,
} from 'vue';

const props = defineProps({
    name: { type: String, required: false },
    code: { type: Array, required: true },
    defaults: { type: Object, required: true },
    viewport: { type: Object, required: true },
    languages: { type: Array, required: true },
});

const emit = defineEmits(['update:settings', 'update:page', 'update:touched']);

const canvasButtonClasses =
    'h-7 rounded-surface border border-zinc-200/80 bg-white/90 px-2.5 text-zinc-600 shadow-sm backdrop-blur-xl hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-600';

const preview = ref(null);
const canvas = ref(null);
const pane = ref(null);
const exportAs = ref('png');
const resizing = ref(false);
const backgroundButtons = ref([]);
const showingBackgroundsModal = ref(false);

const { $bus } = useNuxtApp();

const { copy, copied } = useClipboard();

const preferences = usePreferencesStore();

const previewRestingY = -150;

const { zoom, zoomTo, centerGuides, createPanZoom, resetViewport } = usePanZoom(props.viewport, {
    startY: previewRestingY,
    centerSnapThreshold: 12,
    centerGuideThreshold: 24,
    cursor: 'grab',
    minScale: 0.2,
    maxScale: 2,
    excludeClass: 'exclude-from-panzoom',
});

const { backgrounds, getBackgroundAttrs, deleteCustomBackground } = useBackgrounds();
const { scenes, applyScene } = useScenes();

const { name, code, languages } = toRefs(props);

const {
    settings,
    setWidth,
    setHeight,
    setAspectRatio,
    resetWindowSize,
    settingsDefaults,
    setDefaultBackground,
} = usePreview(props, { emit, pane });

const {
    title,
    image,
    scale,
    padding,
    landscape,
    showTitle,
    showHeader,
    background,
    backgroundColor,
    themeName,
    themeType,
    themeOpacity,
    themeBackground,
    lockWindowSize,
    lockWindowPaddingX,
    lockWindowPaddingY,
} = toRefs(settings);

const hasScene = computed(() => settings.scene && settings.scene !== 'none');
const { result: highlighted, flush: flushHighlighting } = useHighlightedCode(() => ({
    code: code.value,
    languages: languages.value,
    theme: themeName.value,
    opacity: themeOpacity.value,
}));
const blocks = computed(() => highlighted.value?.blocks ?? []);

watch(
    highlighted,
    (value) => {
        themeType.value = value.themeType;
        themeBackground.value = value.themeBackground;
    },
    { flush: 'sync' }
);

const { capture, captureThumbnail, scheduleThumbnail } = usePreviewCapture(canvas, {
    prepare: flushHighlighting,
    onThumbnail: (value) => {
        image.value = value;
    },
});

async function flushProjectPreview() {
    emitSettingsUpdate.cancel();
    await captureThumbnail();

    emit('update:settings', cloneDeep(settings));
}

defineExpose({ flushProjectPreview });

function saveAs(method) {
    const extension = {
        toPng: 'png',
        toJpeg: 'jpg',
        toSvg: 'svg',
    }[method];

    capture(method, preferences.exportPixelRatio).then((dataUrl) => {
        if (!dataUrl) return;
        const filename = name.value || title.value || 'Untitled-1';

        download(dataUrl, `${filename}.${extension}`);
    });
}

const hasClipboard = computed(() => navigator.clipboard);

function copyToClipboard() {
    if (!hasClipboard.value) {
        return $bus.$emit(
            'alert',
            'danger',
            'Unable to access window.navigator.clipboard. You may have to grant clipboard access for Showcode. Please use the "Export" button instead.'
        );
    }

    const browser = new UAParser().getBrowser();

    const promise = capture('toBlob', preferences.exportPixelRatio);

    switch (browser.name?.toLowerCase()) {
        case 'safari':
            return copy(promise);
        case 'firefox':
            return typeof ClipboardItem !== 'undefined'
                ? promise.then(copy)
                : $bus.$emit(
                      'alert',
                      'danger',
                      'In order to copy images to the clipboard, Showcode.app needs access to the ClipboardItem web API, which is not accessible in Firefox. Please use the "Export" button instead.'
                  );
        default:
            return promise.then(copy);
    }
}

function updateWithCustomBackground(id) {
    background.value = id;
    showingBackgroundsModal.value = false;

    scheduleThumbnail();
}

function deleteBackground(id) {
    if (!confirm('Delete this background?')) {
        return;
    }

    setDefaultBackground();

    deleteCustomBackground(id);
}

function selectScene(id) {
    applyScene(settings, id);

    scheduleThumbnail();
}

function updateScale(delta) {
    if (settings.scene && settings.scene !== 'none') {
        return;
    }

    settings.scale = Number(settings.scale) + Number(delta / 100);
}

const fileTypes = computed(() => [
    {
        name: 'png',
        title: 'PNG',
        click: () => saveAs('toPng'),
    },
    {
        name: 'jpg',
        title: 'JPEG',
        click: () => saveAs('toJpeg'),
    },
    {
        name: 'svg',
        title: 'HTML',
        click: () => saveAs('toSvg'),
    },
]);

const backgroundAttrs = computed(() => {
    if (backgroundColor.value) {
        const color = [
            backgroundColor.value.red,
            backgroundColor.value.green,
            backgroundColor.value.blue,
            backgroundColor.value.alpha,
        ].join(', ');

        return {
            style: {
                backgroundColor: `rgba(${color})`,
            },
        };
    }

    return getBackgroundAttrs(background.value);
});

const emitSettingsUpdate = debounce((values) => emit('update:settings', cloneDeep(values)), 250, {
    maxWait: 1000,
});

watch(settings, emitSettingsUpdate);

onMounted(() => {
    nextTick(() => createPanZoom(preview));

    watch(background, () => (backgroundColor.value = null));

    watch(
        [
            scale,
            blocks,
            padding,
            landscape,
            showTitle,
            showHeader,
            lockWindowSize,
            lockWindowPaddingX,
            lockWindowPaddingY,
        ],
        () => {
            if (lockWindowSize.value) {
                nextTick(() => {
                    setWidth(
                        (pane.value.actualWidth() + Number(lockWindowPaddingX.value)) * scale.value
                    );
                    setHeight(
                        (pane.value.actualHeight() + Number(lockWindowPaddingY.value)) * scale.value
                    );
                });
            }
        }
    );

    watch(
        () => [
            code.value,
            ...Object.keys(settings)
                .filter((key) => key !== 'image')
                .map((key) => settings[key]),
        ],
        scheduleThumbnail,
        { deep: true }
    );
});

onDeactivated(() => emitSettingsUpdate.flush());
onBeforeUnmount(() => emitSettingsUpdate.flush());

const { aspectRatios } = useAspectRatios();
</script>

<style scoped>
.is-resizing :deep(.backdrop-blur-xl),
.is-resizing :deep(.backdrop-blur-md),
.is-resizing :deep(.backdrop-blur-xs) {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
}

.is-resizing :deep(.shadow-lg) {
    box-shadow: none;
}
</style>
