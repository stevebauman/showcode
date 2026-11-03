<template>
    <div
        class="text-ui-muted [&_h2]:text-ui-text space-y-2 text-[13px] leading-relaxed [&_a]:underline [&_h2]:mt-4 [&_h2]:text-xs [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_li]:ml-4 [&_li]:list-disc"
        v-html="html"
    />
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({ content: { type: String, required: true } });

// Release Markdown is bundled with the application and authored in this repository.
const html = computed(() => marked.parse(props.content));
</script>
