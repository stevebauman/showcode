<template>
    <div>
        <div class="flex items-center justify-between m-4">
            <Logo class="w-10 h-10 text-ui-gray-100" />

            <div class="flex items-center justify-center space-x-2">
                <button
                    type="button"
                    @click="copyToClipboard"
                    class="inline-flex items-center h-full gap-2 px-4 py-2 rounded-lg cursor-pointer  text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-2 focus:ring-ui-focus"
                >
                    <CheckIcon v-if="copied" class="text-green-300" />
                    <ClipboardIcon v-else class="w-4 h-4" />
                    {{ copied ? 'Copied!' : 'Copy' }}
                </button>

                <Dropdown text="Export" :items="fileTypes" @click="saveAs('toPng')" />
            </div>
        </div>

        <div class="space-y-6">
            <div class="relative flex items-center justify-center">
                <div>
                    <div class="flex justify-between my-4">
                        <button
                            type="button"
                            @click="() => $nuxt.$emit('clear-focused')"
                            class="inline-flex items-center h-full gap-2 px-2 py-1 text-sm rounded-lg cursor-pointer  text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-2 focus:ring-ui-focus"
                        >
                            <EyeOffIcon class="w-3 h-3" />
                            Clear Focused
                        </button>

                        <button
                            type="button"
                            @click="resetWindowSize"
                            class="inline-flex items-center h-full gap-2 px-2 py-1 text-sm rounded-lg cursor-pointer  text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-2 focus:ring-ui-focus"
                        >
                            <RefreshCwIcon class="w-3 h-3" />
                            Reset window size
                        </button>
                    </div>

                    <div
                        ref="capture"
                        :style="{
                            minWidth: `${settings.width}px`,
                            minHeight: `${settings.height}px`,
                            padding: `${settings.backgroundPadding}px`,
                        }"
                        class="relative flex items-center justify-center h-auto"
                    >
                        <div
                            :data-hide="settings.background === 'transparent'"
                            :class="`background-${settings.background}`"
                            class="absolute top-0 left-0 w-full h-full"
                        >
                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromTop"
                                class="absolute top-0 z-20 -mt-1 rounded-full  left-1/2 cursor-resize-height"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromBottom"
                                class="absolute bottom-0 z-20 -mb-1 rounded-full  left-1/2 cursor-resize-height"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromLeft"
                                class="absolute left-0 z-20 -ml-1 rounded-full  top-1/2 cursor-resize-width"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromRight"
                                class="absolute right-0 z-20 -mr-1 rounded-full  top-1/2 cursor-resize-width"
                            />
                        </div>

                        <Window
                            ref="preview"
                            class="z-10"
                            :blocks="blocks"
                            :font-size="settings.fontSize"
                            :line-height="settings.lineHeight"
                            :background="settings.background"
                            :theme-background="settings.themeBackground"
                            :border-radius="settings.borderRadius"
                            :theme-type="settings.themeType"
                            :padding="settings.padding"
                            :show-header="settings.showHeader"
                            :show-title="settings.showTitle"
                            :show-shadow="settings.showShadow"
                            :show-color-menu="settings.showColorMenu"
                            :show-line-numbers="settings.showLineNumbers"
                        />

                        <Divider
                            data-hide
                            :title="`${settings.height} px`"
                            class="absolute top-0 right-0 mx-4 -mr-10 text-xs text-ui-gray-500"
                        />
                    </div>

                    <Separator
                        :title="`${settings.width} px`"
                        class="my-2 text-xs text-ui-gray-500"
                    />
                </div>
            </div>

            <div class="flex justify-center w-full mb-8">
                <div class="w-full max-w-xl p-2 space-y-8">
                    <ControlSection title="Backgrounds">
                        <div class="flex justify-start w-full p-4 overflow-x-auto">
                            <div class="grid grid-flow-col grid-rows-2 gap-4 auto-cols-max">
                                <ButtonBackground
                                    v-for="(name, index) in backgrounds"
                                    :key="index"
                                    :background="name"
                                    :active="name === settings.background"
                                    @update:background="(bg) => (settings.background = bg)"
                                />
                            </div>
                        </div>
                    </ControlSection>

                    <ControlSection title="Code Preview">
                        <ControlRow>
                            <div class="flex flex-col w-full lg:w-auto">
                                <Label> Theme </Label>

                                <Select
                                    v-model="settings.themeName"
                                    class=" focus:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus"
                                    :disabled="loading"
                                    :options="$shiki.themes()"
                                />
                            </div>

                            <div class="flex flex-col w-full lg:w-auto">
                                <Label> Font Size </Label>

                                <Select
                                    v-model="settings.fontSize"
                                    :options="fontSizes"
                                    class=" focus:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus"
                                />
                            </div>

                            <div class="flex flex-col w-full lg:w-auto">
                                <Label> Line Height </Label>

                                <Select
                                    v-model="settings.lineHeight"
                                    :options="lineHeights"
                                    class=" focus:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus"
                                />
                            </div>
                        </ControlRow>

                        <ControlRow>
                            <div class="flex flex-row gap-4">
                                <div class="flex flex-col items-center justify-between">
                                    <Label> Header </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="settings.showHeader" />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between">
                                    <Label> Title </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="settings.showTitle" />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between">
                                    <Label class="whitespace-nowrap"> Menu Color </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="settings.showColorMenu" />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between">
                                    <Label> Line Numbers </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="settings.showLineNumbers" />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between">
                                    <Label> Shadow </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="settings.showShadow" />
                                    </div>
                                </div>
                            </div>
                        </ControlRow>

                        <ControlRow class="md:max-w-lg">
                            <div class="flex flex-col w-full">
                                <Label class="flex items-center space-x-2">
                                    <div>Border Radius</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ settings.borderRadius }} px)
                                    </span>
                                </Label>

                                <Range v-model="settings.borderRadius" max="20" step="1" />
                            </div>

                            <div class="flex flex-col w-full">
                                <Label class="flex items-center space-x-2">
                                    <div>Opacity</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ Math.round(settings.themeOpacity * 100) }}%)
                                    </span>
                                </Label>

                                <Range v-model="settings.themeOpacity" max="1" step="0.01" />
                            </div>
                        </ControlRow>

                        <ControlRow class="md:max-w-lg">
                            <div class="flex flex-col w-full">
                                <Label class="flex items-center space-x-2">
                                    <div>Background Padding</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ settings.backgroundPadding }} px)
                                    </span>
                                </Label>

                                <Range v-model="settings.backgroundPadding" max="60" step="1" />
                            </div>

                            <div class="flex flex-col w-full">
                                <Label class="flex items-center space-x-2">
                                    <div>Window Padding</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ settings.padding }} px)
                                    </span>
                                </Label>

                                <Range v-model="settings.padding" max="60" step="1" />
                            </div>
                        </ControlRow>
                    </ControlSection>
                </div>
            </div>
        </div>

        <div class="flex justify-start w-full">
            <a
                target="_blank"
                href="https://github.com/stevebauman/showcode"
                class="transform -rotate-90 github-corner group focus:outline-none"
                aria-label="View source on GitHub"
                ><svg
                    width="80"
                    height="80"
                    viewBox="0 0 250 250"
                    class=" text-ui-violet-900 group-focus:text-ui-violet-500 group-hover:text-ui-violet-500"
                    fill="currentColor"
                    style="transform: scale(-1, 1)"
                    aria-hidden="true"
                >
                    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                    <path
                        d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                        fill="#fff"
                        style="transform-origin: 130px 106px"
                        class="octo-arm"
                    ></path>
                    <path
                        d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                        fill="#fff"
                        class="octo-body"
                    ></path></svg
            ></a>
        </div>
    </div>
