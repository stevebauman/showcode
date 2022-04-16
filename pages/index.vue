<template>
    <div class="flex flex-col h-full overflow-hidden antialiased bg-ui-gray-800">
        <transition
            enter-class="scale-95 opacity-0"
            enter-active-class="transition duration-100 ease-out transform"
            enter-to-class="scale-100 opacity-100"
            leave-class="scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in transform"
            leave-to-class="scale-95 opacity-0"
        >
            <div class="absolute left-0 right-0 z-50 max-w-xl p-4 mx-auto text-center" v-if="alert">
                <Alert
                    dusk="alert"
                    :variant="alert.variant"
                    :message="alert.message"
                    @hidden="alert = null"
                />
            </div>
        </transition>

        <div class="items-center justify-between hidden w-full lg:flex">
            <div class="flex items-center justify-between w-full h-full">
                <FileDropdown dusk="button-file" text="File" :options="fileOptions" />

                <div class="flex w-full h-full gap-2 px-2 py-2 overflow-x-auto scrollbar-hide">
                    <Tab
                        v-for="(tab, index) in tabs"
                        :dusk="`tab-${index}`"
                        :key="tab.id"
                        :name="tab.name"
                        :active="currentTab === tab.id"
                        @update:name="(name) => updateTabName(tab, name)"
                        @navigate="() => setCurrentTab(tab)"
                        @close="() => removeTab(tab)"
                    />

                    <div
                        v-tooltip.right="{
                            content: canAddNewTab
                                ? null
                                : 'Download the desktop app to unlock more tabs.',
                            delay: 200,
                        }"
                    >
                        <button
                            dusk="button-add-tab"
                            @click="() => addTab()"
                            :disabled="!canAddNewTab"
                            class="flex items-center h-full px-4 py-1 space-x-4 rounded-lg text-ui-gray-400 bg-ui-gray-700 hover:text-ui-gray-300 disabled:text-ui-gray-300 hover:bg-ui-gray-900 focus:outline-none focus:text-ui-gray-100 focus:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus disabled:bg-ui-gray-900"
                        >
                            <PlusIcon class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <ToggleDarkMode
                    dusk="button-toggle-dark"
                    class="p-2 mx-2 rounded-lg text-ui-violet-500 focus:outline-none focus:ring-2 focus:ring-ui-focus"
                >
                    <template #default="{ dark }">
                        <MoonIcon v-if="dark" size="1.5x" />
                        <SunIcon v-else size="1.5x" />
                    </template>
                </ToggleDarkMode>
            </div>
        </div>

        <template v-for="tab in tabs">
            <Page
                v-show="currentTab === tab.id"
                dusk="page"
                :tab="tab"
                :key="tab.id"
                :visible="currentTab === tab.id"
                class="w-full h-full"
            />
        </template>

        <ModalPreferences dusk="modal-preferences" v-model="showingPreferencesModal" />

        <Modal dusk="modal-templates" v-model="showingTemplatesModal" header="Saved Templates">
            <div class="grid grid-flow-row grid-cols-2 gap-4 mt-8 lg:grid-cols-3 xl:grid-cols-4">
                <div
                    v-for="{ template, restore, remove } in templates"
                    :key="template.key"
                    class="relative flex flex-col h-48 transition-all transform shadow cursor-pointer group hover:shadow-lg rounded-xl hover:-translate-y-1"
                >
                    <button
                        dusk="button-remove-template"
                        @click="() => remove(template)"
                        class="absolute top-0 right-0 flex items-center justify-center w-8 h-8 -m-3 transition duration-100 ease-in-out rounded-full shadow text-ui-gray-200 bg-ui-gray-600 hover:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus focus:outline-none"
                    >
                        <XIcon class="w-4 h-4" />
                    </button>

                    <button
                        dusk="button-restore-template"
                        @click="() => restore(template)"
                        class="flex flex-col items-center h-full overflow-hidden rounded-xl"
                    >
                        <div
                            v-if="template.has('settings.image')"
                            class="w-full h-full bg-center bg-no-repeat bg-cover"
                            :style="{
                                backgroundImage: `url(${template.get('settings.image')})`,
                            }"
                        ></div>

                        <div v-else class="flex items-center justify-center h-full">
                            <ImageIcon class="w-10 h-10 text-gray-300" />
                        </div>

                        <div
                            class="flex flex-col justify-center w-full px-4 py-2 bg-ui-gray-600 text-ui-gray-100"
                        >
                            <div class="mb-1 text-sm font-semibold">
                                {{ template.get('tab.name') }}
                            </div>

                            <div class="text-xs text-ui-gray-200">
                                {{ new Date(template.get('tab.created_at')).toLocaleString() }}
                            </div>
                        </div>
                    </button>
                </div>

                <button
                    @click="saveAsTemplate"
                    class="flex items-center justify-center h-48 transition-all transform border-2 border-dashed cursor-pointer border-ui-gray-500 rounded-xl group hover:shadow-lg hover:-translate-y-1"
                >
                    <PlusIcon class="w-8 h-8 text-ui-gray-500" />
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
import download from 'downloadjs';
import { has, head, defaults } from 'lodash';
import { fileDialog } from 'file-select-dialog';
import useTabs from '../composables/useTabs';
import useTemplates from '../composables/useTemplates';
import { XIcon, PlusIcon, SunIcon, MoonIcon, ImageIcon } from 'vue-feather-icons';
import { computed, nextTick, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api';

export default {
    components: {
        XIcon,
        SunIcon,
        MoonIcon,
        PlusIcon,
        ImageIcon,
    },

    setup() {
        const { $bus, $memory } = useContext();

        const {
            tabs,
            addTab,
            makeTab,
            findTab,
            removeTab,
            exportTab,
            currentTab,
            canAddNewTab,
            setCurrentTab,
            updateTabName,
            restoreTabsFromStorage,
        } = useTabs();

        const { templates, loadTemplates, removeTemplate, canAddNewTemplate } = useTemplates();

        const alert = ref(null);
        const alertTimeout = ref(null);
        const showingTemplatesModal = ref(false);
        const showingPreferencesModal = ref(false);

        const newFromTemplate = async (template) => {
            const clone = template.clone();

            const newTab = makeTab(clone.get('tab.name'));

            clone.set('tab', newTab);

            $memory.pages.set(newTab.id, clone.all());

            addTab(newTab);

            showingTemplatesModal.value = false;
        };

        const saveAsTemplate = async () => {
            if (!canAddNewTemplate.value) {
                return $bus.$emit(
                    'alert',
                    'danger',
                    'Download the desktop app to unlock more templates.'
                );
            }

            const tab = { ...findTab(currentTab.value) };

            tab.name = tab.name || 'Untitled Project';

            tab.created_at = new Date();

            const data = await exportTab(tab);

            await $memory.templates.set(tab.id, data.all());

            loadTemplates();

            $bus.$emit('alert', 'success', 'Successfully saved template.');
        };

        const exportConfig = async () => {
            const tab = { ...findTab(currentTab.value) };

            const data = await exportTab(tab);

            const name = tab.name || 'Untitled Project';

            const config = defaults(data.all(), { page: {}, settings: {} });

            download(JSON.stringify(config, null, 2), `${name}.json`);
        };

        const importConfig = async () => {
            const files = await fileDialog({ accept: '.json' });

            const file = head(files);

            if (!file) {
                return;
            }

            const data = await new Response(file).json();

            ['tab', 'page', 'settings'].forEach((requiredKey) => {
                if (!has(data, requiredKey)) {
                    $bus.$emit(
                        'alert',
                        'danger',
                        'Error importing configuration. Required data is missing.'
                    );

                    throw new Error(
                        `The configuration file is missing the data key [${requiredKey}].`
                    );
                }
            });

            const config = $memory.pages.makeRecord(data.tab.id, data);

            const newTab = makeTab(config.get('tab.name'));

            config.set('tab', newTab);

            $memory.pages.set(newTab.id, config.all());

            addTab(newTab);
        };

        const restorableTemplates = computed(() =>
            templates.value.map((template) => ({
                template: template,
                restore: newFromTemplate,
                remove: removeTemplate,
            }))
        );

        const fileOptions = computed(() => {
            return [
                {
                    name: 'preferences',
                    title: 'Preferences',
                    click: () => (showingPreferencesModal.value = true),
                },
                {
                    name: 'save-as-template',
                    title: 'Save As Template',
                    click: saveAsTemplate,
                },
                {
                    name: 'open-templates-modal',
                    title: 'Open Saved Templates',
                    click: () => (showingTemplatesModal.value = true),
                },
                {
                    name: 'export-config',
                    title: 'Export Configuration',
                    click: exportConfig,
                },
                {
                    name: 'import-config',
                    title: 'Import Configuration',
                    click: importConfig,
                },
            ];
        });

        watch(currentTab, (tab) => {
            nextTick(() => $bus.$emit('editors:refresh'));

            $memory.settings.set('tab', tab);
        });

        watch(alert, () => {
            if (alertTimeout.value) {
                clearTimeout(alertTimeout.value);
            }

            if (alert.value) {
                alertTimeout.value = setTimeout(() => (alert.value = null), 10 * 1000);
            }
        });

        onMounted(() => {
            loadTemplates();
            restoreTabsFromStorage();
        });

        $bus.$on('alert', (variant, message) => (alert.value = { variant, message }));

        return {
            fileOptions,
            saveAsTemplate,
            removeTemplate,
            newFromTemplate,
            tabs,
            addTab,
            exportTab,
            removeTab,
            currentTab,
            canAddNewTab,
            setCurrentTab,
            alert,
            alertTimeout,
            updateTabName,
            showingTemplatesModal,
            showingPreferencesModal,
            templates: restorableTemplates,
        };
    },
};
</script>

<style lang="postcss">
html,
body,
#__nuxt,
#__layout {
    @apply h-full;
}

