<template>
    <div :class="{ focus: focusing }">
        <CodeLine
            class="whitespace-pre line"
            v-for="(line, lineIndex) in lines"
            :key="`line-${lineIndex}`"
            :line="line"
            :padding="padding"
            :number="lineIndex"
            :theme-type="themeType"
            :show-line-numbers="showLineNumbers"
        />
    </div>
</template>

<script>
import { some } from 'lodash';
import { computed, toRefs } from '@nuxtjs/composition-api';
import useCodeUtilities from '@/composables/useCodeUtilities';

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
        const { lines } = toRefs(props);

        const { tokensContainFocus } = useCodeUtilities();

        const lineIsBeingFocused = (line) => tokensContainFocus(line);

        const focusing = computed(() => some(lines.value, (line) => lineIsBeingFocused(line)));

        return {
            focusing,
            lineIsBeingFocused,
        };
    },
};
</script>

<style scoped lang="postcss">
.focus .line:not(.focus) {
    filter: blur(1px);
    transition: filter 250ms;
}

.focus .focus:hover .line {
    filter: blur(0);
    transition: filter 250ms;
}
</style>
