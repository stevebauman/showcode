<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="flex max-h-[80vh] max-w-4xl flex-col gap-0 p-0">
            <DialogHeader
                class="shrink-0 border-b border-zinc-200 px-5 pt-4 pb-3 dark:border-zinc-800"
            >
                <DialogTitle class="text-sm font-semibold">Saved Projects</DialogTitle>
            </DialogHeader>

            <ScrollArea class="flex-1 overflow-auto">
                <div
                    v-if="projects.all().length"
                    class="grid grid-flow-row grid-cols-2 gap-3 p-5 lg:grid-cols-3 xl:grid-cols-4"
                >
                    <div
                        v-for="project in projects.all()"
                        :key="project.tab.id"
                        class="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                    >
                        <div
                            class="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 rounded-md bg-white/80 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 dark:bg-zinc-900/80"
                        >
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                v-tooltip.bottom="'Rename'"
                                @click="$emit('rename', project)"
                            >
                                <EditIcon class="size-3.5" />
                            </Button>

                            <Button
                                size="icon-sm"
                                variant="ghost"
                                class="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                                v-tooltip.bottom="'Delete'"
                                @click="$emit('remove', project)"
                            >
                                <XIcon class="size-3.5" />
                            </Button>
                        </div>

                        <button
                            :data-saved-project-id="project.tab.id"
                            class="flex h-36 w-full cursor-pointer flex-col items-center text-left"
                            @click="$emit('open', project)"
                        >
                            <div
                                v-if="project.settings.image"
                                class="w-full flex-1 bg-cover bg-center bg-no-repeat"
                                :style="{ backgroundImage: `url(${project.settings.image})` }"
                            />

                            <div
                                v-else
                                class="flex w-full flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-900"
                            >
                                <ImageIcon class="size-8 text-zinc-300 dark:text-zinc-600" />
                            </div>
                        </button>

                        <div
                            class="w-full border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <div
                                class="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                {{ project.tab.name }}
                            </div>
                            <div class="text-[10px] text-zinc-400 dark:text-zinc-500">
                                {{ new Date(project.tab.saved_at).toLocaleString() }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="flex min-h-48 items-center justify-center px-5 py-8">
                    <div class="text-center">
                        <FolderOpenIcon
                            class="mx-auto mb-2 size-8 text-zinc-300 dark:text-zinc-700"
                        />
                        <p class="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                            No saved projects yet.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { EditIcon, FolderOpenIcon, ImageIcon, XIcon } from 'lucide-vue-next';

defineProps({
    modelValue: { type: [Boolean, Object], default: false },
    projects: { type: Object, required: true },
});

defineEmits(['update:modelValue', 'open', 'remove', 'rename']);
</script>
