<template>
    <Modal v-bind="$attrs" v-on="$listeners" header="Saved Templates">
        <div
            dusk="templates"
            class="grid grid-flow-row grid-cols-2 gap-4 mt-8 lg:grid-cols-3 xl:grid-cols-4"
        >
            <div
                v-for="(template, index) in templates.all()"
                :key="index"
                class="relative flex flex-col h-48 transition-all transform group rounded-xl border border-ui-gray-800"
            >
                <TemplateOverlay class="space-x-2">
                    <TemplateActionButton
                        dusk="button-use-template"
                        variant="use"
                        :icon="PlusIcon"
                        tooltip="Use Template"
                        @click="$emit('restore', template)"
                    />

                    <TemplateActionButton
                        dusk="button-rename-template"
                        variant="rename"
                        :icon="EditIcon"
                        tooltip="Rename Template"
                        @click="$emit('rename', template)"
                    />

                    <TemplateActionButton
                        v-if="templates.isDefault(template)"
                        dusk="button-clear-default-template"
                        variant="default-active"
                        :icon="StarIcon"
                        tooltip="Clear Default"
                        @click="$emit('clearDefault', template)"
                    />

                    <TemplateActionButton
                        v-else
                        dusk="button-set-default-template"
                        variant="default"
                        :icon="StarIcon"
                        tooltip="Set as Default"
                        @click="$emit('setDefault', template)"
                    />

                    <TemplateActionButton
                        dusk="button-remove-template"
                        variant="delete"
                        :icon="XIcon"
                        tooltip="Delete Template"
                        @click="$emit('remove', template)"
                    />
                </TemplateOverlay>

                <div
                    dusk="template-preview"
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
                        dusk="button-save-template"
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

<script>
import TemplateOverlay from '@/components/TemplateOverlay.vue';
import TemplateActionButton from '@/components/TemplateActionButton.vue';
import { XIcon, PlusIcon, ImageIcon, StarIcon, SaveIcon, EditIcon } from 'vue-feather-icons';

export default {
    props: {
        templates: {
            type: Object,
            required: true,
        },
    },

    components: {
        XIcon,
        PlusIcon,
        StarIcon,
        SaveIcon,
        EditIcon,
        ImageIcon,
        TemplateOverlay,
        TemplateActionButton,
    },

    setup() {
        return {
            XIcon,
            SaveIcon,
            EditIcon,
            PlusIcon,
            StarIcon,
        };
    },
};
</script>
