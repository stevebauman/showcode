<template>
    <div class="flex flex-col h-full overflow-hidden antialiased">
        <ModalHelp dusk="modal-help" v-model="showingHelpModal" />
        <ModalChangelog dusk="modal-changelog" v-model="showingChangelogModal" />
        <ModalPreferences dusk="modal-preferences" v-model="showingPreferencesModal" />

        <ModalTemplates
            dusk="modal-templates"
            v-model="showingTemplatesModal"
            :templates="templates"
            @restore="newProjectFromTemplate"
            @remove="removeTemplate"
            @save="saveAsTemplate"
        />

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

        <DesktopTitlebar
            v-if="$config.isDesktop && ($config.platform.darwin || $config.platform.windows)"
        />

        <div dusk="navbar" class="items-center justify-between hidden w-full lg:flex">
            <div class="flex items-center justify-between w-full h-full">
                <FileDropdown
                    dusk="button-file"
                    text="File"
                    :options="fileOptions"
                    class="border-r border-ui-gray-800"
                />

                <Draggable
                    delay="100"
                    v-model="projects"
                    class="flex w-full h-full overflow-x-auto divide-x scrollbar-hide divide-ui-gray-800"
                >
                    <Tab
                        v-for="(project, index) in projects"
                        :dusk="`tab-${index}`"
                        :key="project.tab.id"
                        :name="project.tab.name"
                        :active="projectIsActive(project)"
                        @update:name="(name) => (project.tab.name = name)"
                        @navigate="() => setTabFromProject(project)"
                        @close="() => deleteProject(project, index)"
                    />

                    <div
                        v-tooltip.right="{
                            content: canAddNewProject
                                ? null
                                : 'Download the desktop app to unlock more tabs.',
                            delay: 200,
                        }"
                    >
                        <button
                            dusk="button-add-tab"
                            @click="() => addNewProject()"
                            :disabled="!canAddNewProject"
                            class="flex items-center h-full px-4 py-1 space-x-4 text-ui-gray-400 bg-ui-gray-700 hover:text-ui-gray-300 disabled:text-ui-gray-300 hover:bg-ui-gray-900 disabled:bg-ui-gray-900"
                        >
                            <PlusIcon class="w-4 h-4" />
                        </button>
                    </div>
                </Draggable>

                <ToggleDarkMode
                    dusk="button-toggle-dark"
                    class="p-0.5 mx-2 rounded-lg text-ui-violet-500 focus:outline-none focus:ring-2 focus:ring-ui-focus"
                >
                    <template #default="{ dark }">
                        <MoonIcon v-if="dark" />
                        <SunIcon v-else />
                    </template>
                </ToggleDarkMode>
            </div>
        </div>

        <template v-for="(project, index) in projects">
            <Page
                v-show="projectIsActive(project)"
                :dusk="`page-${index}`"
                :project="project"
                :key="project.tab.id"
                class="w-full h-full"
                @update:page="(page) => project.$patch({ page: page })"
                @update:settings="(settings) => project.$patch({ settings: settings })"
            />
        </template>
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import useCurrentTab from '../composables/useCurrentTab';
import useProjectStores from '../composables/useProjectStores';
import useTemplateStore from '../composables/useTemplateStore';
import { XIcon, PlusIcon, SunIcon, MoonIcon, ImageIcon } from 'vue-feather-icons';
import { computed, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api';

export default {
    components: {
        XIcon,
        SunIcon,
        MoonIcon,
        PlusIcon,
        ImageIcon,
        Draggable,
    },

    setup() {
        const { $bus } = useContext();

        const templates = useTemplateStore();

        const { setTabFromProject, projectIsActive, currentTab } = useCurrentTab();

        const {
            projects,
            addNewProject,
            deleteProject,
            currentProject,
            importNewProject,
            canAddNewProject,
            canAddNewTemplate,
            hydrateFromStorage,
            addProjectFromTemplate,
        } = useProjectStores();

        const alert = ref(null);
        const alertTimeout = ref(null);
        const showingHelpModal = ref(null);
        const showingChangelogModal = ref(false);
        const showingTemplatesModal = ref(false);
        const showingPreferencesModal = ref(false);

        const newProjectFromTemplate = (template) => {
            addProjectFromTemplate(template);

            showingTemplatesModal.value = false;
        };

        const removeTemplate = (template) => {
            if (confirm('Delete Template?')) {
                templates.remove(template);
            }
        };

        const saveAsTemplate = async () => {
            if (!canAddNewTemplate.value) {
                // prettier-ignore
                return $bus.$emit('alert', 'danger', 'Download the desktop app to unlock more templates.');
            }

            if (!currentProject.value) {
                // prettier-ignore
                return $bus.$emit('alert', 'danger', 'There was a problem locating the current project.');
            }

            currentProject.value.saveAsTemplate();

            $bus.$emit('alert', 'success', 'Successfully saved template.');
        };

        const fileOptions = computed(() => {
            return [
                {
                    name: 'preferences',
                    title: 'Preferences',
                    click: () => (showingPreferencesModal.value = true),
                },
                {
                    separator: true,
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
                    separator: true,
                },
                {
                    name: 'export-config',
                    title: 'Export Configuration',
                    click: () => currentProject.value?.export(),
                },
                {
                    name: 'import-config',
                    title: 'Import Configuration',
                    click: importNewProject,
                },
                {
                    separator: true,
                },
                {
                    name: 'help',
                    title: 'Help Guide',
                    click: () => (showingHelpModal.value = true),
                },
                {
                    name: 'updates',
                    title: 'Changelog',
                    click: () => (showingChangelogModal.value = true),
                },
            ];
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
            hydrateFromStorage();

            if (projects.value.length === 0) {
                addNewProject();
            }
        });

        $bus.$on('alert', (variant, message) => (alert.value = { variant, message }));

        return {
            projects,
            fileOptions,
            saveAsTemplate,
            addNewProject,
            removeTemplate,
            newProjectFromTemplate,
            canAddNewProject,
            currentTab,
            setTabFromProject,
            projectIsActive,
            deleteProject,
            alert,
            alertTimeout,
            templates,
            showingHelpModal,
            showingChangelogModal,
            showingTemplatesModal,
            showingPreferencesModal,
        };
    },
};
</script>

<style lang="postcss">
html,
body,
#__nuxt,
#__layout {
    @apply h-full bg-ui-gray-800;
}

.tooltip {
    display: block !important;
    z-index: 10000;
}

.tooltip .tooltip-inner {
    @apply rounded-xl bg-ui-gray-600 text-ui-gray-100 py-1 px-2.5 shadow text-xs;
}

.tooltip .tooltip-arrow {
    @apply hidden;
}

.tooltip[x-placement^='top'] {
    margin-bottom: 5px;
}

.tooltip[x-placement^='bottom'] {
    margin-top: 5px;
}

.tooltip[x-placement^='right'] {
    margin-left: 5px;
}

.tooltip[x-placement^='left'] {
    margin-right: 5px;
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
