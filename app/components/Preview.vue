<template>
    <div
        class="preview-layout bg-ui-canvas relative flex min-h-0 min-w-0"
        :class="{ 'is-resizing': resizing }"
    >
        <ModalCustomBackground
            v-model="showingBackgroundsModal"
            :blocks="blocks"
            :settings="settings"
            @saved="updateWithCustomBackground"
            @cancelled="showingBackgroundsModal = false"
        />

        <div class="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <div class="bg-ui-canvas relative min-h-0 flex-1 overflow-hidden" data-canvas-workspace>
                <div
                    aria-hidden="true"
                    data-center-guide="x"
                    class="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-violet-500/50 transition-opacity duration-100"
                    :class="centerGuides.x ? 'opacity-100' : 'opacity-0'"
                />
                <div
                    aria-hidden="true"
                    data-center-guide="y"
                    class="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-violet-500/50 transition-opacity duration-100"
                    :class="centerGuides.y ? 'opacity-100' : 'opacity-0'"
                />

                <!-- Panzoom measures focal points from its parent's origin. -->
                <div
                    ref="preview"
                    data-preview-viewport
                    class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                >
                    <Canvas
                        ref="canvas"
                        class="canvas pointer-events-auto relative flex shrink-0 items-center justify-center"
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

            <div
                role="group"
                aria-label="Preview tools"
                ref="previewDock"
                class="floating-toolbar preview-dock exclude-from-panzoom border-ui-line bg-ui-chrome absolute right-3 bottom-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-end gap-0.5 rounded-full border p-1"
            >
                <ButtonCopyImage
                    compact
                    :copying="copying"
                    :copied="copied"
                    :class="canvasButtonClasses"
                    v-tooltip="'Copy image'"
                    @click="copyToClipboard"
                />
                <Dropdown
                    variant="ghost"
                    side="top"
                    :items="fileTypes"
                    button-aria-label="Export Image"
                    :button-class="canvasButtonClasses"
                >
                    <ShareIcon class="!size-3.5" />
                </Dropdown>

                <div class="bg-ui-line mx-1 h-4 w-px shrink-0" aria-hidden="true" />

                <ControlFitToWindow
                    compact
                    :lock-window-size="lockWindowSize"
                    :lock-window-padding-y="Number(lockWindowPaddingY)"
                    :lock-window-padding-x="Number(lockWindowPaddingX)"
                    @apply="resetWindowSize"
                    @update:lock-window-size="lockWindowSize = $event"
                    @update:lock-window-padding-y="lockWindowPaddingY = Number($event)"
                    @update:lock-window-padding-x="lockWindowPaddingX = Number($event)"
                />
                <ControlZoom
                    compact
                    class="shrink-0"
                    :model-value="zoom"
                    @update:model-value="zoomTo"
                    @fit="fitViewport"
                    @reset="resetViewport"
                />

                <div class="flex items-center gap-0.5" :class="{ 'hidden lg:flex': inspectorOpen }">
                    <div class="bg-ui-line mx-1 h-4 w-px shrink-0" aria-hidden="true" />

                    <div class="hidden lg:flex">
                        <ControlWorkspaceLayout
                            :orientation="orientation"
                            @update:orientation="$emit('update:orientation', $event)"
                        />
                    </div>
                    <Button
                        v-if="!inspectorOpen"
                        ref="inspectorToggle"
                        type="button"
                        variant="ghost"
                        :class="canvasButtonClasses"
                        aria-label="Show inspector"
                        :aria-expanded="false"
                        :aria-controls="inspectorId"
                        v-tooltip="'Show inspector'"
                        @click="openInspector"
                    >
                        <PanelRightIcon class="!size-4" />
                    </Button>
                </div>
            </div>
        </div>

        <Transition name="inspector">
            <div
                v-show="inspectorOpen"
                class="inspector-shell absolute inset-y-0 right-0 z-30 overflow-hidden md:relative md:inset-auto"
                :data-open="inspectorOpen"
                :class="{
                    'pointer-events-none': !inspectorOpen,
                    'shadow-lg md:shadow-none': inspectorOpen,
                }"
            >
                <ControlTabs
                    ref="inspectorPanel"
                    :id="inspectorId"
                    class="inspector-panel absolute inset-y-0 right-0"
                    :aria-hidden="!inspectorOpen"
                    :inert="!inspectorOpen"
                    :tabs="[
                        { name: 'code-preview', title: 'Style' },
                        { name: 'themes', title: 'Themes' },
                        {
                            name: 'backgrounds',
                            title: 'Backdrop',
                            disabled: hasScene,
                            locked: hasScene,
                        },
                        { name: 'scenes', title: 'Scenes' },
                    ]"
                    @close="closeInspector"
                >
                    <template #default="{ active }">
                        <div
                            v-if="active === 'code-preview'"
                            class="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                        >
                            <section
                                class="border-ui-line space-y-3 border-b p-4"
                                aria-label="Canvas size"
                            >
                                <h3 class="text-ui-text text-xs font-medium">Canvas</h3>
                                <ControlDimensions
                                    :width="Number(settings.width)"
                                    :height="Number(settings.height)"
                                    :lock-window-size="lockWindowSize"
                                    @update:width="setWidth($event)"
                                    @update:height="setHeight($event)"
                                />
                                <ControlAspectRatios
                                    :lock-window-size="lockWindowSize"
                                    :aspect-ratios="aspectRatios"
                                    :aspect-ratio="settings.aspectRatio"
                                    @custom="settings.aspectRatio = null"
                                    @select="(x, y) => setAspectRatio(x, y)"
                                />
                            </section>
                            <TabPreview
                                :blocks="blocks"
                                :settings="settings"
                                :themes="$shiki.themes()"
                                @update="Object.assign(settings, $event)"
                            />
                        </div>
                        <TabThemes
                            v-if="active === 'themes'"
                            class="min-h-0 flex-1"
                            :code="code"
                            :settings="settings"
                            :languages="languages"
                            :themes="$shiki.themes()"
                            :theme="settings.themeName"
                            :background="backgroundAttrs"
                            @select="settings.themeName = $event"
                        />
                        <div
                            v-if="active === 'backgrounds'"
                            class="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                        >
                            <TabBackgrounds
                                :backgrounds="backgrounds"
                                :background="settings.background"
                                :background-color="backgroundColor"
                                @delete="deleteBackground"
                                @add="showingBackgroundsModal = true"
                                @select="settings.background = $event"
                                @color="settings.backgroundColor = $event"
                            />
                        </div>
                        <div
                            v-if="active === 'scenes'"
                            class="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                        >
                            <TabScenes
                                :scenes="scenes"
                                :active-scene="settings.scene"
                                @select="selectScene"
                            />
                        </div>
                    </template>
                </ControlTabs>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import download from 'downloadjs';