</template>

<script>
import hexAlpha from 'hex-alpha';
import download from 'downloadjs';
import { debounce } from 'lodash';
import { detect } from 'detect-browser';
import * as htmlToImage from 'html-to-image';
import {
    EyeOffIcon,
    CheckIcon,
    RefreshCwIcon,
    ClipboardIcon,
    ExternalLinkIcon,
} from 'vue-feather-icons';
import Logo from './Logo';
import Label from './Label';
import Range from './Range';
import Toggle from './Toggle';
import Select from './Select';
import Window from './Window';
import Divider from './Divider';
import Dropdown from './Dropdown';
import FauxMenu from './FauxMenu';
import Separator from './Separator';
import ButtonResize from './ButtonResize';
import ControlRow from './ControlRow';
import ControlSection from './ControlSection';
import ButtonBackground from './ButtonBackground';

const DEFAULT_HEIGHT = 200;
const DEFAULT_WIDTH = 450;

export default {
    props: {
        tab: Object,
        code: Array,
        languages: Array,
    },

    components: {
        Range,
        Logo,
        Label,
        Select,
        Window,
        CheckIcon,
        Toggle,
        Dropdown,
        FauxMenu,
        Divider,
        Separator,
        EyeOffIcon,
        RefreshCwIcon,
        ButtonResize,
        ControlRow,
        ControlSection,
        ClipboardIcon,
        ButtonBackground,
        ExternalLinkIcon,
    },

    data() {
        return {
            copied: false,
            loading: false,
            exportAs: 'png',
            resizing: false,
            blocks: [],
            settings: {
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
                showHeader: true,
                showTitle: true,
                showShadow: true,
                showColorMenu: true,
                showLineNumbers: false,
                background: 'candy',
                backgroundPadding: 16,
                themeType: 'light',
                themeOpacity: 1.0,
                themeName: 'github-light',
                themeBackground: '#fff',
                borderRadius: 12,
                fontSize: 16,
                lineHeight: 20,
                padding: 16,
            },
        };
    },

    async created() {
        this.listenForSaveKeyboardShortcut();
    },

    async mounted() {
        this.listenForPreviewSizeChanges();

        this.$nextTick(async () => await this.restoreSettingsFromStorage());
    },

    beforeDestroy() {
        this.terminatePreviewSizeListener();
    },

    watch: {
        settings: {
            deep: true,
            handler(settings) {
                this.syncSettingsInStorage(settings);
            },
        },

        languages: {
            deep: true,
            async handler() {
                await this.generateTokens();
            },
        },

        async 'settings.themeName'() {
            await this.generateTokens();
        },

        async 'settings.themeOpacity'() {
            await this.generateTokens();
        },

        async code() {
            await this.generateTokens();
        },
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

        fontSizes() {
            return [12, 14, 16, 18, 20];
        },

        lineHeights() {
            return [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
        },

        backgrounds() {
            return [
                'transparent',

                'teal',
                'candy',
                'ocean',
                'sky',
                'garden',
                'midnight',
                'sunset',
                'lavender',

                'conic-1',
                'conic-2',
                'conic-3',
                'conic-4',
                'conic-5',
                'conic-6',
                'conic-7',
                'conic-8',
                'conic-9',
                'conic-10',
                'conic-11',
                'conic-12',
                'conic-13',
                'conic-14',
                'conic-15',
                'conic-16',
                'conic-17',
                'conic-18',
                'conic-19',
                'conic-20',
                'conic-21',
                'conic-22',
                'conic-23',
                'conic-24',
                'conic-25',
                'conic-26',
            ];
        },
    },

    methods: {
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
                this.$refs.preview.$el
            );
        },

        /**
         * Terminate the preview window size observer.
         */
        terminatePreviewSizeListener() {
            this.previewObserver?.unobserve(this.$refs.preview.$el);
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
                // See: https://stackoverflow.com/a/21696585/2708607
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

            const minHeight = this.$refs.preview.$el.offsetHeight;

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

            const width =
                side < 0
                    ? this.settings.width - event.deltaX * 2
                    : this.settings.width + event.deltaX * 2;

            const minWidth = this.$refs.preview.$el.offsetWidth;

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
                const title = this.settings.title || 'Untitled-1';

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
                default:
                    return promise.then(copy);
            }
        },

        /**
         * Generate a new image preview from the given export method.
         *
         * @param {String} method
         *
         * @return {Promise}
         */
        generateImageFromPreview(method) {
            const filter = (node) => !(node.dataset && node.dataset.hasOwnProperty('hide'));

            return htmlToImage[method](this.$refs.capture, {
                filter,
                pixelRatio: 3,
            });
        },

        /**
         * Generate the code tokens.
         */
        async generateTokens() {
            this.$queue.push(async () => {
                this.loading = true;

                await this.$shiki.loadLanguages(this.languages.map((lang) => lang.name));

                await this.$shiki.loadTheme(this.settings.themeName);

                const { name, bg, type } = this.$shiki.getTheme(this.settings.themeName);

                this.settings.themeType = name.includes('light') ? 'light' : type;
                this.settings.themeBackground = hexAlpha(
                    bg,
                    parseFloat(this.settings.themeOpacity)
                );

                this.blocks = this.code.map((code) =>
                    this.$shiki.tokens(
                        code.value,
                        this.findEditorLanguageById(code.id),
                        this.settings.themeName
                    )
                );

                this.loading = false;
            });
        },

        /**
         * Find an editor's language by its key.
         *
         * @param {String} id
         *
         * @return {String|null}
         */
        findEditorLanguageById(id) {
            return this.languages.find((lang) => lang.id === id)?.name;
        },

        /**
         * Sync the current settings into local storage.
         *
         * @param {Object} settings
         */
        syncSettingsInStorage: debounce(async function (settings) {
            await this.$memory.pages.sync(this.tab.id, (record) =>
                record.set('settings', settings)
            );
        }, 1000),

        /**
         * Restore the previously saved settings from local storage.
         */
        async restoreSettingsFromStorage() {
            const record = await this.$memory.pages.get(this.tab.id);

            this.settings = record.merge('settings', this.settings);
        },
    },
};
</script>

