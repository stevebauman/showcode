<template>
    <div class="shiki" :class="{ focus: focused.length > 0 }">
        <span
            @mouseover="hovering = lineIndex"
            @mouseleave="hovering = null"
            v-for="(line, lineIndex) in lines"
            :key="`line-${lineIndex}`"
            class="relative block w-full line"
            :class="{
                focus: focused.includes(lineIndex),
                'cursor-pointer': hovering === lineIndex,
                'bg-opacity-20': themeType === 'light',
                'bg-opacity-60': themeType === 'dark',
                'hover:bg-gray-50': themeType === 'light',
                'hover:bg-gray-600': themeType === 'dark',
                'bg-red-400': lineIsBeingRemoved(line),
                'bg-green-400': lineIsBeingAdded(line),
            }"
            ><span v-if="showLineNumbers" class="number">{{ lineIndex + 1 }}</span
            ><span
                v-if="hovering === lineIndex"
                class="absolute right-0 flex items-stretch font-normal whitespace-normal top-1/2"
            >
                <button
                    @click="() => toggleFocus(lineIndex)"
                    class="transform -translate-y-1/2 border border-gray-400 rounded-md p-0.5 bg-white hover:bg-gray-100"
                >
                    <EyeOffIcon v-if="focused.includes(lineIndex)" class="w-4 h-4" />
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
    </div>
</template>

<script>
import { EyeIcon, EyeOffIcon } from 'vue-feather-icons';

const FONT_STYLE = {
    NotSet: -1,
    None: 0,
    Italic: 1,
    Bold: 2,
    Underline: 4,
};

const FONT_STYLE_TO_CSS = {
    [FONT_STYLE.Bold]: { fontWeight: 'bold' },
    [FONT_STYLE.Italic]: { fontStyle: 'italic' },
    [FONT_STYLE.Underline]: { textDecoration: 'underline' },
};

export default {
    props: {
        lines: Array,
        themeType: String,
        showLineNumbers: Boolean,
    },

    components: { EyeIcon, EyeOffIcon },

    created() {
        this.$nuxt.$on('clear-focused', () => {
            // Only clear focused for the tab that is visible.
            if (this.$el.offsetParent) {
                this.focused = [];
            }
        });
    },

    data() {
        return {
            focused: [],
            hovering: null,
        };
    },

    watch: {
        lines() {
            // Filter out any focused lines that are no longer there.
            this.focused = this.focused.filter((lineIndex) => this.lines[lineIndex] !== undefined);
        },
    },

    methods: {
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
    },
};
</script>

<style lang="postcss">
.shiki .line {
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: normal;
}

.shiki.focus .line:not(.focus) {
    transition: all 250ms;
    filter: blur(1px);
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
