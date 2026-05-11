<template>
    <div class="bg-pattern relative bg-white dark:bg-black">
        <Hotkeys :shortcuts="['S']" @triggered="copyToClipboard" />

        <ModalCustomBackground
            v-model="showingBackgroundsModal"
            :blocks="blocks"
            :settings="settings"
            @saved="updateWithCustomBackground"
            @cancelled="showingBackgroundsModal = false"
        />

        <div class="absolute z-20 flex w-full items-center justify-end p-4">
            <div class="flex h-10 flex-wrap items-center justify-center gap-2">
                <Button
                    variant="ghost"
                    class="rounded-xl border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
                    @click="copyToClipboard"
                >
                    <CheckCircleIcon v-if="copied" class="h-4 w-4 text-green-400" />
                    <ClipboardIcon v-else class="h-4 w-4" />
                    <span class="hidden sm:inline">
                        {{ copied ? 'Copied!' : 'Copy Image' }}
                    </span>
                </Button>

                <Dropdown
                    variant="ghost"
                    :items="fileTypes"
                    button-class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg"
                >
                    <ShareIcon class="h-4 w-4" />
                    <span class="hidden sm:inline">Export Image</span>
                </Dropdown>
            </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center">
            <div ref="preview">
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
                >
                    <template #default="{ sceneGutters }">
                        <Window
                            ref="pane"
                            class="absolute z-[1] flex-shrink-0"
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

        <div class="absolute bottom-0 z-20 w-full p-4">
            <div
                class="flex flex-row-reverse flex-wrap items-center justify-between gap-2 pb-3 md:flex-row"
            >
                <div class="flex flex-shrink-0 items-stretch gap-2">
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
                        variant="ghost"
                        class="rounded-xl border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
                        @click="resetViewport"
                    >
                        <RefreshCwIcon class="h-4 w-4" />
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

                <div
                    class="flex h-8 items-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-3 py-1.5 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
                >
                    <ZoomOutIcon class="h-4 w-4 text-zinc-800 dark:text-zinc-400" />

                    <Slider
                        :max="2"
                        :min="0.2"
                        :step="0.01"
                        class="w-44"
                        :model-value="[zoom]"
                        @update:model-value="zoomTo($event[0])"
                    />

                    <ZoomInIcon class="h-4 w-4 text-zinc-800 dark:text-zinc-400" />
                </div>
            </div>

            <ControlTabs
                :tabs="[
                    { name: 'code-preview', title: 'Preview' },
                    { name: 'themes', title: 'Themes' },
                    {
                        name: 'backgrounds',
                        title: 'Backgrounds',
                        disabled: hasScene,
                        locked: hasScene,
                    },
                    { name: 'scenes', title: 'Scenes' },
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
import { debounce } from 'lodash';
import { UAParser } from 'ua-parser-js';
import * as htmlToImage from 'html-to-image';
import {
    ShareIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ClipboardIcon,
    RefreshCwIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
} from 'lucide-vue-next';
import useShiki from '@/composables/useShiki';
import usePanZoom from '@/composables/usePanZoom';
import usePreview from '@/composables/usePreview';
import useClipboard from '@/composables/useClipboard';
import useScenes from '@/composables/useScenes';
import useBackgrounds from '@/composables/useBackgrounds';
import useAspectRatios from '@/composables/useAspectRatios';
import { ref, watch, toRefs, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';
import usePreferencesStore from '@/composables/usePreferencesStore';

const props = defineProps({
    name: { type: String, required: false },
    code: { type: Array, required: true },
    defaults: { type: Object, required: true },
    viewport: { type: Object, required: true },
    languages: { type: Array, required: true },
});

const emit = defineEmits(['update:settings', 'update:page']);

const preview = ref(null);
const canvas = ref(null);
const blocks = ref([]);
const pane = ref(null);
const exportAs = ref('png');
const resizing = ref(false);
const backgroundButtons = ref([]);
const showingBackgroundsModal = ref(false);

const { $bus } = useNuxtApp();

const { buildCodeBlocks } = useShiki();

const { copy, copied } = useClipboard();

const preferences = usePreferencesStore();

const { zoom, zoomTo, createPanZoom, resetViewport } = usePanZoom(props.viewport, {
    startY: -150,
    cursor: 'grab',
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

function generateTokens() {
    return buildCodeBlocks(
        {
            code: code.value,
            languages: languages.value,
            theme: themeName.value,
            opacity: themeOpacity.value,
        },
        ({ blocks: code, themeType: type, themeBackground: bg }) => {
            blocks.value = code;
            themeType.value = type;
            themeBackground.value = bg;
        }
    );
}

function generateImageFromPreview(method, pixelRatio = 3) {
    const filter = (node) => !(node.dataset && node.dataset.hasOwnProperty('hide'));

    if (!canvas.value?.$el) {
        return;
    }

    return htmlToImage[method](canvas.value.$el, {
        filter,
        pixelRatio,
    });
}

async function generateTemplateImage() {
    try {
        image.value = await generateImageFromPreview('toJpeg', 1);
    } catch (e) {
        console.error('Unable to generate template image.');
    }
}

function saveAs(method) {
    const extension = {
        toPng: 'png',
        toJpeg: 'jpg',
        toSvg: 'svg',
    }[method];

    generateImageFromPreview(method, preferences.exportPixelRatio).then((dataUrl) => {
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

    const promise = generateImageFromPreview('toBlob', preferences.exportPixelRatio);

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

    nextTick(generateTemplateImage);
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

    nextTick(generateTemplateImage);
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

let templateGenerationDebounce = null;

watch(settings, (values) => emit('update:settings', values));

onMounted(() => {
    nextTick(() => createPanZoom(preview));

    generateTokens();
    generateTemplateImage();

    // Our code will change quickly. We will make
    // sure to debounce the token generation
    // so performance doesn't take a hit.
    watch(code, debounce(generateTokens, 500));

    watch(themeOpacity, debounce(generateTokens, 500));

    watch([languages, themeName], generateTokens);

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
        () => [settings, code],
        (templateGenerationDebounce = debounce(generateTemplateImage, 5000)),
        { deep: true }
    );
});

onBeforeUnmount(() => templateGenerationDebounce?.cancel());

const { aspectRatio, aspectRatios, selectAspectRatio, setCustomAspectRatio } = useAspectRatios();
</script>