<style lang="postcss">
.github-corner:hover .octo-arm,
.github-corner:focus .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
    0%,
    100% {
        transform: rotate(0);
    }
    20%,
    60% {
        transform: rotate(-25deg);
    }
    40%,
    80% {
        transform: rotate(10deg);
    }
}
@media (max-width: 500px) {
    .github-corner:hover .octo-arm {
        animation: none;
    }
    .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
    }
}

.background-teal {
    @apply bg-gradient-to-bl from-green-400 to-blue-500;
}

.background-ocean {
    @apply bg-gradient-to-tl from-sky-800 to-sky-400;
}

.background-candy {
    @apply bg-gradient-to-bl from-pink-400 to-purple-500;
}

.background-sky {
    @apply bg-gradient-to-br from-blue-700 to-blue-300;
}

.background-garden {
    @apply bg-gradient-to-bl from-green-400 to-black;
}

.background-midnight {
    @apply bg-gradient-to-tr from-black to-purple-800;
}

.background-sunset {
    @apply bg-gradient-to-bl from-yellow-400 to-red-500;
}

.background-lavender {
    @apply bg-gradient-to-bl from-blue-400 to-purple-500;
}

.background-transparent {
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0;
    background-image: linear-gradient(45deg, var(--color-ui-gray-900) 25%, transparent 0),
        linear-gradient(-45deg, var(--color-ui-gray-900) 25%, transparent 0),
        linear-gradient(45deg, transparent 75%, var(--color-ui-gray-900) 0),
        linear-gradient(-45deg, transparent 75%, var(--color-ui-gray-900) 0);
}

