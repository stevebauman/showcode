<template>
    <span
        :style="{
            filter: `blur(${blurStrength}px)`,
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

<script setup>
import chroma from 'chroma-js';
import { computed } from 'vue';
import usePreferencesStore from '@/composables/usePreferencesStore';

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

const props = defineProps({
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
    focusing: {
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
    showLineNumbers: {
        type: Boolean,
        default: false,
    },
    themeType: {
        type: String,
        default: 'light',
    },
});

const preferences = usePreferencesStore();

const blurStrength = computed(() => {
    if (props.focused || !props.focusing) {
        return 0;
    }

    return preferences.previewCodeBlurStrength;
});

const escapeHtml = (html) => html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);

const tokenFontStyle = (token) =>
    token.fontStyle > FONT_STYLE.None ? FONT_STYLE_TO_CSS[token.fontStyle] : {};

const diffAddRgb = [22, 250, 74];
const diffRemoveRgb = [250, 38, 38];

const color = computed(() => {
    switch (true) {
        case props.added:
            return chroma(diffAddRgb)
                .darken(props.themeType === 'light' ? 1 : -3)
                .css();
        case props.removed:
            return chroma(diffRemoveRgb)
                .darken(props.themeType === 'light' ? 1 : -3)
                .css();
        default:
            return null;
    }
});

const backgroundColor = computed(() => {
    switch (true) {
        case props.added:
            return chroma(diffAddRgb)
                .alpha(props.themeType === 'light' ? 0.2 : 0.3)
                .css();
        case props.removed:
            return chroma(diffRemoveRgb)
                .alpha(props.themeType === 'light' ? 0.2 : 0.3)
                .css();
        default:
            return 'inherit';
    }
});

const lineNumberColor = computed(() => {
    switch (true) {
        case props.added:
            return chroma(diffAddRgb)
                .darken(props.themeType === 'light' ? 1 : 0)
                .css();
        case props.removed:
            return chroma(diffRemoveRgb)
                .darken(props.themeType === 'light' ? 1 : 0)
                .css();
        default:
            return chroma([115, 138, 148])
                .alpha(props.themeType === 'light' ? 0.7 : 0.9)
                .css();
    }
});
</script>
