<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="flex max-h-[80vh] max-w-4xl flex-col gap-0 p-0">
            <DialogHeader
                class="shrink-0 border-b border-zinc-200 px-5 pt-4 pb-3 dark:border-zinc-800"
            >
                <DialogTitle class="text-sm font-semibold">Saved Projects</DialogTitle>
                <DialogDescription class="text-xs">
                    Open tabs are restored automatically. Saved projects stay available here when
                    you want to close a tab and reopen it later.
                </DialogDescription>
            </DialogHeader>

            <ScrollArea class="flex-1 overflow-auto">
                <div v-if="savedProjects.length" class="space-y-5 p-5">
                    <section v-if="recentProjects.length" class="space-y-2">
                        <h3 class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Recent Projects
                        </h3>

                        <div
                            class="grid grid-flow-row grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            <div
                                v-for="project in recentProjects"
                                :key="`recent-${project.tab.id}`"
                                class="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                            >
                                <ModalSavedProjectCard
                                    :project="project"
                                    @open="$emit('open', project)"
                                    @remove="$emit('remove', project)"
                                    @rename="$emit('rename', project)"
                                />
                            </div>
                        </div>
                    </section>

                    <section class="space-y-2">
                        <h3 class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Saved Projects
                        </h3>

                        <div
                            class="grid grid-flow-row grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            <div
                                v-for="project in savedProjects"
                                :key="project.tab.id"
                                class="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                            >
                                <ModalSavedProjectCard
                                    :project="project"
                                    @open="$emit('open', project)"
                                    @remove="$emit('remove', project)"
                                    @rename="$emit('rename', project)"
                                />
                            </div>
                        </div>
                    </section>
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
import { computed } from 'vue';
import { FolderOpenIcon } from 'lucide-vue-next';

const props = defineProps({
    modelValue: { type: [Boolean, Object], default: false },
    projects: { type: Object, required: true },
});

defineEmits(['update:modelValue', 'open', 'remove', 'rename']);

const recentProjects = computed(() => props.projects.recent());
const savedProjects = computed(() => props.projects.all());
</script>