import { toast } from 'vue-sonner';
import { UAParser } from 'ua-parser-js';
import { ShareIcon, ShoppingBagIcon, PanelRightIcon } from 'lucide-vue-next';
import useHighlightedCode from '@/composables/useHighlightedCode';
import usePreviewCapture from '@/composables/usePreviewCapture';
import useScenes from '@/composables/useScenes';
import usePanZoom from '@/composables/usePanZoom';
import usePreview from '@/composables/usePreview';
import useClipboard from '@/composables/useClipboard';
import useBackgrounds from '@/composables/useBackgrounds';
import useAspectRatios from '@/composables/useAspectRatios';
import usePreferencesStore from '@/composables/usePreferencesStore';
import { ref, watch, toRefs, nextTick, computed, onMounted, useId } from 'vue';

const props = defineProps({
    name: { type: String, required: false },
    orientation: { type: String, default: 'left' },
    code: { type: Array, required: true },
    settings: { type: Object, required: true },
    viewport: { type: Object, required: true },
    languages: { type: Array, required: true },
});

const emit = defineEmits(['update:touched', 'update:orientation']);

const canvasButtonClasses =
    'size-7 shrink-0 rounded-full p-0 text-ui-muted hover:bg-ui-hover hover:text-ui-text';

const inspectorOpen = ref(true);
const inspectorToggle = ref(null);
const inspectorPanel = ref(null);
const inspectorId = useId();

function openInspector() {
    inspectorOpen.value = true;
    nextTick(() => inspectorPanel.value?.focusToggle());
}

function closeInspector() {
    inspectorOpen.value = false;
    nextTick(() => inspectorToggle.value?.$el?.focus());
}

const preview = ref(null);
const previewDock = ref(null);
const canvas = ref(null);
const pane = ref(null);
const exportAs = ref('png');
const resizing = ref(false);
const backgroundButtons = ref([]);
const showingBackgroundsModal = ref(false);
const copying = ref(false);

const { copy, copied } = useClipboard();

const preferences = usePreferencesStore();

const previewRestingY = 0;

const { zoom, zoomTo, panzoom, centerGuides, createPanZoom, resetViewport } = usePanZoom(
    props.viewport,
    {
        startY: previewRestingY,
        centerSnapThreshold: 12,
        centerGuideThreshold: 24,
        cursor: 'grab',
        minScale: Number.MIN_VALUE,
        maxScale: Number.MAX_VALUE,
        excludeClass: 'exclude-from-panzoom',
    }
);

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

defineExpose({ captureThumbnail });

function fitViewport() {
    const surface = preview.value.parentElement;
    const width = Number(settings.width);
    const height = Number(settings.height);
    const dockClearance = previewDock.value.offsetHeight + 18;

    zoomTo(
        Math.min(
            Math.max(1, surface.clientWidth - 48) / width,
            Math.max(1, surface.clientHeight - dockClearance * 2) / height
        )
    );
    panzoom.value.pan(0, previewRestingY);
}

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

async function copyToClipboard() {
    if (copying.value) {
        return;
    }

    if (!hasClipboard.value) {
        return toast.error(
            'Unable to access window.navigator.clipboard. You may have to grant clipboard access for Showcode. Please use the "Export" button instead.'
        );
    }

    if (typeof ClipboardItem === 'undefined') {
        return toast.error(
            'Your browser does not support copying images to the clipboard. Please use the "Export" button instead.'
        );
    }

    copying.value = true;
    copied.value = false;

    // Give the browser a frame to paint the busy state before capturing the canvas.
    const promise = new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    }).then(() => capture('toBlob', preferences.exportPixelRatio));

    try {
        const browser = new UAParser().getBrowser();

        // Safari needs the clipboard write to begin within the original click event.
        if (browser.name?.toLowerCase() === 'safari') {
            await copy(promise);
        } else {
            await copy(await promise);
        }
    } catch (error) {
        toast.error(
            'Unable to copy the image. Please try again or use the "Export" button instead.'
        );
    } finally {
        copying.value = false;
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

const { aspectRatios } = useAspectRatios();
</script>

<style scoped>
.preview-layout {
    container-type: inline-size;
}

.inspector-shell {
    width: min(20rem, 100cqw);
    flex-shrink: 0;
}

.inspector-panel {
    width: min(20rem, 100cqw);
}

@media (min-width: 768px) {
    .inspector-shell.inspector-enter-from,
    .inspector-shell.inspector-leave-to {
        width: 0;
    }
}

.preview-dock {
    box-shadow: 0 4px 16px rgb(0 0 0 / 16%);
}

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
