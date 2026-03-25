<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="max-w-2xl max-h-[80vh] flex flex-col gap-0 p-0">
            <DialogHeader class="px-5 pt-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <DialogTitle class="text-sm font-semibold">Help Guide</DialogTitle>
            </DialogHeader>

            <ScrollArea class="flex-1 overflow-auto">
                <div class="prose dark:prose-invert prose-sm max-w-none p-5" v-html="content" />
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({ modelValue: { type: [Boolean, Object], default: false } });
defineEmits(['update:modelValue']);

const content = ref('');

onMounted(async () => {
    const md = await import('@/content/help.md?raw');
    const { marked } = await import('marked');
    content.value = marked(md.default);
});
</script>
