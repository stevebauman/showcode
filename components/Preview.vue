<template>
    <div>
        <ModalBackground dusk="modal-backgrounds" v-model="showingBackgroundsModal" />

        <div class="flex items-center justify-between m-4">
            <Logo class="w-12 h-12" />

            <div class="flex items-center justify-center space-x-2">
                <button
                    type="button"
                    dusk="button-copy"
                    @click="copyToClipboard"
                    class="inline-flex items-center h-full gap-2 px-4 py-2 transition duration-100 ease-in-out rounded-lg text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-2 focus:ring-ui-focus"
                >
                    <CheckIcon v-if="copied" class="text-green-300" />
                    <ClipboardIcon v-else class="w-4 h-4" />
                    {{ copied ? 'Copied!' : 'Copy' }}
                </button>

                <Dropdown
                    dusk="button-export"
                    text="Export"
                    :items="fileTypes"
                    @click="saveAs('toPng')"
                />

                <a
                    v-if="!$config.isDesktop && $config.isDistributing"
                    target="_blank"
                    href="https://checkout.unlock.sh/showcode"
                    class="items-center hidden h-full gap-2 px-4 py-2 font-semibold text-white transition duration-100 ease-in-out rounded-lg lg:inline-flex bg-ui-violet-500 hover:bg-ui-violet-600 focus:bg-ui-violet-600 focus:outline-none focus:ring-2 focus:ring-ui-focus"
                >
                    <DownloadCloudIcon class="w-4 h-4" />
                    Desktop App
                </a>
            </div>
        </div>

        <div class="relative flex items-center justify-center">
            <div>
                <div class="flex justify-between mb-2">
                    <Button type="button" @click.native="() => $nuxt.$emit('clear-focused')">
                        <EyeOffIcon class="w-3 h-3" />
                        Clear Focused
                    </Button>

                    <div>
                        <Button
                            v-for="([x, y], index) in aspectRatios"
                            :key="index"
                            type="button"
                            :rounded="false"
                            :active="isEqual(settings.aspectRatio, [x, y])"
                            :class="{
                                'rounded-l-lg': index === 0,
                                'rounded-r-lg': index === aspectRatios.length - 1,
                            }"
                            @click.native="setAspectRatio(x, y)"
                        >
                            {{ x }}:{{ y }}
                        </Button>
                    </div>

                    <Button type="button" @click.native="resetWindowSize">
                        <RefreshCwIcon class="w-3 h-3" />
                        Reset window size
                    </Button>
                </div>

                <div
                    dusk="capture"
                    ref="capture"
                    :style="{
                        minWidth: `${settings.width}px`,
                        minHeight: `${settings.height}px`,
                    }"
                    class="relative flex items-center justify-center h-auto"
                >
                    <div
                        :data-hide="settings.background === 'transparent'"
                        :dusk="`background-${settings.background}`"
                        class="absolute top-0 left-0 w-full h-full"
                        v-bind="background"
                    >
                        <ButtonResize
                            data-hide
                            v-dragged="resizeFromTop"
                            class="absolute top-0 -mt-1 -ml-1 left-1/2 cursor-resize-height"
                        />

                        <ButtonResize
                            data-hide
                            v-dragged="resizeFromBottom"
                            class="absolute bottom-0 -mb-1 -ml-1 left-1/2 cursor-resize-height"
                        />

                        <ButtonResize
                            data-hide
                            v-dragged="resizeFromLeft"
                            class="absolute left-0 -mt-1 -ml-1 top-1/2 cursor-resize-width"
                        />

                        <ButtonResize
                            data-hide
                            v-dragged="resizeFromRight"
                            class="absolute right-0 -mt-1 -mr-1 top-1/2 cursor-resize-width"
                        />
                    </div>

                    <Window
                        dusk="window"
                        ref="window"
                        class="z-10"
                        :blocks="blocks"
                        :settings="settings"
                        @update:title="(title) => (settings.title = title)"
                    />

                    <Divider
                        data-hide
                        :title="`${settings.height} px`"
                        class="absolute top-0 right-0 mx-4 -mr-10 text-xs text-ui-gray-500"
                    />
                </div>

                <Separator :title="`${settings.width} px`" class="mt-2 text-xs text-ui-gray-500" />
            </div>
        </div>

        <div class="flex justify-center w-full mb-8">
            <div class="w-full max-w-xl p-2 space-y-8">
                <ControlSection dusk="control-backgrounds" class="shadow-xl">
                    <template #title>
                        Backgrounds

                        <div v-if="customBackgrounds" class="absolute right-0 mr-2 inset-y">
                            <button
                                @click="showingBackgroundsModal = true"
                                class="h-full bg-ui-gray-800 hover:bg-ui-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-focus"
                            >
                                <PlusCircleIcon class="w-4 h-4 text-ui-gray-500" />
                            </button>
                        </div>
                    </template>

                    <div class="flex justify-start w-full p-4 overflow-x-auto scrollbar-hide">
                        <div class="grid grid-flow-col grid-rows-3 gap-4 auto-cols-max">
                            <ButtonBackground
                                v-for="({ name, ...attrs }, index) in backgrounds"
                                v-bind="attrs"
                                :ref="`button-background-${name}`"
                                :dusk="`button-background-${name}`"
                                :key="index"
                                :active="name === settings.background"
                                @click.native="settings.background = name"
                            />
                        </div>
                    </div>
                </ControlSection>

                <ControlSection dusk="control-preview" title="Code Preview" class="shadow-xl">
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
                        <div class="flex flex-row gap-4">
                            <div class="flex flex-col items-center justify-between">
                                <Label> Header </Label>

                                <div class="flex items-center">
                                    <Toggle dusk="toggle-header" v-model="settings.showHeader" />
                                </div>
                            </div>

                            <div class="flex flex-col items-center justify-between">
                                <Label> Title </Label>

                                <div class="flex items-center">
                                    <Toggle dusk="toggle-title" v-model="settings.showTitle" />
                                </div>
                            </div>

                            <div class="flex flex-col items-center justify-between">
                                <Label class="whitespace-nowrap"> Menu </Label>

                                <div class="flex items-center">
                                    <Toggle dusk="toggle-color-menu" v-model="settings.showMenu" />
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
                                    <Toggle dusk="toggle-shadow" v-model="settings.showShadow" />
                                </div>
                            </div>
                        </div>
                    </ControlRow>

                    <ControlRow class="md:max-w-lg">
                        <div class="flex flex-col w-full">
                            <Label dusk="label-border-radius" class="flex items-center space-x-2">
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
                            <Label dusk="label-opacity" class="flex items-center space-x-2">
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
                </ControlSection>
            </div>
        </div>

        <div class="flex items-end justify-between w-full">
            <GitHubCorner />

            <div class="p-4">
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
import collect from 'collect.js';
import download from 'downloadjs';
import { detect } from 'detect-browser';
import { head, debounce, isEqual } from 'lodash';
import { gradients } from '~/data/gradients';
import * as htmlToImage from 'html-to-image';
import {
    EyeOffIcon,
    CheckIcon,
    RefreshCwIcon,
    ClipboardIcon,
    PlusCircleIcon,
    ExternalLinkIcon,
    DownloadCloudIcon,
} from 'vue-feather-icons';
import useShiki from '../composables/useShiki';
import useSettings from '../composables/useSettings';
import useAspectRatios from '../composables/useAspectRatios';

