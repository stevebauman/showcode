<template>
    <div>
        <div class="flex items-center justify-between m-4">
            <Logo class="w-10 h-10" />

            <div class="flex items-center justify-center space-x-4">
                <button
                    type="button"
                    @click="copyToClipboard"
                    class="inline-flex items-center h-full gap-2 px-4 py-2 text-gray-400 bg-gray-800 rounded-md cursor-pointer  hover:bg-gray-900"
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
                    <div class="h-10 my-4">
                        <button
                            v-if="focused.length > 0"
                            type="button"
                            @click="focused = []"
                            class="inline-flex items-center h-full gap-2 px-4 py-2 text-gray-400 bg-gray-800 rounded-md cursor-pointer  hover:bg-gray-900"
                        >
                            <EyeOffIcon class="w-4 h-4" />
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

                        <div
                            ref="preview"
                            class="z-10"
                            :class="[background === 'transparent' ? 'shadow-none' : 'shadow-xl']"
                            style="min-width: 400px"
                            :style="{
                                fontSize: `${fontSize}px`,
                                backgroundColor: themeBackground,
                                borderRadius: `${borderRadius}px`,
                            }"
                        >
                            <div class="relative flex items-center p-4">
                                <FauxMenu
                                    class="absolute"
                                    :theme="showColorMenu ? 'color' : themeType"
                                />

                                <div
                                    @click="editTitle"
                                    class="w-full h-6 text-center text-gray-400"
                                >
                                    <div v-show="showTitle">
                                        <input
                                            v-if="editingTitle"
                                            type="text"
                                            ref="title"
                                            v-model="title"
                                            class="p-0 text-sm text-center bg-transparent border-0 shadow-none  focus:ring-0"
                                            @blur="editingTitle = false"
                                        />

                                        <span v-else class="text-sm font-medium">
                                            {{ title || 'Untitled-1' }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div :style="{ padding: `${padding}px` }">
                                <div class="relative shiki" :class="{ focus: focused.length > 0 }">
                                    <span class="font-mono"
                                        ><span
                                            @mouseover="hovering = lineIndex"
                                            @mouseleave="hovering = null"
                                            v-for="(line, lineIndex) in lines"
                                            :key="`line-${lineIndex}`"
                                            class="relative block w-full line"
                                            :class="{
                                                'cursor-pointer': hovering === lineIndex,
                                                'hover:bg-gray-50': themeType === 'light',
                                                'hover:bg-gray-600': themeType === 'dark',
                                                'bg-red-400': lineIsBeingRemoved(line),
                                                'bg-green-400': lineIsBeingAdded(line),
                                                'bg-opacity-20': themeType === 'light',
                                                'bg-opacity-60': themeType === 'dark',
                                                focus: focused.includes(lineIndex),
                                            }"
                                            ><span v-if="showLineNumbers" class="number">{{
                                                ++lineIndex
                                            }}</span
                                            ><span
                                                v-if="hovering === lineIndex"
                                                class="absolute right-0 flex items-stretch font-normal whitespace-normal  top-1/2"
                                            >
                                                <button
                                                    @click="toggleFocus(lineIndex)"
                                                    class="
                                                        transform
                                                        -translate-y-1/2
                                                        border border-gray-400
                                                        rounded-md
                                                        p-0.5
                                                        bg-white
                                                        hover:bg-gray-100
                                                    "
                                                >
                                                    <EyeOffIcon
                                                        v-if="focused.includes(lineIndex)"
                                                        class="w-4 h-4"
                                                    />
                                                    <EyeIcon v-else class="w-4 h-4" />
                                                </button> </span
                                            ><span v-if="line.length === 0">&#10;</span
                                            ><span
                                                v-for="(token, tokenIndex) in line"
                                                v-show="!tokenContainsDiff(token)"
                                                :key="`token-${tokenIndex}`"
                                                :style="{
                                                    color: token.color,
                                                    ...tokenFontStyle(token),
                                                }"
                                                v-html="escapeHtml(token.content)"
                                            ></span
                                        ></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center w-full mb-8">
                <div class="w-full max-w-xl space-y-8">
                    <ControlSection title="Backgrounds">
                        <div class="flex items-center justify-center w-full p-4 space-x-4">
                            <ButtonBackground
                                v-for="(name, index) in backgrounds"
                                :key="index"
                                :background="name"
                                :selected="name === background"
                                @background-chosen="(bg) => (background = bg)"
                            />
                        </div>
                    </ControlSection>

                    <ControlSection title="Code Preview">
                        <div class="flex flex-col w-full">
                            <div class="flex items-center justify-between w-full p-4">
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
                                    <Label class="flex items-center space-x-2">
                                        <div>Padding</div>

                                        <span class="text-xs text-gray-500 w-14">
                                            ({{ padding }} px)
                                        </span>
                                    </Label>

                                    <input v-model="padding" type="range" max="60" step="1" />
                                </div>
                            </div>

                            <div class="h-0.5 bg-gray-700"></div>

                            <div class="flex items-center justify-between w-full p-4">
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

                                    <input
                                        v-model="borderRadius"
                                        class="bg-gray-600"
                                        type="range"
                                        max="20"
                                        step="1"
                                    />
                                </div>

                                <div class="flex flex-col">
                                    <Label class="flex items-center space-x-2">
                                        <div>Opacity</div>

                                        <span class="text-xs text-gray-500 w-14">
                                            ({{ Math.round(themeOpacity * 100) }}%)
                                        </span>
                                    </Label>

                                    <input
                                        v-model="themeOpacity"
                                        type="range"
                                        max="1"
                                        step="0.01"
                                    />
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
import Logo from './Logo';
import Label from './Label';
import Toggle from './Toggle';
import Select from './Select';
import Dropdown from './Dropdown';
import FauxMenu from './FauxMenu';
import ButtonResize from './ButtonResize';
import ButtonBackground from './ButtonBackground';
import ControlSection from './ControlSection';
import download from 'downloadjs';
import hexAlpha from 'hex-alpha';
import * as htmlToImage from 'html-to-image';
import {
    EyeIcon,
    EyeOffIcon,
    PlusIcon,
    MinusIcon,
    CheckIcon,
    ClipboardIcon,
    ExternalLinkIcon,
} from 'vue-feather-icons';

