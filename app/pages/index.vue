<template>
    <div v-if="!loading" class="flex h-full flex-col overflow-hidden antialiased">
        <DesktopTitlebar
            v-if="config.isDesktop && (config.platform.darwin || config.platform.windows)"
        />

        <Hotkeys :shortcuts="['S', 'T']" @triggered="handleShortcut" />

        <ModalHelp v-model="showingHelpModal" />
        <ModalChangelog v-model="showingChangelogModal" />
        <ModalPreferences v-model="showingPreferencesModal" />
        <ModalSavedProjects
            v-model="showingSavedProjectsModal"
            :projects="savedProjects"
            @open="openSavedProject"
            @remove="removeSavedProject"
            @rename="renameSavedProject"
        />
        <ModalCloseProject
            :project="projectPendingClose"
            @save="saveProjectPendingClose"
            @discard="discardProjectPendingClose"
            @cancel="projectPendingClose = null"
        />
        <ModalRenameProject
            :project="projectPendingRename?.project"
            :title="projectRenameDialog.title"
            :description="projectRenameDialog.description"
            :action="projectRenameDialog.action"
            @rename="renameProject"
            @cancel="projectPendingRename = null"
        />

        <ModalTemplates
            v-model="showingTemplatesModal"
            :templates="templates"
            @save="saveAsTemplate"
            @remove="removeTemplate"
            @rename="renameTemplate"
            @restore="newProjectFromTemplate"
            @setDefault="setTemplateAsDefault"
            @clearDefault="clearTemplateAsDefault"
        />

        <Toaster />

        <div
            class="m-1 flex flex-1 flex-col overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-800"
        >
            <div
                class="flex items-center rounded-t-lg border-b border-zinc-200 bg-zinc-100/60 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60"
            >
                <ScrollArea
                    ref="toolbarScrollArea"
                    orientation="horizontal"
                    force-vertical-scroll
                    class="flex h-full min-w-0 flex-1"
                >
                    <div ref="tabsContainer" class="flex h-full w-max items-center gap-0.5 p-1">
                        <FileDropdown :options="fileOptions" />

                        <Draggable
                            v-model="projects"
                            @end="syncTabOrder"
                            item-key="tab.id"
                            class="flex items-center gap-0.5"
                        >
                            <template #item="{ element: project, index }">
                                <Tab
                                    :key="project.tab.id"
                                    :name="project.tab.name"
                                    :modified="project.modified"
                                    :data-tab-id="project.tab.id"
                                    :active="projectIsActive(project)"
                                    @close="() => closeProject(project)"
                                    @navigate="() => setTabFromProject(project)"
                                    @duplicate="() => duplicateProject(project)"
                                    @rename="() => startRenamingProject(project)"
                                    @save="() => saveProject(project)"
                                    @save-as="() => saveProjectAs(project)"
                                />
                            </template>
                        </Draggable>

                        <button
                            @click="() => addNewProject()"
                            class="flex h-8 items-center rounded-lg px-2 text-zinc-400 transition-colors hover:bg-zinc-200/50 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
                        >
                            <PlusIcon class="size-3.5" />
                        </button>
                    </div>
                </ScrollArea>

                <DownloadDesktopAppLink
                    v-if="!config.isDesktop"
                    href="/download"
                    :viewport="toolbarViewport"
                    :tabs-container="tabsContainer"
                />
            </div>

            <div class="flex-1 overflow-hidden rounded-b-lg bg-zinc-100 p-1 dark:bg-zinc-900">
                <template v-for="(project, index) in projects" :key="project.tab.id">
                    <KeepAlive>
                        <Page
                            v-if="projectIsActive(project)"
                            ref="activePage"
                            class="size-full"
                            :project="project"
                            :key="project.tab.id"
                            :data-project-id="project.tab.id"
                            @update:page="project.$patch({ page: $event })"
                            @update:touched="project.$patch({ modified: true })"
                            @update:settings="project.$patch({ settings: $event })"
                        />
                    </KeepAlive>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { head } from 'lodash';
import Draggable from 'vuedraggable';
import { usePreferredColorScheme } from '@vueuse/core';
import useCurrentTab from '@/composables/useCurrentTab';
import useProjectStores from '@/composables/useProjectStores';
import useTemplateStore from '@/composables/useTemplateStore';
import useSavedProjectStore from '@/composables/useSavedProjectStore';
import useMetaThemeColor from '@/composables/useMetaThemeColor';
import { colorMode, initColorMode } from '@/composables/useApplicationStore';
import { toast } from 'vue-sonner';
import { Toaster } from '@/components/ui/sonner';
import { PlusIcon } from 'lucide-vue-next';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

initColorMode();

const config = useRuntimeConfig().public;

const templates = useTemplateStore();
const savedProjects = useSavedProjectStore();

const { update: updateMetaThemeColor } = useMetaThemeColor();

const { setTabFromProject, projectIsActive, currentTab } = useCurrentTab();

const colorScheme = usePreferredColorScheme();

