<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="flex max-h-[80vh] max-w-2xl flex-col gap-0 p-0">
            <DialogHeader
                class="shrink-0 border-b border-zinc-200 px-5 pb-3 pt-4 dark:border-zinc-800"
            >
                <DialogTitle class="text-sm font-semibold">Changelog</DialogTitle>
            </DialogHeader>

            <ScrollArea class="flex-1 overflow-auto">
                <div class="space-y-4 p-5">
                    <div
                        v-for="(entry, index) in entries"
                        :key="index"
                        class="rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                        <div
                            class="rounded-t-lg border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <span class="text-sm font-semibold">{{ entry.date }}</span>
                        </div>

                        <div class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            <div
                                v-for="(section, sIndex) in entry.sections"
                                :key="sIndex"
                                class="px-4 py-3"
                            >
                                <span
                                    class="mb-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                                    :class="badgeClass(section.type)"
                                >
                                    {{ section.type }}
                                </span>

                                <ul class="mt-1.5 space-y-1">
                                    <li
                                        v-for="(item, iIndex) in section.items"
                                        :key="iIndex"
                                        class="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                    >
                                        <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                                        <span v-html="item" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({ modelValue: { type: [Boolean, Object], default: false } });
defineEmits(['update:modelValue']);

const entries = ref([]);

const badgeClass = (type) => ({
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400': type === 'Added',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400': type === 'Changed',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400': type === 'Fixed',
});

function parseChangelog(raw) {
    const result = [];
    let current = null;

    for (const line of raw.split('\n')) {
        const dateMatch = line.match(/^## (.+)/);

        if (dateMatch) {
            current = { date: dateMatch[1], sections: [] };
            result.push(current);
            continue;
        }

        const typeMatch = line.match(/^\*\*(\w+)\*\*/);

        if (typeMatch && current) {
            current.sections.push({ type: typeMatch[1], items: [] });
            continue;
        }

        const itemMatch = line.match(/^- (.+)/);

        if (itemMatch && current?.sections.length) {
            // Convert markdown links to HTML
            const html = itemMatch[1].replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" target="_blank" class="underline hover:text-zinc-900 dark:hover:text-zinc-100">$1</a>'
            ).replace(
                /`([^`]+)`/g,
                '<code class="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">$1</code>'
            );

            current.sections.at(-1).items.push(html);
        }
    }

    return result;
}

onMounted(async () => {
    const md = await import('@/content/changelog.md?raw');
    entries.value = parseChangelog(md.default);
});
</script>
