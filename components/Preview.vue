<template>
    <div class="relative bg-pattern bg-ui-gray-900">
        <Hotkeys :shortcuts="['S']" @triggered="copyToClipboard" />

        <ModalCustomBackground
            v-model="showingBackgroundsModal"
            :blocks="blocks"
            :settings="settings"
            @saved="updateWithCustomBackground"
            @cancelled="showingBackgroundsModal = false"
        />

        <div class="absolute z-20 flex items-center justify-between w-full p-4">
            <a href="https://github.com/stevebauman/showcode" target="_blank">
                <Logo class="flex-shrink-0 w-12 h-12" />
            </a>

            <div class="flex flex-wrap items-center justify-center h-10 gap-2">
                <Button
                    size="xs"
                    type="button"
                    class="shadow"
                    dusk="button-copy"
                    variant="secondary"
                    @click.native="copyToClipboard"
                >
                    <CheckCircleIcon v-if="copied" class="w-4 h-4 text-green-400" />
                    <ClipboardIcon v-else class="w-4 h-4" />
                    <span class="hidden sm:inline">
                        {{ copied ? 'Copied!' : 'Copy Image' }}
                    </span>
                </Button>

                <Dropdown
                    size="xs"
                    variant="secondary"
                    :items="fileTypes"
                    dusk="button-export"
                    class="inline-flex rounded-lg shadow"
                >
                    <ShareIcon class="w-4 h-4" />
                    <span class="hidden sm:inline"> Export Image </span>
                </Dropdown>

                <Button
                    v-if="!$config.isDesktop && $config.isDistributing"
                    size="xs"
                    href="/buy"
                    class="shadow"
                    target="_blank"
                    variant="secondary"
                >
                    <ShoppingBagIcon class="w-4 h-4" />
                    <span class="hidden sm:inline"> Desktop App </span>
                </Button>

                <Button
                    size="xs"
                    href="https://api.showcode.app/docs"
                    class="shadow"
                    target="_blank"
                    variant="secondary"
                >
                    <CodeIcon class="w-4 h-4" />
                    <span class="hidden sm:inline"> API </span>
                </Button>
            </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center">
            <div ref="preview">
                <Canvas
                    ref="canvas"
                    dusk="canvas"
                    class="relative flex canvas justify-center items-center"
                    :zoom="zoom"
                    :resizable="!lockWindowSize"
                    :position="settings.position"
                    :width="Number(settings.width)"
                    :height="Number(settings.height)"
                    :aspect-ratio="settings.aspectRatio"
                    :background="settings.background"
                    :background-attributes="backgroundAttrs"
                    @update:width="setWidth($event)"
                    @update:height="setHeight($event)"
                >
                    <Window
                        ref="pane"
                        class="z-[1] absolute flex-shrink-0"
                        :zoom="zoom"
                        :blocks="blocks"
                        :settings="settings"
                        :dusk="`window-${settings.themeName}`"
                        @update:title="settings.title = $event"
                        @update:scale="
                            settings.scale = Number(settings.scale) + Number($event / 100)
                        "
                    />
                </Canvas>
            </div>
        </div>

        <div class="absolute bottom-0 z-20 w-full">
            <div
                class="flex flex-row-reverse flex-wrap items-center justify-between gap-2 p-4 md:flex-row"
            >
                <div class="flex items-stretch flex-shrink-0 gap-2">
                    <ControlFitToWindow
                        :lock-window-size="lockWindowSize"
                        :lock-window-padding-y="Number(lockWindowPaddingY)"
                        :lock-window-padding-x="Number(lockWindowPaddingX)"
                        @apply="resetWindowSize"
                        @update:lock-window-size="lockWindowSize = $event"
                        @update:lock-window-padding-y="lockWindowPaddingY = Number($event)"
                        @update:lock-window-padding-x="lockWindowPaddingX = Number($event)"
                    />

                    <Button size="xs" class="shadow" @click.native="resetViewport">
                        <RefreshCwIcon class="w-4 h-4" />
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
                    class="flex items-center h-full gap-2 px-2 py-1 rounded-lg shadow bg-ui-gray-700 highlight"
                >
                    <ZoomOutIcon class="w-4 h-4 text-ui-gray-400" />

                    <Range
                        max="2"
                        min="0.2"
                        step="0.01"
                        class="w-44"
                        :value="zoom"
                        @input="zoomTo($event)"
                    />

                    <ZoomInIcon class="w-4 h-4 text-ui-gray-400" />
                </div>
            </div>

            <ControlTabs
                :tabs="[
                    { name: 'code-preview', title: 'Preview' },
                    { name: 'themes', title: 'Themes' },
                    { name: 'backgrounds', title: 'Backgrounds' },
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
                        @select="settings.background = $event"
                        @color="settings.backgroundColor = $event"
                        @add="showingBackgroundsModal = $config.isDesktop"
                    />
                </template>
            </ControlTabs>
        </div>
    </div>