const {
    projects,
    syncTabOrder,
    addNewProject,
    deleteProject,
    duplicateProject,
    currentProject,
    importNewProject,
    hydrateFromStorage,
    findProjectByTabId,
    addProjectFromTemplate,
    addProjectFromSavedProject,
} = useProjectStores();

const loading = ref(true);
const showingHelpModal = ref(false);
const showingChangelogModal = ref(false);
const showingTemplatesModal = ref(false);
const showingPreferencesModal = ref(false);
const showingSavedProjectsModal = ref(false);
const projectPendingClose = ref(null);
const projectPendingRename = ref(null);

const toolbarScrollArea = ref(null);
const tabsContainer = ref(null);
const activePage = ref(null);

const toolbarViewport = computed(
    () => toolbarScrollArea.value?.$el?.querySelector?.('[data-reka-scroll-area-viewport]') ?? null
);

const projectRenameDialog = computed(() => {
    if (projectPendingRename.value?.intent === 'save-as') {
        return {
            title: 'Save As',
            description: 'Choose a name for this saved project copy.',
            action: 'Save',
        };
    }

    return {
        title: 'Rename project',
        description: 'Update the project name shown in tabs and saved projects.',
        action: 'Rename',
    };
});

const newProjectFromTemplate = (template) => {
    addProjectFromTemplate(template);

    showingTemplatesModal.value = false;
};

const openSavedProject = (project) => {
    addProjectFromSavedProject(project);

    showingSavedProjectsModal.value = false;
};

async function flushProjectState(project = currentProject.value) {
    await nextTick();

    if (project && projectIsActive(project)) {
        const page = Array.isArray(activePage.value) ? activePage.value[0] : activePage.value;

        await page?.flushProjectState?.();

        await nextTick();
    }
}

const saveProject = async (project = currentProject.value) => {
    if (!project) {
        return toast.error('There was a problem locating the current project.');
    }

    await flushProjectState(project);

    const savedProject = savedProjects.save(project);

    toast.success(`Saved "${savedProject.tab.name}".`);

    return savedProject;
};

const saveProjectAs = async (project = currentProject.value) => {
    if (!project) {
        return toast.error('There was a problem locating the current project.');
    }

    await flushProjectState(project);

    projectPendingRename.value = {
        project,
        type: 'tab',
        intent: 'save-as',
    };
};

const saveProjectAsWithName = async (project, name) => {
    const savedProject = savedProjects.save(project, { force: true, name });

    toast.success(`Saved "${savedProject.tab.name}".`);

    return savedProject;
};

const saveCurrentProject = async () => {
    if (!currentProject.value) {
        return toast.error('There was a problem locating the current project.');
    }

    await flushProjectState(currentProject.value);

    if (!currentProject.value.tab.name) {
        projectPendingRename.value = {
            project: currentProject.value,
            type: 'tab',
            intent: 'save',
        };

        return;
    }

    return saveProject(currentProject.value);
};

const handleShortcut = ({ keyString }) => {
    if (keyString === 'T') {
        return addNewProject();
    }

    if (keyString === 'S') {
        return saveCurrentProject();
    }
};

const closeProject = async (project) => {
    await flushProjectState(project);

    if (project.modified) {
        projectPendingClose.value = project;

        return;
    }

    deleteProject(project);
};

const saveProjectPendingClose = async () => {
    const project = projectPendingClose.value;

    if (!project) {
        return;
    }

    await saveProject(project);
    deleteProject(project);

    projectPendingClose.value = null;
};

const discardProjectPendingClose = () => {
    const project = projectPendingClose.value;

    if (!project) {
        return;
    }

    deleteProject(project);

    projectPendingClose.value = null;
};

const removeSavedProject = (project) => {
    if (confirm('Delete this saved project?')) {
        savedProjects.remove(project);
    }
};

const renameSavedProject = (project) => {
    projectPendingRename.value = { project, type: 'saved' };
};

const startRenamingProject = (project) => {
    projectPendingRename.value = { project, type: 'tab' };
};

const renameProject = (name) => {
    const pending = projectPendingRename.value;

    if (!pending) {
        return;
    }

    if (pending.intent === 'save-as') {
        projectPendingRename.value = null;

        saveProjectAsWithName(pending.project, name);

        return;
    }

    if (pending.type === 'saved') {
        savedProjects.rename(pending.project, name);
    } else {
        pending.project.$patch((state) => (state.tab.name = name));
    }

    toast.success(`Project renamed to "${name}".`);

    projectPendingRename.value = null;

    if (pending.intent === 'save') {
        saveProject(pending.project);
    }
};

const removeTemplate = (template) => {
    if (confirm('Delete this template?')) {
        templates.remove(template);
    }
};

const saveAsTemplate = () => {
    if (!currentProject.value) {
        return toast.error('There was a problem locating the current project.');
    }

    currentProject.value.saveAsTemplate();

    toast.success('Successfully saved template.');
};

const setTemplateAsDefault = (template) => {
    templates.setAsDefault(template);

    toast.success(`"${template.tab.name}" is now the default template.`);
};

const clearTemplateAsDefault = (template) => {
    templates.clearAsDefault();

    toast.success(`"${template.tab.name}" is no longer the default template.`);
};

