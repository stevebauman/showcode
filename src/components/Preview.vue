<template>
    <div class="flex flex-col justify-between h-full bg-ash">
        <div class="flex items-center justify-between m-4">
            <Logo class="w-10 h-10" />

            <div class="flex items-center justify-center space-x-4">
                <button
                    type="button"
                    @click="copyToClipboard"
                    class="inline-flex items-center h-full gap-2 px-4 py-2 text-gray-400 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-900"
                >
                    <CheckIcon v-if="copied" class="text-green-300" />
                    <ClipboardIcon v-else class="w-4 h-4" />
                    {{ copied ? "Copied!" : "Copy" }}
                </button>

                <Dropdown
                    text="Export"
                    :items="exportOptions"
                    @click="saveAs('toPng')"
                />
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
                            class="inline-flex items-center h-full gap-2 px-4 py-2 text-gray-400 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-900"
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
                        class="relative flex items-center justify-center p-4"
                        :class="showBackground ? backgrounds[background] : null"
                    >
                        <ButtonResize
                            v-dragged="resizeFromTop"
                            class="absolute top-0 -mt-1 cursor-resize-height"
                        />

                        <ButtonResize
                            v-dragged="resizeFromBottom"
                            class="absolute bottom-0 -mb-1 cursor-resize-height"
                        />

                        <ButtonResize
                            v-dragged="resizeFromLeft"
                            class="absolute left-0 -ml-1 cursor-resize-width"
                        />

                        <ButtonResize
                            v-dragged="resizeFromRight"
                            class="absolute right-0 -mr-1 cursor-resize-width"
                        />

                        <div
                            class="p-4 shadow-lg"
                            style="min-width:400px;"
                            :style="{
                                backgroundColor: themeBackground,
                                borderRadius: `${borderRadius}px`,
                            }"
                        >
                            <div class="relative flex items-center">
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
                                            class="p-0 text-sm text-center bg-transparent border-0 shadow-none focus:ring-0"
                                            @blur="editingTitle = false"
                                        />

                                        <span v-else class="text-sm">
                                            {{ title || "Untitled-1" }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-8">
                                <div
                                    class="relative shiki"
                                    :class="{ focus: focused.length > 0 }"
                                >
                                    <div
                                        class="overflow-hidden font-mono whitespace-pre"
                                    >
                                        <span
                                            @mouseover="hovering = lineIndex"
                                            @mouseleave="hovering = null"
                                            v-for="(line, lineIndex) in lines"
                                            :key="`line-${lineIndex}`"
                                            class="relative block w-full line"
                                            :class="{
                                                'cursor-pointer':
                                                    hovering === lineIndex,
                                                'hover:bg-gray-50':
                                                    themeType === 'light',
                                                'hover:bg-gray-600':
                                                    themeType === 'dark',
                                                'bg-red-400': lineIsBeingRemoved(
                                                    line
                                                ),
                                                'bg-green-400': lineIsBeingAdded(
                                                    line
                                                ),
                                                'bg-opacity-20':
                                                    themeType === 'light',
                                                'bg-opacity-60':
                                                    themeType === 'dark',
                                                focus: focused.includes(
                                                    lineIndex
                                                ),
                                            }"
                                        >
                                            <div
                                                v-if="hovering === lineIndex"
                                                class="absolute right-0 flex items-stretch font-normal whitespace-normal top-1/2"
                                            >
                                                <button
                                                    @click="
                                                        toggleFocus(lineIndex)
                                                    "
                                                    class="transform -translate-y-1/2 border border-gray-400 rounded-md p-0.5 bg-white hover:bg-gray-100"
                                                >
                                                    <EyeOffIcon
                                                        v-if="
                                                            focused.includes(
                                                                lineIndex
                                                            )
                                                        "
                                                        class="w-4 h-4"
                                                    />
                                                    <EyeIcon
                                                        v-else
                                                        class="w-4 h-4"
                                                    />
                                                </button>
                                            </div>
                                            <span v-if="line.length === 0"
                                                >&#10;</span
                                            ><span
                                                v-for="(token,
                                                tokenIndex) in line"
                                                v-show="
                                                    !tokenContainsDiff(token)
                                                "
                                                :key="`token-${tokenIndex}`"
                                                :style="{
                                                    color: token.color,
                                                    ...tokenFontStyle(token),
                                                }"
                                                v-html="
                                                    escapeHtml(token.content)
                                                "
                                            ></span
                                        ></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center w-full mb-8">
                <div class="w-full max-w-xl space-y-8">
                    <ControlSection title="Window">
                        <div class="flex flex-col">
                            <Label>Background Visible</Label>

                            <div>
                                <Toggle v-model="showBackground" />
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <Label>
                                Background
                            </Label>

                            <Select
                                v-model="background"
                                :options="backgroundOptions"
                            />
                        </div>

                        <div class="flex flex-col">
                            <Label>
                                Theme
                            </Label>

                            <Select
                                v-model="themeName"
                                :disabled="loading"
                                :options="themeOptions"
                            />
                        </div>
                    </ControlSection>

                    <ControlSection title="Code Preview">
                        <div class="flex flex-col justify-between">
                            <Label>
                                Title
                            </Label>

                            <div class="flex items-center">
                                <Toggle v-model="showTitle" />
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <Label class="whitespace-nowrap">
                                Menu Color
                            </Label>

                            <div class="flex items-center">
                                <Toggle v-model="showColorMenu" />
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <Label>Border Radius</Label>

                            <input
                                v-model="borderRadius"
                                type="range"
                                max="20"
                                step="1"
                            />
                        </div>

                        <div class="flex flex-col">
                            <Label>Opacity</Label>

                            <input
                                v-model="themeOpacity"
                                type="range"
                                max="1"
                                step="0.01"
                            />
                        </div>
                    </ControlSection>
                </div>
            </div>
        </div>

        <div class="p-4 text-xs text-right text-gray-400">
            Have a suggestion?
            <a
                href="https://twitter.com/SteveTheBauman"
                class="underline hover:no-underline"
                target="_blank"
            >
                Let me know.
            </a>
        </div>
    </div>
