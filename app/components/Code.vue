<template>
    <div>
        <CodeLine
            v-for="(line, lineIndex) in lines"
            class="line whitespace-pre"
            :key="`line-${lineIndex}`"
            :line="line"
            :number="lineIndex"
            :focusing="focusing"
            :theme-type="themeType"
            :show-line-numbers="showLineNumbers"
            :added="added.includes(lineIndex + 1)"
            :removed="removed.includes(lineIndex + 1)"
            :focused="focused.includes(lineIndex + 1)"
        />
    </div>
</template>

<script setup>
import { some } from 'lodash';
import { computed, toRefs } from 'vue';

const props = defineProps({
    lines: { type: Array, default: () => [] },
    added: { type: Array, default: () => [] },
    removed: { type: Array, default: () => [] },
    focused: { type: Array, default: () => [] },
    themeType: { type: String, default: 'light' },
    showLineNumbers: { type: Boolean, default: false },
});

const { lines, focused } = toRefs(props);

const focusing = computed(() =>
    some(lines.value, (line, index) => focused.value.includes(index + 1))
);
</script>