.background-conic-1 {
    background: conic-gradient(from 90deg at bottom right, cyan, rebeccapurple);
}

.background-conic-2 {
    background: conic-gradient(from 0.5turn at bottom center, lightblue, white);
}

.background-conic-3 {
    background: conic-gradient(
        from 90deg at 40% -25%,
        #ffd700,
        #f79d03,
        #ee6907,
        #e6390a,
        #de0d0d,
        #d61039,
        #cf1261,
        #c71585,
        #cf1261,
        #d61039,
        #de0d0d,
        #ee6907,
        #f79d03,
        #ffd700,
        #ffd700,
        #ffd700
    );
}

.background-conic-3 {
    background: conic-gradient(at bottom left, deeppink, cyan);
}

.background-conic-4 {
    background: conic-gradient(from 90deg at 25% -10%, #ff4500, #d3f340, #7bee85, #afeeee, #7bee85);
}

.background-conic-5 {
    background: conic-gradient(from -90deg at top left, black, white);
}

.background-conic-6 {
    background: conic-gradient(at top right, lime, cyan);
}

.background-conic-7 {
    background: conic-gradient(from -0.5turn at bottom right, deeppink, cyan, rebeccapurple);
}

.background-conic-8 {
    background: conic-gradient(at top right, slategray, white);
}

.background-conic-8 {
    background: conic-gradient(from 0.5turn at 50% 110%, white, orange);
}

.background-conic-8 {
    background: conic-gradient(from 0.5turn at center left, lime, cyan);
}

.background-conic-9 {
    background: conic-gradient(from -90deg at 50% -25%, blue, blueviolet);
}

.background-conic-10 {
    background: conic-gradient(from 0.5turn at top right, darkseagreen, darkslategray);
}

.background-conic-11 {
    background: conic-gradient(from 90deg at 50% 0%, #111, 50%, #222, #111);
}

.background-conic-12 {
    background: conic-gradient(at top right, lightcyan, lightblue);
}

.background-conic-13 {
    background: conic-gradient(
        from -135deg at -10% center,
        #ffa500,
        #ff7715,
        #ff522a,
        #ff3f47,
        #ff5482,
        #ff69b4
    );
}

.background-conic-14 {
    background: conic-gradient(from -90deg at 50% 105%, white, orchid);
}

.background-conic-15 {
    background: conic-gradient(
        from -90deg at 25% 115%,
        #ff0000,
        #ff0066,
        #ff00cc,
        #cc00ff,
        #6600ff,
        #0000ff,
        #0000ff,
        #0000ff,
        #0000ff
    );
}

.background-conic-16 {
    background: conic-gradient(from -90deg at bottom center, papayawhip, peachpuff);
}

.background-conic-17 {
    background: conic-gradient(from -270deg at 50% -5%, yellow, yellowgreen);
}

.background-conic-18 {
    background: conic-gradient(from -90deg at 75% -25%, sienna, purple);
}

.background-conic-19 {
    background: conic-gradient(
        from 90deg at 50% 125%,
        #20b2aa,
        #135da5,
        #0d0895,
        #4b0082,
        #4b0082,
        #0d0895,
        #135da5,
        #20b2aa
    );
}

.background-conic-20 {
    background: conic-gradient(from -270deg at 110% 50%, cadetblue, darkgreen);
}

.background-conic-21 {
    background: conic-gradient(from -270deg at 75% 110%, fuchsia, floralwhite);
}

.background-conic-22 {
    background: conic-gradient(from -270deg at 75% 110%, midnightblue, lawngreen);
}

.background-conic-22 {
    background: conic-gradient(from 0.5turn at bottom left, deeppink, rebeccapurple);
}

.background-conic-23 {
    background: conic-gradient(
        from 90deg at 50% 125%,
        #1f005c,
        #003298,
        #005ac6,
        #007fdc,
        #00a2d3,
        #00c4ae,
        #00e474,
        #00ff00,
        #1f005c,
        #003298,
        #005ac6,
        #007fdc,
        #00a2d3,
        #00c4ae,
        #00e474,
        #00ff00
    );
}

.background-conic-24 {
    background: conic-gradient(at 0% 0%, snow, white);
}

.background-conic-25 {
    background: conic-gradient(from 0.5turn at 0% 0%, #00c476, 10%, #82b0ff, 90%, #00c476);
}

.background-conic-26 {
    background: conic-gradient(at 125% 50%, #b78cf7, #ff7c94, #ffcf0d, #ff7c94, #b78cf7);
}
</style>
