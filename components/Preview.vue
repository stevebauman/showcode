<template>
    <div class="flex flex-col justify-between">
        <div>
            <Hotkeys :shortcuts="['S']" @triggered="copyToClipboard" />

            <ModalImageBackground
                v-model="showingBackgroundsModal"
                :blocks="blocks"
                :settings="settings"
                @saved="updateWithCustomBackground"
                @cancelled="showingBackgroundsModal = false"
            />

            <div class="flex items-center justify-between mx-4">
                <Logo class="w-12 h-12" />

                <div class="flex items-stretch justify-center h-10 gap-2">
                    <Button
                        size="sm"
                        type="button"
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
                        size="sm"
                        class="inline-flex"
                        variant="primary"
                        :items="fileTypes"
                        dusk="button-export"
                    >
                        <ShareIcon class="w-4 h-4" />
                        <span class="hidden sm:inline"> Export Image </span>
                    </Dropdown>

                    <Button
                        v-if="!$config.isDesktop && $config.isDistributing"
                        size="sm"
                        href="/buy"
                        target="_blank"
                        variant="primary"
                    >
                        <ShoppingBagIcon class="w-4 h-4" />
                        <span class="hidden sm:inline"> Desktop App </span>
                    </Button>
                </div>
            </div>

            <div class="mt-4">
                <div class="flex justify-center gap-2 mb-2">
                    <div class="divide-x rounded-lg divide-ui-gray-800">
                        <Button
                            v-for="([x, y], index) in aspectRatios"
                            size="sm"
                            :key="index"
                            :rounded="false"
                            :active="isEqual(settings.aspectRatio, [x, y])"
                            class="justify-center w-16"
                            :class="{
                                'rounded-l-lg': index === 0,
                                'rounded-r-lg': index === aspectRatios.length - 1,
                            }"
                            @click.native="setAspectRatio(x, y)"
                        >
                            {{ x }}:{{ y }}
                        </Button>
                    </div>

                    <Button size="sm" @click.native="resetWindowSize">
                        <MinimizeIcon class="w-4 h-4" />
                        Fit to Window
                    </Button>
                </div>

                <div class="relative flex items-center justify-center">
                    <div>
                        <div
                            ref="canvas"
                            dusk="canvas"
                            class="relative flex"
                            :style="{
                                width: `${settings.width}px`,
                                height: `${settings.height}px`,
                            }"
                        >
                            <div
                                :data-hide="settings.background === 'transparent'"
                                :dusk="`background-${settings.background}`"
                                class="absolute inset-0 w-full h-full"
                                v-bind="backgroundAttrs"
                            ></div>

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromTop"
                                class="absolute top-0 left-1/2 -m-1.5 cursor-resize-height"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromBottom"
                                class="absolute bottom-0 left-1/2 -m-1.5 cursor-resize-height"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromLeft"
                                class="absolute left-0 top-1/2 -m-1.5 cursor-resize-width"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromRight"
                                class="absolute right-0 top-1/2 -m-1.5 cursor-resize-width"
                            />

                            <div class="flex items-center justify-center flex-1 overflow-hidden">
                                <Window
                                    ref="window"
                                    class="z-10"
                                    :blocks="blocks"
                                    :settings="settings"
                                    :dusk="`window-${settings.themeName}`"
                                    @update:title="(title) => (settings.title = title)"
                                />

                                <Divider
                                    data-hide
                                    :title="`${settings.height} px`"
                                    class="absolute top-0 right-0 mx-4 -mr-10 text-xs text-ui-gray-500"
                                />
                            </div>
                        </div>

                        <Separator
                            :title="`${settings.width} px`"
                            class="mt-2 text-xs text-ui-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div class="flex justify-center w-full mt-4">
                <div class="w-full max-w-2xl p-2 space-y-8">
                    <ControlTabs
                        class="shadow"
                        @changed="controlTabChanged"
                        :tabs="[
                            { name: 'code-preview', title: 'Code Preview' },
                            { name: 'themes', title: 'Themes' },
                            { name: 'backgrounds', title: 'Backgrounds' },
                        ]"
                    >
                        <template #default="{ active }">
                            <div
                                v-show="active === 'backgrounds'"
                                dusk="control-backgrounds"
                                class="flex flex-col justify-start w-full gap-4"
                            >
                                <div
                                    class="grid grid-flow-col grid-rows-3 gap-4 p-4 overflow-x-auto auto-cols-max scrollbar-hide"
                                >
                                    <ButtonBackground
                                        v-for="({ name, custom, ...attrs }, index) in backgrounds"
                                        v-bind="attrs"
                                        :ref="`button-background-${name}`"
                                        :dusk="`button-background-${name}`"
                                        :key="index"
                                        :custom="custom"
                                        :active="name === settings.background"
                                        @delete="deleteBackground(name)"
                                        @click.native="settings.background = name"
                                    />
                                </div>

                                <div class="mx-4 mb-4">
                                    <ButtonPlaceholder
                                        v-tooltip.bottom="{
                                            content: $config.isDesktop
                                                ? null
                                                : 'Download the desktop app to upload backgrounds.',
                                        }"
                                        @click.native="showingBackgroundsModal = $config.isDesktop"
                                    >
                                        <PlusCircleIcon class="w-4 h-4" /> Upload
                                    </ButtonPlaceholder>
                                </div>
                            </div>

                            <div v-show="active === 'themes'" dusk="control-themes" class="w-full">
                                <div
                                    class="grid grid-flow-col grid-rows-2 gap-4 p-4 overflow-x-auto auto-cols-max scrollbar-hide"
                                >
                                    <ButtonTheme
                                        v-for="theme in $shiki.themes()"
                                        @click.native="settings.themeName = theme"
                                        :ref="`button-theme-${theme}`"
                                        :dusk="`button-theme-${theme}`"
                                        :key="theme"
                                        :code="code"
                                        :theme="theme"
                                        :active="theme === settings.themeName"
                                        :settings="settings"
                                        :languages="languages"
                                        :background="backgroundAttrs"
                                    />
                                </div>
                            </div>

                            <div v-show="active === 'code-preview'" dusk="control-preview">
                                <ControlRow>
                                    <div class="flex flex-col w-full lg:w-auto">
                                        <Label> Theme </Label>

                                        <Select
                                            dusk="select-theme"
                                            v-model="settings.themeName"
                                            :options="$shiki.themes()"
                                        />
                                    </div>

                                    <div class="flex flex-col w-full lg:w-auto">
                                        <Label> Font Size </Label>

                                        <Select
                                            dusk="select-font-size"
                                            v-model="settings.fontSize"
                                            :options="fontSizes"
                                        />
                                    </div>

                                    <div class="flex flex-col w-full lg:w-auto">
                                        <Label> Font Family </Label>

                                        <Select
                                            dusk="select-font-family"
                                            v-model="settings.fontFamily"
                                            :options="fontFamilies"
                                        />
                                    </div>

                                    <div class="flex flex-col w-full lg:w-auto">
                                        <Label> Line Height </Label>

                                        <Select
                                            dusk="select-line-height"
                                            v-model="settings.lineHeight"
                                            :options="lineHeights"
                                        />
                                    </div>
                                </ControlRow>

                                <ControlRow>
                                    <div class="flex flex-row gap-6">
                                        <div class="flex flex-col items-center justify-between">
                                            <Label> Header </Label>

                                            <div class="flex items-center">
                                                <Toggle
                                                    dusk="toggle-header"
                                                    v-model="settings.showHeader"
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col items-center justify-between">
                                            <Label> Title </Label>

                                            <div class="flex items-center">
                                                <Toggle
                                                    dusk="toggle-title"
                                                    v-model="settings.showTitle"
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col items-center justify-between">
                                            <Label class="whitespace-nowrap"> Menu </Label>

                                            <div class="flex items-center">
                                                <Toggle
                                                    dusk="toggle-color-menu"
                                                    v-model="settings.showMenu"
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col items-center justify-between">
                                            <Label class="whitespace-nowrap"> Menu Color </Label>

                                            <div class="flex items-center">
                                                <Toggle
                                                    dusk="toggle-color-menu"
                                                    v-model="settings.showColorMenu"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-row gap-6">
                                        <div class="flex flex-col items-center justify-between">
                                            <Label> Line Numbers </Label>

                                            <div class="flex items-center">
                                                <Toggle
                                                    dusk="toggle-line-numbers"
                                                    v-model="settings.showLineNumbers"
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col items-center justify-between">
                                            <Label> Shadow </Label>

                                            <div class="flex items-center">
                                                <Toggle
                                                    dusk="toggle-shadow"
                                                    v-model="settings.showShadow"
                                                />
                                            </div>
                                        </div>

                                        <div
                                            v-if="blocks.length > 1"
                                            class="flex flex-col items-center justify-between"
                                        >
                                            <Label>
                                                Orientation ({{ settings.landscape ? 'L' : 'P' }})
                                            </Label>

                                            <div class="flex items-center">
                                                <Toggle
                                                    dusk="toggle-orientation"
                                                    v-model="settings.landscape"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </ControlRow>

                                <ControlRow>
                                    <div class="flex flex-col w-full">
                                        <Label
                                            dusk="label-border-radius"
                                            class="flex items-center space-x-2"
                                        >
                                            <div>Border Radius</div>

                                            <span class="text-xs text-ui-gray-500">
                                                ({{ settings.borderRadius }} px)
                                            </span>
                                        </Label>

                                        <Range
                                            dusk="range-border-radius"
                                            max="20"
                                            step="1"
                                            v-model="settings.borderRadius"
                                        />
                                    </div>

                                    <div class="flex flex-col w-full">
                                        <Label
                                            dusk="label-opacity"
                                            class="flex items-center space-x-2"
                                        >
                                            <div>Opacity</div>

                                            <span class="text-xs text-ui-gray-500">
                                                ({{ Math.round(settings.themeOpacity * 100) }}%)
                                            </span>
                                        </Label>

                                        <Range
                                            dusk="range-theme-opacity"
                                            max="1"
                                            step="0.01"
                                            v-model="settings.themeOpacity"
                                        />
                                    </div>

                                    <div class="flex flex-col w-full">
                                        <Label
                                            dusk="label-scale"
                                            class="flex items-center space-x-2"
                                        >
                                            <div>Scale</div>

                                            <span class="text-xs text-ui-gray-500">
                                                ({{ Math.round(settings.scale * 100) }}%)
                                            </span>
                                        </Label>

                                        <Range
                                            dusk="range-scale"
                                            max="4"
                                            step="0.01"
                                            v-model="settings.scale"
                                        />
                                    </div>

                                    <div class="flex flex-col w-full">
                                        <Label class="flex items-center space-x-2">
                                            <div>Window Padding</div>

                                            <span class="text-xs text-ui-gray-500">
                                                ({{ settings.padding }} px)
                                            </span>
                                        </Label>

                                        <Range
                                            dusk="range-padding"
                                            max="60"
                                            step="1"
                                            v-model="settings.padding"
                                        />
                                    </div>
                                </ControlRow>
                            </div>
                        </template>
                    </ControlTabs>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between mt-8">
            <GitHubCorner />

            <div class="px-4">
                <a
                    href="mailto:steve.bauman@hey.com"
                    class="text-sm underline text-ui-gray-400 hover:no-underline"
                >
                    Support
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import download from 'downloadjs';
import { detect } from 'detect-browser';
import * as htmlToImage from 'html-to-image';
import { head, debounce, isEqual } from 'lodash';
import {
    ShareIcon,
    EyeOffIcon,
    MinimizeIcon,
    ClipboardIcon,
    PlusCircleIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
    ExternalLinkIcon,
} from 'vue-feather-icons';
import useShiki from '../composables/useShiki';
import usePreview from '../composables/usePreview';
import useClipboard from '../composables/useClipboard';
import useBackgrounds from '../composables/useBackgrounds';
import useAspectRatios from '../composables/useAspectRatios';
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

