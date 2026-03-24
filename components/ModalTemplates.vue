<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="max-w-4xl max-h-[80vh] flex flex-col gap-0 p-0">
            <DialogHeader class="px-5 pt-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <DialogTitle class="text-sm font-semibold">Saved Templates</DialogTitle>
            </DialogHeader>

            <ScrollArea class="flex-1 overflow-auto">
                <div class="grid grid-flow-row grid-cols-2 gap-3 p-5 lg:grid-cols-3 xl:grid-cols-4">
                    <div
                        v-for="(template, index) in templates.all()"
                        :key="index"
                        class="relative flex flex-col transition-all group rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700"
                    >
                        <div class="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                v-tooltip.bottom="'Rename'"
                                @click="$emit('rename', template)"
                            >
                                <EditIcon class="w-3.5 h-3.5" />
                            </Button>

                            <Button
                                v-if="templates.isDefault(template)"
                                size="icon-sm"
                                variant="ghost"
                                class="text-yellow-500"
                                v-tooltip.bottom="'Clear Default'"
                                @click="$emit('clearDefault', template)"
                            >
                                <StarIcon class="w-3.5 h-3.5 fill-current" />
                            </Button>

                            <Button
                                v-else
                                size="icon-sm"
                                variant="ghost"
                                v-tooltip.bottom="'Set as Default'"
                                @click="$emit('setDefault', template)"
                            >
                                <StarIcon class="w-3.5 h-3.5" />
                            </Button>

                            <Button
                                size="icon-sm"
                                variant="ghost"
                                class="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                                v-tooltip.bottom="'Delete'"
                                @click="$emit('remove', template)"
                            >
                                <XIcon class="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        <button
                            :data-template-id="template.tab.id"
                            class="flex flex-col items-center h-36 w-full text-left cursor-pointer"
                            @click="$emit('restore', template)"
                        >
                            <div
                                v-if="template.settings.image"
                                class="w-full flex-1 bg-center bg-no-repeat bg-cover"
                                :style="{ backgroundImage: `url(${template.settings.image})` }"
                            />

                            <div v-else class="flex items-center justify-center flex-1 w-full bg-zinc-50 dark:bg-zinc-900">
                                <ImageIcon class="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                            </div>
                        </button>

                        <div class="w-full px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <div class="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                {{ template.tab.name }}
                            </div>
                            <div class="text-[10px] text-zinc-400 dark:text-zinc-500">
                                {{ new Date(template.tab.created_at).toLocaleString() }}
                            </div>
                        </div>
                    </div>

                    <button
                        class="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                        @click="$emit('save')"
                    >
                        <SaveIcon class="w-5 h-5 text-zinc-400 dark:text-zinc-500 mb-1.5" />
                        <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Save Current</span>
                    </button>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { XIcon, ImageIcon, StarIcon, SaveIcon, EditIcon } from 'lucide-vue-next';

defineProps({
    modelValue: { type: [Boolean, Object], default: false },
    templates: { type: Object, required: true },
});
defineEmits(['update:modelValue', 'save', 'remove', 'rename', 'restore', 'setDefault', 'clearDefault']);
</script>
