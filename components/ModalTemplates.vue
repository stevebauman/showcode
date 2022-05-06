<template>
    <Modal v-bind="$attrs" v-on="$listeners" header="Saved Templates">
        <div
            dusk="templates"
            class="grid grid-flow-row grid-cols-2 gap-4 mt-8 lg:grid-cols-3 xl:grid-cols-4"
        >
            <div
                v-for="(template, index) in templates.all()"
                :key="index"
                class="relative flex flex-col h-48 transition-all transform shadow cursor-pointer group hover:shadow-lg rounded-xl hover:-translate-y-1"
            >
                <button
                    dusk="button-remove-template"
                    @click="$emit('remove', template)"
                    class="absolute top-0 right-0 flex items-center justify-center w-8 h-8 -m-3 transition duration-100 ease-in-out rounded-full shadow text-ui-gray-200 bg-ui-gray-600 hover:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus focus:outline-none"
                >
                    <XIcon class="w-4 h-4" />
                </button>

                <button
                    dusk="button-restore-template"
                    :data-template-id="template.tab.id"
                    @click="$emit('restore', template)"
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
                </button>
            </div>

            <button
                @click="$emit('save')"
                v-tooltip.bottom="'Save Current Project'"
                class="flex items-center justify-center h-48 transition-all transform border-2 border-dashed cursor-pointer border-ui-gray-800 rounded-xl group hover:shadow-lg hover:-translate-y-1"
            >
                <PlusIcon class="w-8 h-8 text-ui-gray-500" />
            </button>
        </div>
    </Modal>
</template>

<script>
import { XIcon, PlusIcon, ImageIcon } from 'vue-feather-icons';

export default {
    components: { XIcon, PlusIcon, ImageIcon },

    props: {
        templates: {
            type: Object,
            required: true,
        },
    },
};
</script>