export default {
    props: {
        tab: Object,
        code: Array,
        languages: Array,
    },

    components: {
        CheckIcon,
        EyeOffIcon,
        RefreshCwIcon,
        ClipboardIcon,
        PlusCircleIcon,
        ExternalLinkIcon,
        DownloadCloudIcon,
    },

    setup() {
        return {
            isEqual,
            ...useShiki(),
            ...useSettings(),
            ...useAspectRatios(),
        };
    },

    data() {
        return {
            blocks: [],
            copied: false,
            exportAs: 'png',
            resizing: false,
            backgrounds: [],
            customBackgrounds: false,
            showingBackgroundsModal: false,
        };
    },

    created() {
        this.listenForSaveKeyboardShortcut();

        this.backgrounds.push(...gradients);
    },

    mounted() {
        this.listenForPreviewSizeChanges();

        this.$nextTick(async () => {
            await this.restoreSettingsFromStorage(this.tab);

            this.scrollSelectedBackgroundIntoView();

            this.generateTokens();
        });
    },

    beforeDestroy() {
        this.terminatePreviewSizeListener();
    },

    watch: {
        settings: {
            deep: true,
            handler: debounce(function () {
                this.syncSettingsInStorage(this.tab);
                this.generateTemplateImage();
            }, 500),
        },

        languages: {
            deep: true,
            handler() {
                this.generateTokens();
            },
        },

        'settings.themeName'() {
            this.generateTokens();
        },

        'settings.themeOpacity'() {
            this.generateTokens();
        },

        'settings.showHeader'(enabled) {
            this.settings.showTitle = enabled;
            this.settings.showMenu = enabled;
            this.settings.showColorMenu = enabled;
        },

        code: debounce(function () {
            this.generateTokens();
            this.generateTemplateImage();
        }, 500),
    },

    computed: {
        fileTypes() {
            return [
                {
                    name: 'png',
                    title: 'PNG',
                    click: () => this.saveAs('toPng'),
                },
                {
                    name: 'jpg',
                    title: 'JPEG',
                    click: () => this.saveAs('toJpeg'),
                },
                {
                    name: 'svg',
                    title: 'SVG',
                    click: () => this.saveAs('toSvg'),
                },
            ];
        },

        background() {
            const { name, ...attrs } = collect(this.backgrounds).first(
                ({ name }) => name === this.settings.background,
                () => this.defaultBackground
            );

            return attrs;
        },

        defaultBackground() {
            return this.backgrounds.find(({ name }) => name === DEFAULT_BACKGROUND);
        },
    },

    asyncComputed: {
        async customBackgrounds() {
            const backgrounds = await this.$memory.settings.get('backgrounds');

            this.backgrounds.push(
                ...backgrounds
                    .toCollection()
                    .map((bg, key) => ({
                        name: key,
                        class: `${bg.direction} from-${bg.from} via-${bg.via} to-${bg.to}`,
                    }))
                    .toArray()
            );
        },
    },

    methods: {
        /**
         * Attempt to locate the selected background button ref and scroll it into view.
         */
        scrollSelectedBackgroundIntoView() {
            const key = `button-background-${this.settings.background}`;

            const ref = head(this.$refs[key]);

            if (ref) {
                ref.$el.scrollIntoView({
                    block: 'nearest',
                    inline: 'center',
                });
            }
        },

        /**
         * Create a keydown listener waiting for CTRL/CMD+S.
         */
        listenForSaveKeyboardShortcut() {
            document.addEventListener(
                'keydown',
                (e) => {
                    const pressingCtrlKey = window.navigator.platform.match('Mac')
                        ? e.metaKey
                        : e.ctrlKey;

                    const pressingSKey = e.keyCode == 83;

                    if (pressingCtrlKey && pressingSKey) {
                        e.preventDefault();

                        this.copyToClipboard();
                    }
                },
                false
            );
        },

        /**
         * Listen for preview window size changes to update the capture dimensions.
         */
        listenForPreviewSizeChanges() {
            this.previewObserver = new ResizeObserver(this.updateCaptureDimensions).observe(
                this.$refs.window.$el
            );
        },

        /**
         * Terminate the preview window size observer.
         */
        terminatePreviewSizeListener() {
            this.previewObserver?.unobserve(this.$refs.window.$el);
        },

        /**
         * Reset the preview window size.
         */
        resetWindowSize() {
            this.settings.width = DEFAULT_WIDTH;
            this.settings.height = DEFAULT_HEIGHT;

            this.updateCaptureDimensions();
        },

        /**
         * Update the capture dimensions to the current capture's actual dimensions.
         */
        updateCaptureDimensions() {
            this.$nextTick(() => {
                // We need to make sure the element exists
                // and it's visible before attempting to
                // update our width and height values.
                if (this.$refs.capture && this.$refs.capture.offsetParent) {
                    this.settings.height = this.$refs.capture.offsetHeight;
                    this.settings.width = this.$refs.capture.offsetWidth;
                }
            });
        },

        /**
         * Handle the resizing of height from the top side.
         *
         * @param {Object} event
         */
        resizeFromTop(event) {
            this.resizeHeight(event, -1);
        },

        /**
         * Handle the resizing of height from the bottom side.
         *
         * @param {Object} event
         */
        resizeFromBottom(event) {
            this.resizeHeight(event, 1);
        },

        /**
         * Handle the resizing of width from the left side.
         *
         * @param {Object} event
         */
        resizeFromLeft(event) {
            this.resizeWidth(event, -1);
        },

        /**
         * Handle the resizing of width from the right side.
         *
         * @param {Object} event
         */
        resizeFromRight(event) {
            this.resizeWidth(event, 1);
        },

        /**
         * Handle the resizing of height.
         *
         * @param {Object} event
         * @param {Number} side
         */
        resizeHeight(event, side = -1) {
            if (isNaN(event.offsetY)) {
                return;
            }

            const height =
                side < 0
                    ? this.settings.height - event.deltaY
                    : this.settings.height + event.deltaY;

            const minHeight = this.$refs.window.$el.offsetHeight;

            if (height < minHeight) {
                return;
            }

            this.settings.height = height;
        },

        /**
         * Handle the resizing of width.
         *
         * @param {Object} event
         * @param {Number} side
         */
        resizeWidth(event, side = -1) {
            if (isNaN(event.offsetX)) {
                return;
            }

            this.settings.aspectRatio = null;

            const width =
                side < 0
                    ? this.settings.width - event.deltaX * 2
                    : this.settings.width + event.deltaX * 2;

            const minWidth = this.$refs.window.$el.offsetWidth;

            if (width < minWidth) {
                return;
            }

            this.settings.width = width;
        },

        /**
         * Export the code preview to the users computer.
         *
         * @param {String} method
         */
        saveAs(method) {
            const extension = {
                toPng: 'png',
                toJpeg: 'jpg',
                toSvg: 'svg',
            }[method];

            this.generateImageFromPreview(method).then((dataUrl) => {
                const title = this.tab.name || this.settings.title || 'Untitled-1';

                download(dataUrl, `${title}.${extension}`);
            });
        },

        /**
         * Copy the image preview to the users clipboard.
         */
        copyToClipboard() {
            const browser = detect();

            const promise = this.generateImageFromPreview('toBlob');

            const copy = (content) =>
                navigator.clipboard
                    .write([new ClipboardItem({ 'image/png': content })])
                    .then(() => (this.copied = true))
                    .then(() => window.setTimeout(() => (this.copied = false), 4000));

            switch (browser && browser.name) {
                case 'safari':
                    return copy(promise);
                case 'firefox':
                    return typeof ClipboardItem !== 'undefined'
                        ? promise.then(copy)
                        : this.$nuxt.$emit(
                              'alert',
                              'danger',
                              'In order to copy images to the clipboard, Showcode.app needs access to the ClipboardItem web API, which is not accessible in Firefox. Please use the "Export" button instead.'
                          );
                default:
                    return promise.then(copy);
            }
        },

        /**
         * Generate the current preview's template image.
         */
        async generateTemplateImage() {
            try {
                const image = await this.generateImageFromPreview('toPng', 1);

                this.settings.image = image;
            } catch (e) {
                console.error('Unable to generate template image.');
            }
        },

        /**
         * Generate a new image preview from the given export method.
         *
         * @param {String} method
         * @param {Number} pixelRatio
         *
         * @return {Promise}
         */
        generateImageFromPreview(method, pixelRatio = 3) {
            const filter = (node) => !(node.dataset && node.dataset.hasOwnProperty('hide'));

            return htmlToImage[method](this.$refs.capture, {
                filter,
                pixelRatio,
            });
        },

        /**
         * Generate the code tokens.
         */
        generateTokens() {
            this.$queue.push(async () => {
                await this.buildCodeBlocks(
                    {
                        code: this.code,
                        languages: this.languages,
                        theme: this.settings.themeName,
                        opacity: this.settings.themeOpacity,
                    },
                    ({ blocks, themeType, themeBackground }) => {
                        this.blocks = blocks;
                        this.settings.themeType = themeType;
                        this.settings.themeBackground = themeBackground;
                    }
                );
            });
        },
    },
};
</script>
