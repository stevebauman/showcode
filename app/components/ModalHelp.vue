<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="flex max-h-[80vh] max-w-2xl flex-col gap-0 p-0">
            <DialogHeader
                class="shrink-0 border-b border-zinc-200 px-5 pb-3 pt-4 dark:border-zinc-800"
            >
                <DialogTitle class="text-sm font-semibold">Help Guide</DialogTitle>
            </DialogHeader>

            <ScrollArea class="flex-1 overflow-auto">
                <div class="space-y-4 p-5">
                    <div
                        v-for="(section, index) in sections"
                        :key="index"
                        class="rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                        <div
                            class="rounded-t-lg border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <span class="text-sm font-semibold">{{ section.title }}</span>
                        </div>

                        <div class="space-y-4 px-4 py-4">
                            <template v-for="(block, bIndex) in section.blocks" :key="bIndex">
                                <p
                                    v-if="block.type === 'text'"
                                    class="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                                >
                                    {{ block.content }}
                                </p>

                                <div v-else-if="block.type === 'image'" class="flex justify-center">
                                    <img
                                        :src="block.src"
                                        :width="block.width"
                                        class="rounded-lg border border-zinc-200 dark:border-zinc-700"
                                    />
                                </div>

                                <div
                                    v-else-if="block.type === 'table'"
                                    class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
                                >
                                    <table class="w-full text-sm">
                                        <thead>
                                            <tr
                                                class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                                            >
                                                <th
                                                    v-for="(header, hIndex) in block.headers"
                                                    :key="hIndex"
                                                    class="px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400"
                                                >
                                                    {{ header }}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            class="divide-y divide-zinc-100 dark:divide-zinc-800/50"
                                        >
                                            <tr v-for="(row, rIndex) in block.rows" :key="rIndex">
                                                <td
                                                    class="px-4 py-2.5 font-medium text-zinc-700 dark:text-zinc-300"
                                                >
                                                    {{ row.label }}
                                                </td>
                                                <td class="px-4 py-2.5">
                                                    <div class="flex items-center gap-1">
                                                        <kbd
                                                            v-for="(key, kIndex) in row.keys"
                                                            :key="kIndex"
                                                            class="rounded-md border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 shadow-xs dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                                        >
                                                            {{ key }}
                                                        </kbd>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>

<script setup>
defineProps({ modelValue: { type: [Boolean, Object], default: false } });
defineEmits(['update:modelValue']);

const sections = [
    {
        title: 'Code Highlighting',
        blocks: [
            {
                type: 'text',
                content:
                    'To highlight portions of your code to display an added, removed, or focused line, you can right click in the code editor and select from the context menu:',
            },
            {
                type: 'image',
                src: 'https://user-images.githubusercontent.com/6421846/175950540-c22c5868-eca0-4608-9f43-44681dcc3aee.png',
                width: 400,
            },
            {
                type: 'text',
                content:
                    'Once a line has been highlighted, colored dots will be displayed indicating their highlight:',
            },
            {
                type: 'image',
                src: 'https://user-images.githubusercontent.com/6421846/175952152-acd7c0ae-719b-4fb8-89c8-5c6f8f51df19.png',
                width: 400,
            },
            {
                type: 'text',
                content:
                    'Highlights can also be toggled in the editor using the keyboard shortcuts below:',
            },
            {
                type: 'table',
                headers: ['Style', 'Keyboard Shortcut'],
                rows: [
                    { label: 'Added Line', keys: ['⌘/Ctrl', 'Shift', 'A'] },
                    { label: 'Removed Line', keys: ['⌘/Ctrl', 'Shift', 'R'] },
                    { label: 'Focused Line', keys: ['⌘/Ctrl', 'Shift', 'F'] },
                ],
            },
        ],
    },
];
</script>
