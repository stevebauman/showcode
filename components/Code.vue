<template>
    <div class="shiki" :class="{ focus: focusing }">
        <span
            v-for="(line, lineIndex) in lines"
            :key="`line-${lineIndex}`"
            :style="{
                paddingLeft: `${padding}px`,
                paddingRight: `${padding}px`,
                backgroundColor: lineIsBeingRemoved(line)
                    ? diffRemoveBgColor
                    : lineIsBeingAdded(line)
                    ? diffAddBgColor
                    : 'inherit',
            }"
            class="relative block w-full line"
            :class="{ focus: lineIsBeingFocused(line) }"
            ><span
                v-if="showLineNumbers"
                class="number"
                :style="{
                    color: lineIsBeingRemoved(line)
                        ? diffRemoveTextColor
                        : lineIsBeingAdded(line)
                        ? diffAddTextColor
                        : null,
                }"
                >{{
                    lineIsBeingAdded(line) ? '+' : lineIsBeingRemoved(line) ? '-' : lineIndex + 1
                }}</span
            ><span v-if="line.length === 0">&#10;</span
            ><span
                v-for="(token, tokenIndex) in line"
                v-show="!tokenContainsAnnotation(token)"
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
import chroma from 'chroma-js';
import collect from 'collect.js';
import { some, includes } from 'lodash';
import { computed, toRefs } from '@nuxtjs/composition-api';

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

const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

export default {
    props: {
        lines: {
            type: Array,
            default: () => [],
        },
        padding: {
            type: [Number, String],
            default: 0,
        },
        preview: {
            type: Boolean,
            default: false,
        },
        themeType: {
            type: String,
            default: 'light',
        },
        showLineNumbers: {
            type: Boolean,
            default: false,
        },
    },

    setup(props) {
        const { lines, themeType } = toRefs(props);

        const escapeHtml = (html) => html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);

        const lineContainsValue = (line, value) =>
            collect(line).contains(({ content }) => content.includes(value));

        const lineIsBeingAdded = (line) => lineContainsValue(line, '{+}');
        const lineIsBeingRemoved = (line) => lineContainsValue(line, '{-}');
        const lineIsBeingFocused = (line) => lineContainsValue(line, '{*}');

        const focusing = computed(() => some(lines.value, (line) => lineIsBeingFocused(line)));

        const tokenContainsAnnotation = (token) =>
            some(['{-}', '{+}', '{*}'], (annotation) => includes(token.content, annotation));

        const diffAddRgb = [22, 250, 74];
        const diffRemoveRgb = [250, 38, 38];

        const diffAddBgColor = computed(() =>
            chroma(diffAddRgb).alpha(themeType.value === 'light' ? 0.2 : 0.3)
        );

        const diffRemoveBgColor = computed(() =>
            chroma(diffRemoveRgb).alpha(themeType.value === 'light' ? 0.2 : 0.3)
        );

        const diffAddTextColor = computed(() =>
            chroma(diffAddRgb).darken(themeType.value === 'light' ? 1 : -3)
        );

        const diffRemoveTextColor = computed(() =>
            chroma(diffRemoveRgb).darken(themeType.value === 'light' ? 1 : -3)
        );

        const tokenFontStyle = (token) =>
            token.fontStyle > FONT_STYLE.None ? FONT_STYLE_TO_CSS[token.fontStyle] : {};

        return {
            focusing,
            escapeHtml,
            tokenFontStyle,
            tokenContainsAnnotation,
            lineIsBeingAdded,
            lineIsBeingRemoved,
            lineIsBeingFocused,
            diffAddBgColor,
            diffRemoveBgColor,
            diffAddTextColor,
            diffRemoveTextColor,
        };
    },
};
</script>

<style lang="postcss">
.shiki .line {
    white-space: pre;
    word-break: normal;
    word-wrap: break-word;
}

.shiki.focus .line:not(.focus) {
    filter: blur(1px);
    transition: filter 250ms;
}

.shiki.focus:hover .line {
    filter: blur(0);
    transition: filter 250ms;
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
