<template>
    <Modal v-bind="$attrs" header="Saved Templates">
        <div
           
            class="grid grid-flow-row grid-cols-2 gap-4 mt-8 lg:grid-cols-3 xl:grid-cols-4"
        >
            <div
                v-for="(template, index) in templates.all()"
                :key="index"
                class="relative flex flex-col h-48 transition-all transform group rounded-xl border border-ui-gray-800"
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
                    class="flex flex-col items-center h-full overflow-hidden rounded-xl"
                >
                    <div
                        v-if="template.settings.image"
                        class="w-full h-full bg-center bg-no-repeat bg-cover"
                        :style="{
                            backgroundImage: `url(${template.settings.image})`,
                        }"
                    ></div>

                    <div v-else class="flex items-center justify-center h-full">
                        <ImageIcon class="w-10 h-10 text-gray-300" />
                    </div>

                    <div
                        class="flex flex-col justify-center w-full px-4 py-2 bg-ui-gray-600 text-ui-gray-100"
                    >
                        <div class="mb-1 text-sm font-semibold">
                            {{ template.tab.name }}
                        </div>

                        <div class="text-xs text-ui-gray-200">
                            {{ new Date(template.tab.created_at).toLocaleString() }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="relative flex items-center justify-center h-48 transition-all transform border-2 border-dashed border-ui-gray-800 rounded-xl group hover:border-ui-gray-600"
            >
                <TemplateOverlay>
                    <TemplateActionButton
                       
                        variant="save"
                        :icon="SaveIcon"
                        tooltip="Save Current Project"
                        @click="$emit('save')"
                    />
                </TemplateOverlay>

                <PlusIcon class="w-8 h-8 text-ui-gray-500" />
            </div>
        </div>
    </Modal>
</template>

<script setup>
import { XIcon, PlusIcon, ImageIcon, StarIcon, SaveIcon, EditIcon } from 'lucide-vue-next';

defineProps({ templates: { type: Object, required: true } });
defineEmits(['save', 'remove', 'rename', 'restore', 'setDefault', 'clearDefault']);
</script>