const FONT_STYLE = {
    NotSet: -1,
    None: 0,
    Italic: 1,
    Bold: 2,
    Underline: 4,
};

const DEFAULT_HEIGHT = 200;
const DEFAULT_WIDTH = 500;

const FONT_STYLE_TO_CSS = {
    [FONT_STYLE.Bold]: { fontWeight: 'bold' },
    [FONT_STYLE.Italic]: { fontStyle: 'italic' },
    [FONT_STYLE.Underline]: { textDecoration: 'underline' },
};

export default {
    props: {
        code: {
            type: String,
            required: true,
        },
        language: String,
    },

    components: {
        Logo,
        Label,
        Select,
        PlusIcon,
        MinusIcon,
        EyeIcon,
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
        themeName(theme) {
            this.regeneratePreview(theme);
        },

        code() {
            this.regenerateTokens();
        },

        themeOpacity() {
            this.regenerateTokens();
        },

        lines() {
            this.focused = this.focused.filter((lineIndex) => this.lines[lineIndex] !== undefined);
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
            shiki: null,
            highlighter: null,
            title: null,
            copied: false,
            loading: false,
            showTitle: true,
            showColorMenu: true,
            showLineNumbers: false,
            exportAs: 'png',
            background: 'teal',
            editingTitle: false,
            themeType: 'light',
            themeOpacity: 1.0,
            themeName: 'github-light',
            themeBackground: '#fff',
            hovering: null,
            resizing: false,
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            borderRadius: 12,
            fontSize: 16,
            padding: 16,
            lines: [],
            focused: [],
        };
    },

    computed: {
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
            this.shiki = window.shiki;

            this.shiki.setCDN('/shiki/');

            const languages = [].concat(this.shiki.BUNDLED_LANGUAGES, this.customLanguages);

            this.highlighter = await this.shiki.getHighlighter({
                theme: this.themeName,
                langs: languages,
            });

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
                this.$refs.preview
            );
        },

        /**
         * Terminate the preview window size observer.
         */
        terminatePreviewSizeListener() {
            this.previewObserver?.unobserve(this.$refs.preview);
        },

        /**
         * Update the capture dimensions to the current capture's actual dimensions.
         */
        updateCaptureDimensions() {
            this.$nextTick(() => {
                if (this.$refs.capture) {
                    this.height = this.$refs.capture.offsetHeight;
                    this.width = this.$refs.capture.offsetWidth;
                }
            });
        },

        /**
         * Escape the HTML before displaying it to the preview window.
         *
         * @param {String} html
         */
        escapeHtml(html) {
            const htmlEscapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            };

            return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
        },

        /**
         * Determine if the code line is being removed in a diff.
         *
         * @param {Object} line
         *
         * @return {Boolean}
         */
        lineIsBeingRemoved(line) {
            return this.lineContainsValue(line, '{-}');
        },

        /**
         * Determine if the code line is being added in a diff.
         *
         * @param {Object} line
         *
         * @return {Boolean}
         */
        lineIsBeingAdded(line) {
            return this.lineContainsValue(line, '{+}');
        },

        /**
         * Determine if the code line contains the given value.
         *
         * @param {Object} line
         * @param {String} value
         *
         * @return {Boolean}
         */
        lineContainsValue(line, value) {
            for (const token of line) {
                if (token.content.includes(value)) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Determine if the code token contains a diff keyword.
         *
         * @param {Object} token
         */
        tokenContainsDiff(token) {
            return token.content.includes('{-}') || token.content.includes('{+}');
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
         * Refresh shiki's theme and the code tokens.
         *
         * @param {String} theme
         */
        async regeneratePreview(theme = null) {
            this.loading = true;

            await this.highlighter.loadTheme(theme ?? this.themeName);

            this.regenerateTokens();

            this.loading = false;
        },

        /**
         * Regenerate shiki's tokens.
         */
        regenerateTokens() {
            const { name, bg, type } = this.highlighter.getTheme(this.themeName);

            this.themeType = name.includes('light') ? 'light' : type;
            this.themeBackground = hexAlpha(bg, parseFloat(this.themeOpacity));

            this.lines = this.highlighter.codeToThemedTokens(
                this.code,
                this.language,
                this.themeName
            );
        },

        /**
         * Determine the token's font style.
         *
         * @param {Object} token
         *
         * @return {Object}
         */
        tokenFontStyle(token) {
            return token.fontStyle > FONT_STYLE.None ? FONT_STYLE_TO_CSS[token.fontStyle] : {};
        },

        /**
         * Toggle focus on the given line's index.
         *
         * @param {Number} lineIndex
         */
        toggleFocus(lineIndex) {
            if (this.focused.includes(lineIndex)) {
                const index = this.focused.indexOf(lineIndex);

                this.focused.splice(index, 1);
            } else {
                this.focused.push(lineIndex);
            }
        },

        /**
         * Begin editing the preview window's title.
         */
        editTitle() {
            this.editingTitle = true;

            this.$nextTick(() => this.$refs.title.focus());
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

.shiki .line {
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: normal;
}

.shiki.focus .line:not(.focus) {
    transition: all 250ms;
    filter: blur(2px);
}

.shiki.focus:hover .line {
    transition: all 250ms;
    filter: blur(0);
}

.shiki .line .number {
    width: 1rem;
    white-space: pre;
    margin-right: 1rem;
    display: inline-block;
    text-align: right;
    color: rgba(115, 138, 148, 0.5);
}
</style>
