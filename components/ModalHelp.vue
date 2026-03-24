<template>
    <Modal v-bind="$attrs" size="sm" class="space-y-4" header="Help Guide">
        <div class="prose prose-invert prose-sm max-w-none p-4" v-html="content" />
    </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const content = ref('');

onMounted(async () => {
    const md = await import('@/content/help.md?raw');
    const { marked } = await import('marked');
    content.value = marked(md.default);
});
</script>
