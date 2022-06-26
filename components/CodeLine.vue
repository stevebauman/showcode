<template>
    <span
        :style="{
            paddingLeft: `${padding}px`,
            paddingRight: `${padding}px`,
            backgroundColor: `${backgroundColor}`,
        }"
        class="relative block w-full"
        :class="{ focus: focused }"
        ><span
            v-if="showLineNumbers"
            :style="{ color: lineNumberColor }"
            class="inline-block w-4 mr-4 text-right whitespace-pre"
            >{{ added ? '+' : removed ? '-' : number + 1 }}</span
        ><span v-if="line.length === 0">&#10;</span
        ><span
            v-for="(token, tokenIndex) in line"
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
import useCodeUtilities from '@/composables/useCodeUtilities';

export default {
    props: {
        line: {
            type: Array,
            default: () => [],
        },
        added: {
            type: Boolean,
            default: false,
        },
        removed: {
            type: Boolean,
            default: false,
        },
        focused: {
            type: Boolean,
            default: false,
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
        const { added, removed, themeType } = toRefs(props);

        const { escapeHtml, tokenFontStyle, tokenContainsAnnotation } = useCodeUtilities();

        const color = computed(() => {
            switch (true) {
                case added.value:
                    return diffAddTextColor.value;
                case removed.value:
                    return diffRemoveTextColor.value;
                default:
                    return null;
            }
        });

        const backgroundColor = computed(() => {
            switch (true) {
                case added.value:
                    return diffAddBgColor.value;
                case removed.value:
                    return diffRemoveBgColor.value;
                default:
                    return 'inherit';
            }
        });

        const diffAddRgb = [22, 250, 74];
        const diffRemoveRgb = [250, 38, 38];

        const lineNumberColor = computed(() =>
            chroma([115, 138, 148])
                .alpha(themeType.value === 'light' ? 0.7 : 0.9)
                .css()
        );

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

        return {
            color,
            backgroundColor,
            escapeHtml,
            tokenFontStyle,
            tokenContainsAnnotation,
            lineNumberColor,
        };
    },
};
</script>
