<template>
    <div>
        <div class="h-10 my-4">
            <button
                v-if="focused.length > 0"
                type="button"
                @click="focused = []"
                class="inline-flex items-center h-full gap-2 px-4 py-2 text-gray-400 bg-gray-800 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-900"
            >
                <EyeOffIcon class="w-4 h-4" />
                Clear Focused
            </button>
        </div>

        <div
            ref="capture"
            style="min-width:600px;"
            class="flex items-center justify-center py-4 rounded-lg"
            :class="backgrounds[background]"
        >
            <div
                class="p-4 shadow-lg"
                style="min-width:400px;border-radius:12px;background"
                :style="{ backgroundColor: themeBackground }"
            >
                <div class="relative flex items-center">
                    <div class="absolute flex items-center gap-2">
                        <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                    </div>

                    <div
                        class="w-full text-center text-gray-400"
                        @click="editTitle"
                    >
                        <input
                            v-if="editingTitle"
                            type="text"
                            ref="title"
                            v-model="title"
                            class="p-0 text-sm text-center border-0 shadow-none focus:ring-0"
                            @blur="editingTitle = false"
                        />

                        <span v-else class="text-sm">
                            {{ title || "Untitled-1" }}
                        </span>
                    </div>
                </div>

                <div class="pt-8">
                    <div
                        class="relative shiki"
                        :class="{ focus: focused.length > 0 }"
                    >
                        <div class="font-mono whitespace-pre">
                            <span
                                @mouseover="hovering = lineIndex"
                                @mouseleave="hovering = null"
                                v-for="(line, lineIndex) in lines"
                                :key="`line-${lineIndex}`"
                                class="relative block w-full line"
                                :class="{
                                    'bg-gray-200 bg-opacity-40 cursor-pointer':
                                        hovering === lineIndex,
                                    focus: focused.includes(lineIndex),
                                }"
                                ><div
                                    v-if="hovering === lineIndex"
                                    class="absolute right-0 flex items-stretch font-normal whitespace-normal top-1/2"
                                >
                                    <button
                                        @click="toggleFocus(lineIndex)"
                                        class="transform -translate-y-1/2 border border-gray-400 rounded-md p-0.5 bg-white hover:bg-gray-100"
                                    >
                                        <EyeOffIcon
                                            v-if="focused.includes(lineIndex)"
                                            class="w-4 h-4"
                                        />
                                        <EyeIcon v-else class="w-4 h-4" />
                                    </button>
                                </div>
                                <span v-if="line.length === 0">&#10;</span
                                ><span
                                    v-for="(token, tokenIndex) in line"
                                    :key="`token-${tokenIndex}`"
                                    :style="{
                                        color: token.color,
                                        ...tokenFontStyle(token),
                                    }"
                                    v-html="token.content"
                                ></span
                            ></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="flex items-stretch justify-between gap-4 my-4 bg-gray-700 border border-gray-600 rounded-lg"
        >
            <div class="flex items-center gap-4 p-4">
                <div class="flex flex-col">
                    <label class="mb-1 text-xs font-semibold text-gray-400">
                        Background
                    </label>

                    <select
                        v-model="background"
                        class="text-sm text-gray-400 bg-gray-800 border-gray-600 rounded-md cursor-pointer hover:bg-gray-900"
                    >
                        <option
                            v-for="option in backgroundOptions"
                            :value="option.name"
                            :key="option.name"
                        >
                            {{ option.title }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label class="mb-1 text-xs font-semibold text-gray-400">
                        File Type
                    </label>

                    <select
                        v-model="exportAs"
                        class="text-sm text-gray-400 bg-gray-800 border-gray-600 rounded-md cursor-pointer hover:bg-gray-900"
                    >
                        <option
                            v-for="option in exportOptions"
                            :value="option.name"
                            :key="option.name"
                        >
                            {{ option.title }}
                        </option>
                    </select>
                </div>

                <div class="flex flex-col">
                    <label class="mb-1 text-xs font-semibold text-gray-400">
                        Theme
                    </label>

                    <select
                        v-model="themeName"
                        class="text-sm text-gray-400 bg-gray-800 border-gray-600 rounded-md cursor-pointer hover:bg-gray-900"
                    >
                        <option
                            v-for="option in themeOptions"
                            :value="option"
                            :key="option"
                        >
                            {{ option }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="flex flex-col">
                <button
                    type="button"
                    @click="saveScreenshot"
                    class="inline-flex items-center h-full gap-2 px-4 py-2 text-gray-400 bg-gray-800 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-900"
                >
                    <ExternalLinkIcon class="w-4 h-4" />
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { ExternalLinkIcon, EyeIcon, EyeOffIcon } from "vue-feather-icons";

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

    components: { EyeIcon, EyeOffIcon, ExternalLinkIcon },

    watch: {
        code() {
            this.regeneratePreview();
        },

        language() {
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

    data() {
        return {
            title: null,
            exportAs: "png",
            background: "teal",
            editingTitle: false,
            themeType: "light",
            themeName: "github-light",
            themeBackground: "#fff",
            hovering: null,
            lines: [],
            focused: [],
        };
    },

    mounted() {
        const waitForShiki = () => {
            typeof window.shiki !== "undefined"
                ? this.initShiki()
                : setTimeout(waitForShiki, 250);
        };

        waitForShiki();
    },

    computed: {
        customLanguages() {
            return [];
        },

        backgroundOptions() {
            return [
                { name: "teal", title: "Teal" },
                { name: "candy", title: "Candy" },
                { name: "midnight", title: "Midnight" },
                { name: "sunset", title: "Sunset" },
            ];
        },

        backgrounds() {
            return {
                teal: "bg-gradient-to-bl from-green-400 to-blue-500",
                candy: "bg-gradient-to-bl from-pink-400 to-purple-500",
                midnight: "bg-gradient-to-bl from-green-400 to-black-500",
                sunset: "bg-gradient-to-bl from-yellow-400 to-red-500",
            };
        },

        exportOptions() {
            return [
                { name: "png", title: "PNG" },
                { name: "jpg", title: "JPEG" },
                { name: "svg", title: "SVG" },
            ];
        },

        exportMethod() {
            return {
                png: "toPng",
                jpg: "toJpeg",
                svg: "toSvg",
            }[this.exportAs];
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

            this.shiki
                .getHighlighter({
                    theme: this.themeName,
                    langs: [
                        ...this.shiki.BUNDLED_LANGUAGES,
                        ...this.customLanguages,
                    ],
                })
                .then((highlighter) => {
                    this.highlighter = highlighter;

                    this.regeneratePreview();
                });
        },

        saveScreenshot() {
            const method = this.exportMethod;

            htmlToImage[method](this.$refs.capture)
                .then((dataUrl) => {
                    const title = this.title || "Untitled-1";

                    download(dataUrl, `${title}.${this.exportAs}`);
                })
                .catch(function(error) {
                    console.error("oops, something went wrong!", error);
                });
        },

        regeneratePreview() {
            if (this.highlighter) {
                const { name, bg, type } = this.highlighter.getTheme();

                this.themeName = name;
                this.themeType = type;
                this.themeBackground = bg;

                this.lines = this.highlighter.codeToThemedTokens(
                    this.code,
                    this.language
                );
            }
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
.shiki .highlight {
    background-color: hsl(197, 88%, 94%);
    padding: 3px 0;
}

.shiki .add {
    background-color: hsl(136, 100%, 96%);
    padding: 3px 0;
}

.shiki .del {
    background-color: hsl(354, 100%, 96%);
    padding: 3px 0;
}

.shiki.focus .line:not(.focus) {
    transition: all 250ms;
    filter: blur(2px);
}

.shiki.focus:hover .line {
    transition: all 250ms;
    filter: blur(0);
}
</style>
