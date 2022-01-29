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
import { cloneDeep } from 'lodash';
import { EyeIcon, EyeOffIcon } from 'vue-feather-icons';
import { ref, toRefs, useContext, watch } from '@nuxtjs/composition-api';

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
        focused: {
            type: Array,
            default: () => [],
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

    components: { EyeIcon, EyeOffIcon },

    setup(props, context) {
        const { emit } = context;

        const { $bus } = useContext();

        const { lines, focused } = toRefs(props);

        const hovering = ref(null);

        $bus.$on('clear-focused', () => emit('update:focused', []));

        const toggleFocus = (lineIndex) => {
            const toggled = cloneDeep(focused.value);

            if (toggled.includes(lineIndex)) {
                const index = toggled.indexOf(lineIndex);

                toggled.splice(index, 1);
            } else {
                toggled.push(lineIndex);
            }

            emit('update:focused', toggled);
        };

        const escapeHtml = (html) => html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);

        const lineContainsValue = (line, value) => {
            for (const token of line) {
                if (token.content.includes(value)) {
                    return true;
                }
            }

            return false;
        };

        const lineIsBeingAdded = (line) => lineContainsValue(line, '{+}');
        const lineIsBeingRemoved = (line) => lineContainsValue(line, '{-}');

        const tokenContainsDiff = (token) =>
            token.content.includes('{-}') || token.content.includes('{+}');

        const tokenFontStyle = (token) =>
            token.fontStyle > FONT_STYLE.None ? FONT_STYLE_TO_CSS[token.fontStyle] : {};

        watch(lines, () =>
            emit(
                'update:focused',
                focused.value.filter((lineIndex) => lines.value[lineIndex] !== undefined)
            )
        );

        return {
            hovering,
            toggleFocus,
            escapeHtml,
            tokenFontStyle,
            tokenContainsDiff,
            lineIsBeingAdded,
            lineIsBeingRemoved,
        };
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
