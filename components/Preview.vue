<template>
    <div>
        <div class="flex items-center justify-between m-4">
            <Logo class="w-10 h-10" />

            <div class="flex items-center justify-center space-x-2">
                <button
                    type="button"
                    @click="copyToClipboard"
                    class="inline-flex items-center h-full gap-2 px-4 py-2 text-gray-400 bg-gray-800 rounded-lg cursor-pointer  hover:bg-gray-900"
                >
                    <CheckIcon v-if="copied" class="text-green-300" />
                    <ClipboardIcon v-else class="w-4 h-4" />
                    {{ copied ? 'Copied!' : 'Copy' }}
                </button>

                <Dropdown text="Export" :items="fileTypes" @click="saveAs('toPng')"> Foo </Dropdown>
            </div>
        </div>

        <div class="space-y-6">
            <div class="relative flex items-center justify-center">
                <div>
                    <div class="my-4">
                        <button
                            type="button"
                            @click="() => $nuxt.$emit('clear-focused')"
                            class="inline-flex items-center h-full gap-2 px-2 py-1 text-sm text-gray-400 bg-gray-800 rounded-md cursor-pointer  hover:bg-gray-900"
                        >
                            <EyeOffIcon class="w-3 h-3" />
                            Clear Focused
                        </button>
                    </div>

                    <div
                        ref="capture"
                        :style="{
                            minWidth: `${width}px`,
                            minHeight: `${height}px`,
                        }"
                        class="relative flex items-center justify-center h-auto p-4"
                    >
                        <div
                            :data-hide="background === 'transparent'"
                            :class="`background-${background}`"
                            class="absolute top-0 left-0 w-full h-full"
                        >
                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromTop"
                                class="absolute top-0 -mt-1 left-1/2 cursor-resize-height"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromBottom"
                                class="absolute bottom-0 -mb-1 left-1/2 cursor-resize-height"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromLeft"
                                class="absolute left-0 -ml-1 top-1/2 cursor-resize-width"
                            />

                            <ButtonResize
                                data-hide
                                v-dragged="resizeFromRight"
                                class="absolute right-0 -mr-1 top-1/2 cursor-resize-width"
                            />
                        </div>

                        <Window
                            ref="preview"
                            class="z-10"
                            :blocks="blocks"
                            :font-size="fontSize"
                            :line-height="lineHeight"
                            :background="background"
                            :theme-background="themeBackground"
                            :border-radius="borderRadius"
                            :theme-type="themeType"
                            :padding="padding"
                            :show-title="showTitle"
                            :show-color-menu="showColorMenu"
                            :show-line-numbers="showLineNumbers"
                        />
                    </div>
                </div>
            </div>

            <div class="flex justify-center w-full mb-8">
                <div class="w-full max-w-xl p-2 space-y-8">
                    <ControlSection title="Backgrounds">
                        <div class="flex justify-center w-full p-4">
                            <div
                                class="grid grid-flow-col grid-rows-2 gap-4  auto-cols-max lg:flex lg:items-center"
                            >
                                <ButtonBackground
                                    v-for="(name, index) in backgrounds"
                                    :key="index"
                                    :background="name"
                                    :active="name === background"
                                    @background-chosen="(bg) => (background = bg)"
                                />
                            </div>
                        </div>
                    </ControlSection>

                    <ControlSection title="Code Preview">
                        <div class="flex flex-col w-full">
                            <div
                                class="flex flex-col w-full p-4 space-y-4  lg:space-y-0 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div class="flex flex-col">
                                    <Label> Theme </Label>

                                    <Select
                                        v-model="themeName"
                                        :disabled="loading"
                                        :options="themes"
                                    />
                                </div>

                                <div class="flex flex-col">
                                    <Label> Font Size </Label>

                                    <Select v-model="fontSize" :options="fontSizes" />
                                </div>

                                <div class="flex flex-col">
                                    <Label> Line Height </Label>

                                    <Select v-model="lineHeight" :options="lineHeights" />
                                </div>

                                <div class="flex flex-col">
                                    <Label class="flex items-center space-x-2">
                                        <div>Padding</div>

                                        <span class="text-xs text-gray-500 w-14">
                                            ({{ padding }} px)
                                        </span>
                                    </Label>

                                    <Range v-model="padding" max="60" step="1" />
                                </div>
                            </div>

                            <div class="h-0.5 bg-gray-700"></div>

                            <div
                                class="flex flex-col w-full p-4 space-y-4  lg:space-y-0 lg:flex-row lg:items-center lg:justify-between"
                            >
                                <div class="flex flex-col justify-between">
                                    <Label> Title </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="showTitle" />
                                    </div>
                                </div>

                                <div class="flex flex-col">
                                    <Label class="whitespace-nowrap"> Menu Color </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="showColorMenu" />
                                    </div>
                                </div>

                                <div class="flex flex-col justify-between">
                                    <Label> Line Numbers </Label>

                                    <div class="flex items-center">
                                        <Toggle v-model="showLineNumbers" />
                                    </div>
                                </div>

                                <div class="flex flex-col">
                                    <Label class="flex items-center space-x-2">
                                        <div>Border Radius</div>

                                        <span class="text-xs text-gray-500 w-14">
                                            ({{ borderRadius }} px)
                                        </span>
                                    </Label>

                                    <Range v-model="borderRadius" max="20" step="1" />
                                </div>

                                <div class="flex flex-col">
                                    <Label class="flex items-center space-x-2">
                                        <div>Opacity</div>

                                        <span class="text-xs text-gray-500 w-14">
                                            ({{ Math.round(themeOpacity * 100) }}%)
                                        </span>
                                    </Label>

                                    <Range v-model="themeOpacity" max="1" step="0.01" />
                                </div>
                            </div>
                        </div>
                    </ControlSection>
                </div>
            </div>
        </div>

        <div class="p-4 text-xs text-right text-gray-400">
            Have a suggestion?
            <a
                href="https://github.com/stevebauman/showcode"
                class="underline hover:no-underline"
                target="_blank"
            >
                Let me know.
            </a>
        </div>
    </div>
