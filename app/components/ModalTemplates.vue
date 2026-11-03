<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="flex max-h-[80vh] max-w-4xl flex-col gap-0 p-0">
            <DialogHeader class="border-ui-line shrink-0 border-b px-5 pt-4 pb-3">
                <DialogTitle class="text-sm font-semibold">Saved Templates</DialogTitle>
            </DialogHeader>

            <ScrollArea class="flex-1 overflow-auto">
                <div class="grid grid-flow-row grid-cols-2 gap-3 p-5 lg:grid-cols-3 xl:grid-cols-4">
                    <div
                        v-for="(template, index) in templates.all()"
                        :key="index"
                        class="group rounded-surface border-ui-line relative flex flex-col overflow-hidden border transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                    >
                        <div
                            class="rounded-control absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 bg-white/80 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 dark:bg-zinc-900/80"
                        >
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                v-tooltip.bottom="'Rename'"
                                @click="$emit('rename', template)"
                            >
                                <EditIcon class="size-3.5" />
                            </Button>

                            <Button
                                v-if="templates.isDefault(template)"
                                size="icon-sm"
                                variant="ghost"
                                class="text-yellow-500"
                                v-tooltip.bottom="'Clear Default'"
                                @click="$emit('clearDefault', template)"
                            >
                                <StarIcon class="size-3.5 fill-current" />
                            </Button>

                            <Button
                                v-else
                                size="icon-sm"
                                variant="ghost"
                                v-tooltip.bottom="'Set as Default'"
                                @click="$emit('setDefault', template)"
                            >
                                <StarIcon class="size-3.5" />
                            </Button>

                            <Button
                                size="icon-sm"
                                variant="ghost"
                                class="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                                v-tooltip.bottom="'Delete'"
                                @click="$emit('remove', template)"
                            >
                                <XIcon class="size-3.5" />
                            </Button>
                        </div>

                        <button
                            :data-template-id="template.tab.id"
                            class="flex h-36 w-full cursor-pointer flex-col items-center text-left"
                            @click="$emit('restore', template)"
                        >
                            <div
                                v-if="template.settings.image"
                                class="w-full flex-1 bg-cover bg-center bg-no-repeat"
                                :style="{ backgroundImage: `url(${template.settings.image})` }"
                            />

                            <div
                                v-else
                                class="bg-ui-chrome flex w-full flex-1 items-center justify-center"
                            >
                                <ImageIcon class="size-8 text-zinc-300 dark:text-zinc-600" />
                            </div>
                        </button>

                        <div class="border-ui-line bg-ui-panel w-full border-t px-3 py-2">
                            <div class="text-ui-text truncate text-xs font-medium">
                                {{ template.tab.name }}
                            </div>
                            <div class="text-[10px] text-zinc-400 dark:text-zinc-500">
                                {{ new Date(template.tab.created_at).toLocaleString() }}
                            </div>
                        </div>
                    </div>

                    <button
                        class="rounded-surface flex min-h-44 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-zinc-300 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
                        @click="$emit('save')"
                    >
                        <SaveIcon class="mb-1.5 size-5 text-zinc-400 dark:text-zinc-500" />
                        <span class="text-ui-muted text-xs font-medium">Save Current</span>
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
defineEmits([
    'update:modelValue',
    'save',
    'remove',
    'rename',
    'restore',
    'setDefault',
    'clearDefault',
]);
</script>
