<template>
    <div :class="{ focus: focusing }">
        <CodeLine
            v-for="(line, lineIndex) in lines"
            class="whitespace-pre line"
            :key="`line-${lineIndex}`"
            :line="line"
            :padding="padding"
            :number="lineIndex"
            :theme-type="themeType"
            :added="added.includes(lineIndex + 1)"
            :removed="removed.includes(lineIndex + 1)"
            :focused="focused.includes(lineIndex + 1)"
            :show-line-numbers="showLineNumbers"
        />
    </div>
</template>

<script>
import { some } from 'lodash';
import { computed, toRefs } from '@nuxtjs/composition-api';

export default {
    props: {
        lines: {
            type: Array,
            default: () => [],
        },
        added: {
            type: Array,
            default: () => [],
        },
        removed: {
            type: Array,
            default: () => [],
        },
        focused: {
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
        const { lines, focused } = toRefs(props);

        const focusing = computed(() =>
            some(lines.value, (line, index) => focused.value.includes(index + 1))
        );

        return { focusing };
    },
};
</script>

<style scoped>
.focus .line:not(.focus) {
    filter: blur(1px);
    transition: filter 250ms;
}

.focus .focus:hover .line {
    filter: blur(0);
    transition: filter 250ms;
}
</style>