</template>

<script>
import download from 'downloadjs';
import { debounce } from 'lodash';
import { detect } from 'detect-browser';
import * as htmlToImage from 'html-to-image';
import {
    CodeIcon,
    ShareIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ClipboardIcon,
    RefreshCwIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
} from 'vue-feather-icons';
import useShiki from '@/composables/useShiki';
import usePanZoom from '@/composables/usePanZoom';
import usePreview from '@/composables/usePreview';
import useClipboard from '@/composables/useClipboard';
import useBackgrounds from '@/composables/useBackgrounds';
import useAspectRatios from '@/composables/useAspectRatios';
import {
    ref,
    watch,
    toRefs,
    nextTick,
    computed,
    onMounted,
    useContext,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';
import usePreferencesStore from '@/composables/usePreferencesStore';

export default {
    props: {
        name: {
            type: String,
            required: false,
        },
        code: {
            type: Array,
            required: true,
        },
        defaults: {
            type: Object,
            required: true,
        },
        languages: {
            type: Array,
            required: true,
        },
    },

    components: {
        CodeIcon,
        ShareIcon,
        ZoomInIcon,
        ZoomOutIcon,
        RefreshCwIcon,
        ClipboardIcon,
        ShoppingBagIcon,
        CheckCircleIcon,
    },

    setup(props, context) {
        const preview = ref(null);
        const canvas = ref(null);
        const blocks = ref([]);
        const pane = ref(null);
        const exportAs = ref('png');
        const resizing = ref(false);
        const backgroundButtons = ref([]);
        const showingBackgroundsModal = ref(false);

        const { $bus } = useContext();

        const { buildCodeBlocks } = useShiki();

        const { copy, copied } = useClipboard();

        const preferences = usePreferencesStore();

        const { zoom, zoomTo, createPanZoom, resetViewport } = usePanZoom({
            startY: -150,
            cursor: 'grab',
            excludeClass: 'exclude-from-panzoom',
        });

        const { backgrounds, getBackgroundAttrs, deleteCustomBackground } = useBackgrounds();

        const { name, code, languages } = toRefs(props);

        const {
            settings,
            setWidth,
            setHeight,
            settingsDefaults,
            setDefaultBackground,
            ...restOfPreview
        } = usePreview(props, context);

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

            const browser = detect();

            const promise = generateImageFromPreview('toBlob', preferences.exportPixelRatio);

            switch (browser && browser.name) {
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

        watch(settings, (values) => context.emit('update:settings', values));

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
                                (pane.value.actualWidth() + Number(lockWindowPaddingX.value)) *
                                    scale.value
                            );
                            setHeight(
                                (pane.value.actualHeight() + Number(lockWindowPaddingY.value)) *
                                    scale.value
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

        return {
            pane,
            zoom,
            canvas,
            preview,
            settings,
            settingsDefaults,
            fileTypes,
            copied,
            copyToClipboard,
            blocks,
            zoomTo,
            exportAs,
            resizing,
            setWidth,
            setHeight,
            backgrounds,
            backgroundColor,
            resetViewport,
            backgroundAttrs,
            deleteBackground,
            backgroundButtons,
            lockWindowSize,
            lockWindowPaddingX,
            lockWindowPaddingY,
            showingBackgroundsModal,
            updateWithCustomBackground,
            ...restOfPreview,
            ...useAspectRatios(),
        };
    },
};
</script>