</template>

<script>
import Logo from "./Logo";
import Label from "./Label";
import Select from "./Select";
import ButtonResize from "./ButtonResize";
import download from "downloadjs";
import ControlSection from "./ControlSection";
import * as htmlToImage from "html-to-image";
import {
    ExternalLinkIcon,
    EyeIcon,
    EyeOffIcon,
    PlusIcon,
    MinusIcon,
    ClipboardIcon,
    CheckIcon,
} from "vue-feather-icons";
import Dropdown from "./Dropdown.vue";
import Toggle from "./Toggle.vue";
import hexAlpha from "hex-alpha";
import FauxMenu from "./FauxMenu";

const FontStyle = {
    NotSet: -1,
    None: 0,
    Italic: 1,
    Bold: 2,
    Underline: 4,
};

const FONT_STYLE_TO_CSS = {
    [FontStyle.Italic]: { fontStyle: "italic" },
    [FontStyle.Bold]: { fontWeight: "bold" },
    [FontStyle.Underline]: { textDecoration: "underline" },
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
        ExternalLinkIcon,
    },

    watch: {
        code() {
            this.regeneratePreview();
        },

        language() {
            if (!this.highlighter) {
                return;
            }

            this.loading = true;

            Promise.all(
                this.languagesToLoad.map((lang) =>
                    this.highlighter.loadLanguage(lang)
                )
            )
                .then(() => this.regeneratePreview())
                .finally(() => (this.loading = false));
        },

        themeOpacity() {
            this.regeneratePreview();
        },

        themeName() {
            this.initShiki();
        },

        lines() {
            this.focused = this.focused.filter((lineIndex) => {
                return this.lines[lineIndex] !== undefined;
            });
        },
    },

    created() {
        if (process.isClient) {
            const waitForShiki = () => {
                typeof window.shiki !== "undefined"
                    ? this.initShiki()
                    : setTimeout(waitForShiki, 250);
            };

            waitForShiki();

            this.listenForSaveKeyboardShortcut();

            this.$watch(
                (vm) => [vm.code, vm.language, vm.themeOpacity],
                () => this.regeneratePreview
            );
        }
    },

    data() {
        return {
            title: null,
            copied: false,
            loading: false,
            showTitle: true,
            showColorMenu: true,
            showBackground: true,
            exportAs: "png",
            background: "teal",
            editingTitle: false,
            themeType: "light",
            themeOpacity: 1.0,
            themeName: "github-light",
            themeBackground: "#fff",
            hovering: null,
            resizing: false,
            width: 500,
            defaultWidth: 500,
            height: 200,
            defaultHeight: 200,
            borderRadius: 12,
            lines: [],
            focused: [],
        };
    },

    computed: {
        customLanguages() {
            return [
                {
                    id: "antlers",
                    scopeName: "text.html.statamic",
                    path: "languages/antlers.tmLanguage.json",
                    embeddedLangs: ["html"],
                },
                {
                    id: "blade",
                    scopeName: "text.html.php.blade",
                    path: "languages/blade.tmLanguage.json",
                    embeddedLangs: ["html", "php"],
                },
            ];
        },

        languages() {
            return [...this.shiki.BUNDLED_LANGUAGES, ...this.customLanguages];
        },

        languagesToLoad() {
            const language = this.languages.find(
                (lang) => lang.id === this.language
            );

            const languages = (language?.embeddedLangs ?? []).map((lang) =>
                this.languages.find(({ id }) => id === lang)
            );

            return [language, ...languages];
        },

        backgroundOptions() {
            return [
                { name: "teal", title: "Teal" },
                { name: "ocean", title: "Ocean" },
                { name: "candy", title: "Candy" },
                { name: "sky", title: "Sky" },
                { name: "garden", title: "Garden" },
                { name: "midnight", title: "Midnight" },
                { name: "sunset", title: "Sunset" },
                { name: "lavender", title: "Lavender" },
            ];
        },

        backgrounds() {
            return {
                teal: "bg-gradient-to-bl from-green-400 to-blue-500",
                ocean: "bg-gradient-to-tl from-sky-800 to-sky-400",
                candy: "bg-gradient-to-bl from-pink-400 to-purple-500",
                sky: "bg-gradient-to-br from-blue-700 to-blue-300",
                garden: "bg-gradient-to-bl from-green-400 to-black-500",
                midnight: "bg-gradient-to-tr from-black to-purple-800",
                sunset: "bg-gradient-to-bl from-yellow-400 to-red-500",
                lavender: "bg-gradient-to-bl from-blue-400 to-purple-500",
            };
        },

        exportOptions() {
            return [
                {
                    name: "png",
                    title: "PNG",
                    click: () => this.saveAs("toPng"),
                },
                {
                    name: "jpg",
                    title: "JPEG",
                    click: () => this.saveAs("toJpeg"),
                },
                {
                    name: "svg",
                    title: "SVG",
                    click: () => this.saveAs("toSvg"),
                },
            ];
        },

        themeOptions() {
            return [
                "dark-plus",
                "dracula-soft",
                "dracula",
                "github-dark-dimmed",
                "github-dark",
                "github-light",
                "light-plus",
                "material-darker",
                "material-default",
                "material-lighter",
                "material-ocean",
                "material-palenight",
                "min-dark",
                "min-light",
                "monokai",
                "nord",
                "one-dark-pro",
                "poimandres",
                "slack-dark",
                "slack-ochin",
                "solarized-dark",
                "solarized-light",
                "vitesse-dark",
                "vitesse-light",
            ];
        },
    },

    methods: {
        initShiki() {
            this.shiki = window.shiki;

            this.shiki.setCDN("/shiki/");

            this.shiki
                .getHighlighter({
                    theme: this.themeName,
                    langs: this.languagesToLoad,
                })
                .then((highlighter) => {
                    this.highlighter = highlighter;

                    this.regeneratePreview();
                });
        },

        listenForSaveKeyboardShortcut() {
            document.addEventListener(
                "keydown",
                (e) => {
                    const pressingCtrlKey = window.navigator.platform.match(
                        "Mac"
                    )
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

        escapeHtml(html) {
            const htmlEscapes = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            };

            return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
        },

        lineIsBeingRemoved(line) {
            return this.lineContainsValue(line, "{-}");
        },

        lineIsBeingAdded(line) {
            return this.lineContainsValue(line, "{+}");
        },

        lineContainsValue(line, value) {
            for (const token of line) {
                if (token.content.includes(value)) {
                    return true;
                }
            }

            return false;
        },

        tokenContainsDiff(token) {
            return (
                token.content.includes("{-}") || token.content.includes("{+}")
            );
        },

        tokenIsComment(token) {
            if (!token.explanation) {
                return false;
            }

            if (token.explanation.length === 0) {
                return false;
            }

            if (token.explanation.scopes?.length === 0) {
                return false;
            }

            return (
                token.explanation[0].scopes.filter((scope) =>
                    scope.scopeName.includes("comment")
                ).length > 0
            );
        },

        resizeFromTop(event) {
            this.resizeHeight(event, -1);
        },

        resizeFromBottom(event) {
            this.resizeHeight(event, 1);
        },

        resizeFromLeft(event) {
            this.resizeWidth(event, -1);
        },

        resizeFromRight(event) {
            this.resizeWidth(event, 1);
        },

        resizeHeight(event, side = -1) {
            if (isNaN(event.offsetY)) {
                return;
            }

            const height =
                side < 0
                    ? this.height - event.deltaY
                    : this.height + event.deltaY;

            if (height > 800 || height < this.defaultHeight) {
                return;
            }

            this.height = height;
        },

        resizeWidth(event, side = -1) {
            if (isNaN(event.offsetX)) {
                return;
            }

            const width =
                side < 0
                    ? this.width - event.deltaX * 2
                    : this.width + event.deltaX * 2;

            if (width > 800 || width < this.defaultWidth) {
                return;
            }

            this.width = width;
        },

        saveAs(method) {
            const extension = {
                toPng: "png",
                toJpeg: "jpg",
                toSvg: "svg",
            }[method];

            this.generateImageFromPreview(method).then((dataUrl) => {
                const title = this.title || "Untitled-1";

                download(dataUrl, `${title}.${extension}`);
            });
        },

        copyToClipboard() {
            this.generateImageFromPreview("toBlob").then((blob) =>
                navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob }),
                ])
            );

            this.copied = true;

            window.setTimeout(() => (this.copied = false), 4000);
        },

        generateImageFromPreview(method) {
            const filter = (node) =>
                !(node.dataset && node.dataset.hide === "");

            return htmlToImage[method](this.$refs.capture, {
                filter,
                pixelRatio: 2,
            });
        },

        regeneratePreview() {
            const { name, bg, type } = this.highlighter.getTheme();

            this.themeName = name;
            this.themeType = name.includes("light") ? "light" : type;
            this.themeBackground = hexAlpha(bg, parseFloat(this.themeOpacity));

            this.lines = this.highlighter.codeToThemedTokens(
                this.code,
                this.language
            );
        },

        tokenFontStyle(token) {
            return token.fontStyle > FontStyle.None
                ? FONT_STYLE_TO_CSS[token.fontStyle]
                : {};
        },

        toggleFocus(lineIndex) {
            if (this.focused.includes(lineIndex)) {
                const index = this.focused.indexOf(lineIndex);

                this.focused.splice(index, 1);
            } else {
                this.focused.push(lineIndex);
            }
        },

        editTitle() {
            this.editingTitle = true;

            this.$nextTick(() => this.$refs.title.focus());
        },
    },
};
</script>

<style>
.shiki.focus .line:not(.focus) {
    transition: all 250ms;
    filter: blur(2px);
}

.shiki.focus:hover .line {
    transition: all 250ms;
    filter: blur(0);
}
</style>