.tooltip {
    display: block !important;
    z-index: 10000;
}

.tooltip .tooltip-inner {
    @apply rounded-xl bg-ui-gray-100 text-ui-gray-900 py-2 px-4 shadow-lg text-sm;
}

.tooltip .tooltip-arrow {
    @apply border-ui-gray-100 w-0 h-0 border-solid absolute;
    margin: 5px;
    z-index: 1;
}

.tooltip[x-placement^='top'] {
    margin-bottom: 5px;
}

.tooltip[x-placement^='top'] .tooltip-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^='bottom'] {
    margin-top: 5px;
}

.tooltip[x-placement^='bottom'] .tooltip-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^='right'] {
    margin-left: 5px;
}

.tooltip[x-placement^='right'] .tooltip-arrow {
    border-width: 5px 5px 5px 0;
    border-left-color: transparent !important;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip[x-placement^='left'] {
    margin-right: 5px;
}

.tooltip[x-placement^='left'] .tooltip-arrow {
    border-width: 5px 0 5px 5px;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip[aria-hidden='true'] {
    @apply transition-opacity;
    visibility: hidden;
    opacity: 0;
}

.tooltip[aria-hidden='false'] {
    @apply transition-opacity;
    visibility: visible;
    opacity: 1;
}
</style>