export default {
    props: {
        tab: Object,
        code: Array,
        languages: Array,
    },

    components: {
        ShareIcon,
        EyeOffIcon,
        MinimizeIcon,
        ClipboardIcon,
        PlusCircleIcon,
        ShoppingBagIcon,
        CheckCircleIcon,
        ExternalLinkIcon,
    },

    setup(props, context) {
        const { $bus, $queue } = useContext();

        const { buildCodeBlocks } = useShiki();

        const { copy, copied } = useClipboard();

        const { backgrounds, loadBackgrounds, getBackgroundAttrs, deleteCustomBackground } =
            useBackgrounds();

        const { tab, code, languages } = toRefs(props);

        const { settings, setDefaultBackground, syncSettingsInStorage, ...restOfPreview } =
            usePreview(props, context);

        const { title, image, background, themeName, themeType, themeOpacity, themeBackground } =
            toRefs(settings);

        const canvas = ref(null);
        const blocks = ref([]);
        const exportAs = ref('png');
        const resizing = ref(false);
        const backgroundButtons = ref([]);
        const showingBackgroundsModal = ref(false);

        const generateTokens = () => {
            $queue.push(async () => {
                await buildCodeBlocks(
                    {
                        code: code.value,
                        languages: languages.value,
                        theme: themeName.value,
                        opacity: themeOpacity.value,
                    },
                    ({ blocks: code, themeType: type, themeBackground: background }) => {
                        blocks.value = code;
                        themeType.value = type;
                        themeBackground.value = background;
                    }
                );
            });
        };

        const generateImageFromPreview = (method, pixelRatio = 3) => {
            const filter = (node) => !(node.dataset && node.dataset.hasOwnProperty('hide'));

            return htmlToImage[method](canvas.value, {
                filter,
                pixelRatio,
            });
        };

        const generateTemplateImage = async () => {
            try {
                const png = await generateImageFromPreview('toPng', 1);

                image.value = png;
            } catch (e) {
                console.error('Unable to generate template image.');
            }
        };

        const scrollSelectedThemeIntoView = () =>
            scrollRefIntoView(`button-theme-${themeName.value}`);

        const scrollSelectedBackgroundIntoView = () =>
            scrollRefIntoView(`button-background-${background.value}`);

        const scrollRefIntoView = (ref) => {
            const component = head(context.refs[ref] ?? []);

            if (!component) {
                return;
            }

            const el = component instanceof Vue ? component.$el : component;

            el.scrollIntoView({
                block: 'nearest',
                inline: 'center',
            });
        };

        const controlTabChanged = (tab) => {
            if (tab === 'backgrounds') {
                return nextTick(scrollSelectedBackgroundIntoView);
            }

            if (tab === 'themes') {
                return nextTick(scrollSelectedThemeIntoView);
            }
        };

        const saveAs = (method) => {
            const extension = {
                toPng: 'png',
                toJpeg: 'jpg',
                toSvg: 'svg',
            }[method];

            generateImageFromPreview(method).then((dataUrl) => {
                const name = tab.value.name || title.value || 'Untitled-1';

                download(dataUrl, `${name}.${extension}`);
            });
        };

        const copyToClipboard = () => {
            const browser = detect();

            const promise = generateImageFromPreview('toBlob');

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
        };

        const updateWithCustomBackground = async (id) => {
            await loadBackgrounds();

            background.value = id;

            showingBackgroundsModal.value = false;

            generateTemplateImage();

            scrollSelectedBackgroundIntoView();
        };

        const deleteBackground = (id) => {
            if (!confirm('Are you sure?')) {
                return;
            }

            setDefaultBackground();

            deleteCustomBackground(id);
        };

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

        const backgroundAttrs = computed(() => getBackgroundAttrs(background.value));

        let templateGenerationDebounce = null;

        onMounted(async () => {
            await loadBackgrounds();

            generateTokens();
            generateTemplateImage();

            // Our code will change quickly. We will make
            // sure to debounce the token generation
            // so performance doesn't take a hit.
            watch(code, debounce(generateTokens, 500));

            watch([languages, themeName, themeOpacity], generateTokens);

            watch(
                settings,
                debounce(() => syncSettingsInStorage(tab.value), 500)
            );

            watch(
                () => [settings, code],
                (templateGenerationDebounce = debounce(generateTemplateImage, 1000)),
                { deep: true }
            );
        });

        onBeforeUnmount(() => templateGenerationDebounce?.cancel());

        return {
            isEqual,
            canvas,
            settings,
            fileTypes,
            copied,
            copyToClipboard,
            blocks,
            exportAs,
            resizing,
            backgrounds,
            loadBackgrounds,
            backgroundAttrs,
            deleteBackground,
            backgroundButtons,
            controlTabChanged,
            showingBackgroundsModal,
            updateWithCustomBackground,
            ...restOfPreview,
            ...useAspectRatios(),
        };
    },
};
</script>
