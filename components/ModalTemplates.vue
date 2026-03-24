<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="max-w-4xl max-h-[80vh] flex flex-col gap-0 p-0">
            <DialogHeader class="px-5 pt-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <DialogTitle class="text-sm font-semibold">Saved Templates</DialogTitle>
            </DialogHeader>

            <Scrollbar class="flex-1 overflow-auto">
                <div class="grid grid-flow-row grid-cols-2 gap-3 p-5 lg:grid-cols-3 xl:grid-cols-4">
                    <div
                        v-for="(template, index) in templates.all()"
                        :key="index"
                        class="relative flex flex-col h-40 transition-all group rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                        <TemplateOverlay class="space-x-2">
                            <TemplateActionButton
                                variant="use"
                                :icon="PlusIcon"
                                tooltip="Use Template"
                                @click="$emit('restore', template)"
                            />

                            <TemplateActionButton
                                variant="rename"
                                :icon="EditIcon"
                                tooltip="Rename Template"
                                @click="$emit('rename', template)"
                            />

                            <TemplateActionButton
                                v-if="templates.isDefault(template)"
                                variant="default-active"
                                :icon="StarIcon"
                                tooltip="Clear Default"
                                @click="$emit('clearDefault', template)"
                            />

                            <TemplateActionButton
                                v-else
                                variant="default"
                                :icon="StarIcon"
                                tooltip="Set as Default"
                                @click="$emit('setDefault', template)"
                            />

                            <TemplateActionButton
                                variant="delete"
                                :icon="XIcon"
                                tooltip="Delete Template"
                                @click="$emit('remove', template)"
                            />
                        </TemplateOverlay>

                        <div
                            :data-template-id="template.tab.id"
                            class="flex flex-col items-center h-full"
                        >
                            <div
                                v-if="template.settings.image"
                                class="w-full flex-1 bg-center bg-no-repeat bg-cover"
                                :style="{ backgroundImage: `url(${template.settings.image})` }"
                            />

                            <div v-else class="flex items-center justify-center flex-1 w-full bg-zinc-50 dark:bg-zinc-900">
                                <ImageIcon class="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                            </div>

                            <div class="w-full px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <div class="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                    {{ template.tab.name }}
                                </div>
                                <div class="text-[10px] text-zinc-400 dark:text-zinc-500">
                                    {{ new Date(template.tab.created_at).toLocaleString() }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative flex items-center justify-center h-40 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                    >
                        <TemplateOverlay>
                            <TemplateActionButton
                                variant="save"
                                :icon="SaveIcon"
                                tooltip="Save Current Project"
                                @click="$emit('save')"
                            />
                        </TemplateOverlay>

                        <PlusIcon class="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                    </div>
                </div>
            </Scrollbar>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { XIcon, PlusIcon, ImageIcon, StarIcon, SaveIcon, EditIcon } from 'lucide-vue-next';

defineProps({
    modelValue: { type: [Boolean, Object], default: false },
    templates: { type: Object, required: true },
});
defineEmits(['update:modelValue', 'save', 'remove', 'rename', 'restore', 'setDefault', 'clearDefault']);
</script>