const renameTemplate = (template) => {
    const newName = prompt('Enter new template name:', template.tab.name);

    if (newName && newName.trim() && newName.trim() !== template.tab.name) {
        templates.rename(template, newName.trim());

        toast.success(`Template renamed to "${newName.trim()}".`);
    }
};

const fileOptions = computed(() => {
    return [
        {
            name: 'preferences',
            title: 'Preferences...',
            click: () => (showingPreferencesModal.value = true),
        },
        {
            separator: true,
        },
        {
            name: 'save-project',
            title: 'Save',
            click: saveCurrentProject,
        },
        {
            name: 'save-project-as',
            title: 'Save As...',
            click: () => saveProjectAs(currentProject.value),
        },
        {
            name: 'save-as-template',
            title: 'Save As Template',
            click: saveAsTemplate,
        },
        {
            name: 'open-saved-projects-modal',
            title: 'Open...',
            click: () => (showingSavedProjectsModal.value = true),
        },
        {
            name: 'open-templates-modal',
            title: 'Open Saved Templates...',
            click: () => (showingTemplatesModal.value = true),
        },
        {
            separator: true,
        },
        {
            name: 'export-json',
            title: 'Export JSON (API Request)',
            click: () => currentProject.value?.exportForApi(),
        },
        {
            name: 'export-config',
            title: 'Export JSON Configuration',
            click: () => currentProject.value?.export(),
        },
        {
            name: 'import-config',
            title: 'Import JSON Configuration...',
            click: importNewProject,
        },
        {
            separator: true,
        },
        {
            name: 'api-docs',
            title: 'View API Docs',
            href: 'https://api.showcode.app/docs',
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

onMounted(() => {
    hydrateFromStorage();

    loading.value = false;

    if (!projects.value.length) {
        addNewProject();
    }

    if (!findProjectByTabId(currentTab.value)) {
        setTabFromProject(head(projects.value));
    }

    watch(colorScheme, (scheme) => (colorMode.value = scheme));
    watch(colorMode, () => nextTick(updateMetaThemeColor), { immediate: true });
});
</script>

<style>
@reference '~/assets/css/app.css';

html,
body,
#__nuxt,
#__layout {
    @apply h-full bg-zinc-200 text-zinc-950;
}

html.dark,
.dark,
.dark body,
.dark #__nuxt,
.dark #__layout {
    @apply bg-zinc-950 text-zinc-50;
}

.v-popper--theme-tooltip .v-popper__inner {
    @apply rounded-md bg-zinc-900 px-2 py-1 text-[10px] leading-tight font-medium text-zinc-100 shadow-sm;
}

.dark .v-popper--theme-tooltip .v-popper__inner {
    @apply bg-zinc-100 text-zinc-900;
}

.v-popper--theme-tooltip .v-popper__arrow-outer {
    @apply border-zinc-900;
}

.dark .v-popper--theme-tooltip .v-popper__arrow-outer {
    @apply border-zinc-100;
}

.v-popper--theme-tooltip .v-popper__arrow-inner {
    @apply hidden;
}

.v-popper--theme-dropdown .v-popper__inner {
    @apply overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 shadow-xl;
}

.dark .v-popper--theme-dropdown .v-popper__inner {
    @apply border-zinc-800 bg-zinc-900;
}

.v-popper--theme-dropdown .v-popper__arrow-outer {
    @apply border-zinc-200;
}

.dark .v-popper--theme-dropdown .v-popper__arrow-outer {
    @apply border-zinc-800;
}

.v-popper--theme-dropdown .v-popper__arrow-inner {
    @apply hidden;
}

.bg-pattern {
    background-position: 0.5% 0;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.bg-overlay {
    box-shadow-sm: rgba(#e5e7eb, 0.5) 0px 0px 0px 99999px;
}

.dark .bg-overlay {
    box-shadow-sm: rgba(#1f2937, 0.5) 0px 0px 0px 99999px;
}

.bg-grid {
    background-size: 24px 24px;
    background-image:
        repeating-linear-gradient(
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
    @apply relative shrink-0 bg-transparent transition-colors duration-100;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
}

.gutter::before {
    @apply absolute rounded-full bg-zinc-300/60 opacity-0 transition-opacity duration-100 content-[''];
}

.dark .gutter::before {
    @apply bg-zinc-700/70;
}

.gutter:hover::before {
    @apply bg-zinc-400/80 opacity-100;
}

.dark .gutter:hover::before {
    @apply bg-zinc-600/80;
}

.gutter:active::before {
    @apply bg-zinc-500 opacity-100;
}

.dark .gutter:active::before {
    @apply bg-zinc-500;
}

.gutter.gutter-horizontal {
    cursor: col-resize;
}

.gutter.gutter-horizontal::before {
    @apply top-1.5 bottom-1.5 w-px;
    left: 50%;
    transform: translateX(-50%);
}

.gutter.gutter-vertical {
    cursor: row-resize;
}

.gutter.gutter-vertical::before {
    @apply right-1.5 left-1.5 h-px;
    top: 50%;
    transform: translateY(-50%);
}
</style>
