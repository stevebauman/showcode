<template>
    <span
        :style="{
            paddingLeft: `${padding}px`,
            paddingRight: `${padding}px`,
            backgroundColor: `${backgroundColor}`,
        }"
        class="relative block w-full"
        :class="{ focus: lineIsBeingFocused }"
        ><span v-if="showLineNumbers" class="w-4 mr-4 text-right" :style="{ color: color }">{{
            lineIsBeingAdded ? '+' : lineIsBeingRemoved ? '-' : number + 1
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
</template>

<script>
import chroma from 'chroma-js';
import { computed, toRefs } from '@nuxtjs/composition-api';
import useCodeUtilities from '../composables/useCodeUtilities';

export default {
    props: {
        line: {
            type: Array,
            default: () => [],
        },
        number: {
            type: Number,
            default: 0,
        },
        padding: {
            type: [Number, String],
            default: 0,
        },
        number: {
            type: Number,
            default: 0,
        },
        showLineNumbers: {
            type: Boolean,
            default: false,
        },
        themeType: {
            type: String,
            default: 'light',
        },
    },

    setup(props) {
        const { line, themeType } = toRefs(props);

        const {
            escapeHtml,
            findHexInTokens,
            tokenFontStyle,
            tokensContainHex,
            tokensContainAdd,
            tokensContainFocus,
            tokensContainRemove,
            tokenContainsAnnotation,
        } = useCodeUtilities();

        const lineIsBeingAdded = computed(() => tokensContainAdd(line.value));
        const lineIsBeingRemoved = computed(() => tokensContainRemove(line.value));
        const lineIsBeingFocused = computed(() => tokensContainFocus(line.value));
        const lineIsBeingHighlighted = computed(() => tokensContainHex(line.value));

        const color = computed(() => {
            switch (true) {
                case lineIsBeingAdded.value:
                    return diffAddTextColor.value;
                case lineIsBeingRemoved.value:
                    return diffRemoveTextColor.value;
                default:
                    return null;
            }
        });

        const backgroundColor = computed(() => {
            switch (true) {
                case lineIsBeingAdded.value:
                    return diffAddBgColor.value;
                case lineIsBeingRemoved.value:
                    return diffRemoveBgColor.value;
                case lineIsBeingHighlighted.value:
                    return highlightBgColor.value;
                default:
                    return 'inherit';
            }
        });

        const diffAddRgb = [22, 250, 74];
        const diffRemoveRgb = [250, 38, 38];

        const diffAddBgColor = computed(() =>
            chroma(diffAddRgb)
                .alpha(themeType.value === 'light' ? 0.2 : 0.3)
                .css()
        );

        const diffRemoveBgColor = computed(() =>
            chroma(diffRemoveRgb)
                .alpha(themeType.value === 'light' ? 0.2 : 0.3)
                .css()
        );

        const diffAddTextColor = computed(() =>
            chroma(diffAddRgb)
                .darken(themeType.value === 'light' ? 1 : -3)
                .css()
        );

        const diffRemoveTextColor = computed(() =>
            chroma(diffRemoveRgb)
                .darken(themeType.value === 'light' ? 1 : -3)
                .css()
        );

        const highlightBgColor = computed(() => {
            const color = findHexInTokens(line.value);

            try {
                return chroma(color).css();
            } catch (e) {
                return null;
            }
        });

        return {
            color,
            backgroundColor,
            escapeHtml,
            tokenFontStyle,
            tokenContainsAnnotation,
            lineIsBeingAdded,
            lineIsBeingRemoved,
            lineIsBeingFocused,
        };
    },
};
</script>