</template>

<script>
import Range from './Range';
import { EyeOffIcon, CheckIcon, ClipboardIcon, ExternalLinkIcon } from 'vue-feather-icons';
import { flatten } from 'lodash';
import download from 'downloadjs';
import hexAlpha from 'hex-alpha';
import * as htmlToImage from 'html-to-image';
import Logo from './Logo';
import Label from './Label';
import Toggle from './Toggle';
import Select from './Select';
import Window from './Window';
import Dropdown from './Dropdown';
import FauxMenu from './FauxMenu';
import ButtonResize from './ButtonResize';
import ControlSection from './ControlSection';
import ButtonBackground from './ButtonBackground';

const DEFAULT_HEIGHT = 200;
const DEFAULT_WIDTH = 450;

const shiki = require('shiki');

export default {
    props: {
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
        EyeOffIcon,
        ButtonResize,
        ControlSection,
        ClipboardIcon,
        ButtonBackground,
        ExternalLinkIcon,
    },

    watch: {
        async themeName(theme) {
            await this.regeneratePreview(theme);
        },

        async languagesToLoad(languages) {
            await this.refreshHighlighter(this.themeName, languages);

            this.regenerateTokens();
        },

        code() {
            this.regenerateTokens();
        },

        themeOpacity() {
            this.regenerateTokens();
        },
    },

    async created() {
        await this.initShiki();

        this.listenForSaveKeyboardShortcut();
    },

    mounted() {
        this.listenForPreviewSizeChanges();
    },

    beforeDestroy() {
        this.terminatePreviewSizeListener();
    },

    data() {
        return {
            highlighter: null,
            copied: false,
            loading: false,
            showTitle: true,
            showColorMenu: true,
            showLineNumbers: false,
            exportAs: 'png',
            background: 'teal',
            themeType: 'light',
            themeOpacity: 1.0,
            themeName: 'github-light',
            themeBackground: '#fff',
            resizing: false,
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            borderRadius: 12,
            fontSize: 16,
            lineHeight: 20,
            padding: 16,
            blocks: [],
            languageRepository: [],
        };
    },

    computed: {
        languagesToLoad() {
            const editorLanguages = this.languages.map((lang) => lang.name);

            const languagesLoad = this.languageRepository.filter(({ id }) =>
                editorLanguages.includes(id)
            );

            const embeddedLangs = languagesLoad.map((lang) => lang?.embeddedLangs ?? []);

            const languages = flatten(embeddedLangs).map((embeddedLang) =>
                this.languageRepository.find((lang) => lang?.id === embeddedLang)
            );

            return [...languagesLoad, ...languages];
        },

        customLanguages() {
            return [
                {
                    id: 'antlers',
                    scopeName: 'text.html.statamic',
                    path: 'languages/antlers.tmLanguage.json',
                    embeddedLangs: ['html', 'php'],
                },
                {
                    id: 'blade',
                    scopeName: 'text.html.php.blade',
                    path: 'languages/blade.tmLanguage.json',
                    embeddedLangs: ['html', 'php'],
                },
            ];
        },

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
                'teal',
                'candy',
                'ocean',
                'sky',
                'garden',
                'midnight',
                'sunset',
                'lavender',
                'transparent',
            ];
        },

        themes() {
            return [
                'dark-plus',
                'dracula-soft',
                'dracula',
                'github-dark-dimmed',
                'github-dark',
                'github-light',
                'light-plus',
                'material-darker',
                'material-default',
                'material-lighter',
                'material-ocean',
                'material-palenight',
                'min-dark',
                'min-light',
                'monokai',
                'nord',
                'one-dark-pro',
                'poimandres',
                'slack-dark',
                'slack-ochin',
                'solarized-dark',
                'solarized-light',
                'vitesse-dark',
                'vitesse-light',
            ];
        },
    },

    methods: {
        /**
         * Initialize the Shiki highlighter.
         */
        async initShiki() {
            shiki.setCDN('/shiki/');

            this.languageRepository = [...shiki.BUNDLED_LANGUAGES, ...this.customLanguages];

            await this.regeneratePreview();
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
         * Update the capture dimensions to the current capture's actual dimensions.
         */
        updateCaptureDimensions() {
            this.$nextTick(() => {
                // We need to make sure the element exists
                // and it's visible before attempting to
                // update our width and height values.
                // See: https://stackoverflow.com/a/21696585/2708607
                if (this.$refs.capture && this.$refs.capture.offsetParent) {
                    this.height = this.$refs.capture.offsetHeight;
                    this.width = this.$refs.capture.offsetWidth;
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

            const height = side < 0 ? this.height - event.deltaY : this.height + event.deltaY;

            if (height > 800 || height < DEFAULT_HEIGHT) {
                return;
            }

            this.height = height;
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

            const width = side < 0 ? this.width - event.deltaX * 2 : this.width + event.deltaX * 2;

            if (width > 800 || width < DEFAULT_WIDTH) {
                return;
            }

            this.width = width;
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
                const title = this.title || 'Untitled-1';

                download(dataUrl, `${title}.${extension}`);
            });
        },

        /**
         * Copy the image preview to the users clipboard.
         */
        copyToClipboard() {
            this.generateImageFromPreview('toBlob').then((blob) =>
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            );

            this.copied = true;

            window.setTimeout(() => (this.copied = false), 4000);
        },

        /**
         * Generate a new image preview from the given export method.
         *
         * @param {String} method
         */
        generateImageFromPreview(method) {
            const filter = (node) => !(node.dataset && node.dataset.hasOwnProperty('hide'));

            return htmlToImage[method](this.$refs.capture, {
                filter,
                pixelRatio: 3,
            });
        },

        /**
         * Refresh the shiki highlighter.
         *
         * @param {Array} languages
         */
        async refreshHighlighter(theme = null, languages = []) {
            this.loading = true;

            this.highlighter = await shiki.getHighlighter({
                theme: theme ?? this.themeName,
                langs: languages,
            });

            this.loading = false;
        },

        /**
         * Refresh shiki's theme and the code tokens.
         *
         * @param {String} theme
         */
        async regeneratePreview(theme = null) {
            await this.refreshHighlighter(theme, this.languagesToLoad);

            this.regenerateTokens();
        },

        /**
         * Regenerate shiki's tokens.
         */
        async regenerateTokens() {
            const { name, bg, type } = this.highlighter.getTheme(this.themeName);

            this.themeType = name.includes('light') ? 'light' : type;
            this.themeBackground = hexAlpha(bg, parseFloat(this.themeOpacity));

            this.blocks = this.code.map((code) =>
                this.highlighter.codeToThemedTokens(
                    code.value,
                    this.findEditorLanguageByKey(code.key),
                    this.themeName
                )
            );
        },

        /**
         * Find an editor's language by its key.
         *
         * @param {String} key
         *
         * @return {String|null}
         */
        findEditorLanguageByKey(key) {
            return this.languages.find((lang) => lang.key === key)?.name;
        },
    },
};
</script>

<style lang="postcss">
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
    background-image: linear-gradient(45deg, #1d1d1d 25%, transparent 0),
        linear-gradient(-45deg, #1d1d1d 25%, transparent 0),
        linear-gradient(45deg, transparent 75%, #1d1d1d 0),
        linear-gradient(-45deg, transparent 75%, #1d1d1d 0);
}
</style>
