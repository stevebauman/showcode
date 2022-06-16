<template>
    <div class="flex flex-col h-full overflow-hidden antialiased">
        <Hotkeys v-if="$config.isDesktop" :shortcuts="['T']" @triggered="() => addNewProject()" />

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
                    v-model="projects"
                    @end="syncTabOrder"
                    class="flex w-full h-full overflow-x-auto divide-x scrollbar-hide divide-ui-gray-800"
                >
                    <Tab
                        v-for="(project, index) in projects"
                        :dusk="`tab-${index}`"
                        :key="project.tab.id"
                        :name="project.tab.name"
                        :data-tab-id="project.tab.id"
                        :active="projectIsActive(project)"
                        @close="() => deleteProject(project, index)"
                        @navigate="() => setTabFromProject(project)"
                        @update:name="(name) => project.$patch((state) => (state.tab.name = name))"
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
                    <template #default="{ mode }">
                        <MoonIcon v-if="mode === 'dark'" />
                        <SunIcon v-else />
                    </template>
                </ToggleDarkMode>
            </div>
        </div>

        <template v-for="(project, index) in projects">
            <keep-alive :key="project.tab.id">
                <Page
                    v-if="projectIsActive(project)"
                    :dusk="`page-${index}`"
                    :project="project"
                    :key="project.tab.id"
                    :data-project-id="project.tab.id"
                    class="w-full h-full"
                    @update:page="(page) => project.$patch({ page: page })"
                    @update:settings="(settings) => project.$patch({ settings: settings })"
                />
            </keep-alive>
        </template>
    </div>
</template>

<script>
import { head } from 'lodash';
import { storeToRefs } from 'pinia';
import Draggable from 'vuedraggable';
import { usePreferredColorScheme } from '@vueuse/core';
import useCurrentTab from '@/composables/useCurrentTab';
import useProjectStores from '@/composables/useProjectStores';
import useTemplateStore from '@/composables/useTemplateStore';
import useApplicationStore from '@/composables/useApplicationStore';
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

        const colorScheme = usePreferredColorScheme();

        const { colorMode } = storeToRefs(useApplicationStore());

        watch(colorScheme, (scheme) => (colorMode.value = scheme));

        const {
            projects,
            syncTabOrder,
            addNewProject,
            deleteProject,
            currentProject,
            importNewProject,
            canAddNewProject,
            canAddNewTemplate,
            hydrateFromStorage,
            findProjectByTabId,
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
            if (confirm('Delete this template?')) {
                templates.remove(template);
            }
        };

        const saveAsTemplate = () => {
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

        hydrateFromStorage();

        onMounted(() => {
            if (!projects.value.length) {
                addNewProject();
            }

            if (!findProjectByTabId(currentTab.value)) {
                setTabFromProject(head(projects.value));
            }
        });

        $bus.$on('alert', (variant, message) => (alert.value = { variant, message }));

        return {
            alert,
            alertTimeout,
            syncTabOrder,
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
    @apply rounded-xl bg-ui-gray-600 text-ui-gray-100 py-1 px-2.5 shadow-lg text-xs;
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

.bg-pattern {
    background-position: 0.5% 0;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.25' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.bg-overlay {
    box-shadow: rgba(#e5e7eb, 0.5) 0px 0px 0px 99999px;
}

html[color-scheme='dark'] .bg-overlay {
    box-shadow: rgba(#1f2937, 0.5) 0px 0px 0px 99999px;
}

.bg-grid {
    background-size: 24px 24px;
    background-image: repeating-linear-gradient(
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px,
            transparent 100%
        ),
        repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px,
            transparent 100%
        );
}

.gutter {
    @apply bg-ui-gray-700 hover:bg-ui-gray-800;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    @apply cursor-resize-width;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}

.gutter.gutter-vertical {
    @apply cursor-resize-height;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}
</style>
