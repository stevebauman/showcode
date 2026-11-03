<template>
    <div v-if="!loading" class="flex h-full flex-col overflow-hidden antialiased">
        <DesktopTitlebar v-if="config.isDesktop && config.platform.windows" />

        <Hotkeys :shortcuts="['S', 'T']" @triggered="handleShortcut" />

        <ModalHelp v-model="showingHelpModal" />
        <ModalChangelog v-model="showingChangelogModal" :releases="availableReleases" />
        <ModalWhatsNew
            v-if="whatsNewRelease"
            :model-value="showingWhatsNewModal"
            :release="whatsNewRelease"
            v-model:show-after-update="showReleaseNotesAfterUpdate"
            @dismiss="dismissWhatsNew"
            @changelog="openFullChangelog"
        />
        <ModalPreferences v-model="showingPreferencesModal" />
        <ModalSavedProjects
            v-model="showingSavedProjectsModal"
            :projects="savedProjects"
            @open="openSavedProject"
            @remove="removeSavedProject"
            @rename="renameSavedProject"
        />
        <ModalCloseProject
            v-if="!desktop"
            :project="projectPendingClose"
            @save="saveProjectPendingClose"
            @discard="discardProjectPendingClose"
            @cancel="cancelClosingProjects"
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

        <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
            <component
                :is="isMacDesktop ? DesktopTitlebar : 'div'"
                class="border-ui-line bg-ui-chrome flex shrink-0 items-center border-b"
            >
                <ScrollArea
                    ref="toolbarScrollArea"
                    orientation="horizontal"
                    force-vertical-scroll
                    class="flex min-w-0"
                    :class="isMacDesktop ? 'flex-initial' : 'flex-1'"
                    :style="isMacDesktop ? { '-webkit-app-region': 'no-drag' } : null"
                >
                    <div
                        ref="tabsContainer"
                        class="flex h-11 w-max items-center gap-2 pl-2"
                        :class="{ 'pr-2': !isMacDesktop }"
                    >
                        <FileDropdown v-if="!isMacDesktop" :options="fileOptions" />

                        <Draggable
                            v-model="projects"
                            @end="syncTabOrder"
                            :item-key="(project) => project.tab.id"
                            class="flex items-center gap-1"
                        >
                            <template #item="{ element: project, index }">
                                <Tab
                                    :key="project.tab.id"
                                    :name="project.tab.name"
                                    :starting="project.tab.kind === 'new'"
                                    :modified="project.modified"
                                    :data-tab-id="project.tab.id"
                                    :active="projectIsActive(project)"
                                    :can-close-others="projects.length > 1"
                                    :can-close-projects-to-left="index > 0"
                                    :can-close-projects-to-right="index < projects.length - 1"
                                    :can-reopen-closed-project="recentlyClosedProjects.length > 0"
                                    @close="() => closeProject(project)"
                                    @close-others="() => closeOtherProjects(project)"
                                    @close-projects-to-left="() => closeProjectsToLeft(project)"
                                    @close-projects-to-right="() => closeProjectsToRight(project)"
                                    @reopen-closed="reopenClosedProject"
                                    @navigate="() => setTabFromProject(project)"
                                    @duplicate="() => duplicateProject(project)"
                                    @rename="() => startRenamingProject(project)"
                                    @save="() => saveProject(project)"
                                    @save-as="() => saveProjectAs(project)"
                                />
                            </template>
                        </Draggable>

                        <button
                            v-if="!isMacDesktop"
                            type="button"
                            aria-label="New Project"
                            v-tooltip="'New tab'"
                            @click="() => addNewProject()"
                            class="ui-navbar-button"
                        >
                            <PlusIcon class="size-4.5" />
                        </button>
                    </div>
                </ScrollArea>

                <button
                    v-if="isMacDesktop"
                    type="button"
                    aria-label="New Project"
                    title="New Project"
                    style="-webkit-app-region: no-drag"
                    class="ui-navbar-button"
                    @click="() => addNewProject()"
                >
                    <PlusIcon class="size-3.5" />
                </button>

                <DownloadDesktopAppLink
                    v-if="!config.isDesktop"
                    href="/download"
                    :viewport="toolbarViewport"
                    :tabs-container="tabsContainer"
                />
                <DesktopAppUpdateButton
                    v-else
                    :viewport="toolbarViewport"
                    :tabs-container="tabsContainer"
                    style="-webkit-app-region: no-drag"
                />
            </component>

            <div class="bg-ui-canvas min-h-0 flex-1 overflow-hidden">
                <template v-for="(project, index) in projects" :key="project.tab.id">
                    <NewTab
                        v-if="projectIsActive(project) && project.tab.kind === 'new'"
                        class="size-full"
                        :templates="templates"
                        @start="startProjectFromScratch(project)"
                        @template="(template) => startProjectFromTemplate(project, template)"
                        @manage-templates="showingTemplatesModal = true"
                    />

                    <KeepAlive>
                        <Page
                            v-if="projectIsActive(project) && project.tab.kind === 'project'"
                            ref="activePage"
                            class="size-full"
                            :project="project"
                            :key="project.tab.id"
                            :data-project-id="project.tab.id"
                            @update:touched="project.$patch({ modified: true })"
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
import { usePreferredColorScheme, useResizeObserver } from '@vueuse/core';
import useCurrentTab from '@/composables/useCurrentTab';
import useProjectStores from '@/composables/useProjectStores';
import useTemplateStore from '@/composables/useTemplateStore';
import useSavedProjectStore from '@/composables/useSavedProjectStore';
import useMetaThemeColor from '@/composables/useMetaThemeColor';
import useDesktop from '@/composables/useDesktop';
import useConfirm from '@/composables/useConfirm';
import useWhatsNew from '@/composables/useWhatsNew';
import { colorMode, initColorMode } from '@/composables/useApplicationStore';
import { toast } from 'vue-sonner';
import { Toaster } from '@/components/ui/sonner';
import { PlusIcon } from 'lucide-vue-next';
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import DesktopTitlebar from '@/components/DesktopTitlebar.vue';

initColorMode();

const config = useRuntimeConfig().public;
const isMacDesktop = config.isDesktop && config.platform.darwin;
const desktop = useDesktop();
const confirmAction = useConfirm();
const {
    open: showingWhatsNewModal,
    release: whatsNewRelease,
    availableReleases,
    showAfterUpdate: showReleaseNotesAfterUpdate,
    initialize: initializeWhatsNew,
    show: showWhatsNew,
    dismiss: dismissWhatsNew,
} = useWhatsNew();

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
    reopenClosedProject,
    recentlyClosedProjects,
    duplicateProject,
    currentProject,
    importNewProject,
    hydrateFromStorage,
    findProjectByTabId,
    startProjectFromScratch,
    startProjectFromTemplate,
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
const projectsPendingClose = ref([]);
const projectPendingRename = ref(null);

const toolbarScrollArea = ref(null);
const tabsContainer = ref(null);
const activePage = ref(null);

const toolbarViewport = computed(
    () => toolbarScrollArea.value?.$el?.querySelector?.('[data-reka-scroll-area-viewport]') ?? null
);

function revealActiveTab() {
    tabsContainer.value
        ?.querySelector('[data-project-tab][data-active="true"]')
        ?.closest('[data-tab-id]')
        ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

watch([currentTab, () => projects.value.length, toolbarViewport], revealActiveTab, {
    flush: 'post',
});
useResizeObserver(toolbarViewport, revealActiveTab);

const projectRenameDialog = computed(() => {
    if (projectPendingRename.value?.type === 'template') {
        return {
            title: 'Rename Template',
            description: 'Update the name of this saved template.',
            action: 'Rename',
        };
    }

    if (projectPendingRename.value?.intent === 'save-as') {
        return {
            title: 'Save As',
            description: 'Choose a name for this saved project copy.',
            action: 'Save',
        };
    }

    if (projectPendingRename.value?.intent === 'save') {
        return {
            title: 'Save Project',
            description: 'Choose a name for this project before saving it.',
            action: 'Save',
        };
    }

    return {
        title: 'Rename Project',
        description: 'Update the project name shown in tabs and saved projects.',
        action: 'Rename',
    };
});

const appTitle = computed(() => {
    if (!currentProject.value) {
        return 'Showcode';
    }

    const name =
        currentProject.value.tab.kind === 'new'
            ? 'New Project'
            : currentProject.value.tab.name || 'Untitled Project';

    const dirty = currentProject.value.modified ? ' *' : '';

    return `${name}${dirty} - Showcode`;
});

useHead({
    title: appTitle,
    titleTemplate: '%s',
});

const newProjectFromTemplate = (template) => {
    addProjectFromTemplate(template);

    showingTemplatesModal.value = false;
};

const openSavedProject = (project) => {
    savedProjects.touch(project);
    addProjectFromSavedProject(project);

    showingSavedProjectsModal.value = false;
};

async function captureProjectThumbnail(project = currentProject.value) {
    await nextTick();

    if (project && projectIsActive(project)) {
        const page = Array.isArray(activePage.value) ? activePage.value[0] : activePage.value;

        await page?.captureThumbnail();

        await nextTick();
    }
}

const saveProject = async (project = currentProject.value) => {
    if (!project) {
        return toast.error('There was a problem locating the current project.');
    }

    await captureProjectThumbnail(project);

    const savedProject = savedProjects.save(project);

    toast.success(`Saved "${savedProject.tab.name}".`);

    return savedProject;
};

const saveProjectAs = async (project = currentProject.value) => {
    if (!project) {
        return toast.error('There was a problem locating the current project.');
    }

    await captureProjectThumbnail(project);

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

    await captureProjectThumbnail(currentProject.value);

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
    if (project.modified) {
        projectPendingClose.value = project;

        return;
    }

    deleteProject(project);
};

const closeProjects = async (projectsToClose) => {
    const uniqueProjects = projectsToClose.filter(
        (project, index, projects) =>
            projects.findIndex(({ tab }) => tab.id === project.tab.id) === index
    );

    const modifiedProjects = uniqueProjects.filter((project) => project.modified);

    uniqueProjects
        .filter((project) => !project.modified)
        .forEach((project) => deleteProject(project));

    projectsPendingClose.value = modifiedProjects.slice(1);
    projectPendingClose.value = head(modifiedProjects) ?? null;
};

const closeOtherProjects = (project) => {
    closeProjects(projects.value.filter(({ tab }) => tab.id !== project.tab.id));
};

const closeProjectsToLeft = (project) => {
    const index = projects.value.findIndex(({ tab }) => tab.id === project.tab.id);

    if (index === -1) {
        return;
    }

    closeProjects(projects.value.slice(0, index));
};

const closeProjectsToRight = (project) => {
    const index = projects.value.findIndex(({ tab }) => tab.id === project.tab.id);

    if (index === -1) {
        return;
    }

    closeProjects(projects.value.slice(index + 1));
};

const continueClosingProjects = () => {
    projectPendingClose.value = projectsPendingClose.value.shift() ?? null;
};

const cancelClosingProjects = () => {
    projectPendingClose.value = null;
    projectsPendingClose.value = [];
};

const saveProjectPendingClose = async () => {
    const project = projectPendingClose.value;

    if (!project) {
        return;
    }

    await saveProject(project);
    deleteProject(project);

    continueClosingProjects();
};

const discardProjectPendingClose = () => {
    const project = projectPendingClose.value;

    if (!project) {
        return;
    }

    deleteProject(project);

    continueClosingProjects();
};

const removeSavedProject = async (project) => {
    if (await confirmAction('Delete this saved project?')) {
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

    if (pending.type === 'template') {
        templates.rename(pending.project, name);
    } else if (pending.type === 'saved') {
        savedProjects.rename(pending.project, name);
    } else {
        pending.project.$patch((state) => (state.tab.name = name));
    }

    toast.success(`${pending.type === 'template' ? 'Template' : 'Project'} renamed to "${name}".`);

    projectPendingRename.value = null;

    if (pending.intent === 'save') {
        saveProject(pending.project);
    }
};

const removeTemplate = async (template) => {
    if (await confirmAction('Delete this template?')) {
        templates.remove(template);
    }
};

const saveAsTemplate = async () => {
    const project = currentProject.value;

    if (!project) {
        return toast.error('There was a problem locating the current project.');
    }

    await captureProjectThumbnail(project);

    project.saveAsTemplate();

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
    projectPendingRename.value = { project: template, type: 'template' };
};

async function exportConfiguration(forApi = false) {
    const project = currentProject.value;

    await captureProjectThumbnail(project);

    return forApi ? project?.exportForApi() : project?.export();
}

async function openFullChangelog() {
    if (showingWhatsNewModal.value) await dismissWhatsNew();
    showingChangelogModal.value = true;
}

const fileOptions = computed(() => {
    const recentProjects = savedProjects.recent();

    const isNewTab = currentProject.value?.tab.kind === 'new';

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
            disabled: isNewTab,
            click: saveCurrentProject,
        },
        {
            name: 'save-project-as',
            title: 'Save As...',
            disabled: isNewTab,
            click: () => saveProjectAs(currentProject.value),
        },
        {
            name: 'save-as-template',
            title: 'Save As Template',
            disabled: isNewTab,
            click: saveAsTemplate,
        },
        {
            name: 'open-saved-projects-modal',
            title: 'Open...',
            click: () => (showingSavedProjectsModal.value = true),
        },
        ...(recentProjects.length
            ? [
                  {
                      name: 'recent-projects-label',
                      title: 'Recent Projects',
                      children: recentProjects.map((project) => ({
                          name: `open-recent-${project.tab.id}`,
                          title: project.tab.name || 'Untitled Project',
                          click: () => openSavedProject(project),
                      })),
                  },
              ]
            : []),
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
            disabled: isNewTab,
            click: () => exportConfiguration(true),
        },
        {
            name: 'export-config',
            title: 'Export JSON Configuration',
            disabled: isNewTab,
            click: () => exportConfiguration(),
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
            title: "What's New",
            click: () => {
                if (!showWhatsNew()) showingChangelogModal.value = true;
            },
        },
        {
            name: 'changelog',
            title: 'Changelog',
            click: openFullChangelog,
        },
    ];
});

async function handleDesktopCommand(_event, command) {
    try {
        const option = fileOptions.value
            .flatMap((option) => option.children ?? [option])
            .find((option) => option.name === command);

        if (option?.click) {
            await option.click();

            return;
        }

        if (command === 'new-project') {
            addNewProject();

            return;
        }

        if (command === 'close-project') {
            await closeProject(currentProject.value);

            return;
        }

        if (command === 'reopen-closed-project') {
            reopenClosedProject();

            return;
        }

        if (['next-project', 'previous-project'].includes(command)) {
            const index = projects.value.indexOf(currentProject.value);
            const offset = command === 'next-project' ? 1 : -1;

            setTabFromProject(
                projects.value[(index + offset + projects.value.length) % projects.value.length]
            );

            return;
        }

        await captureProjectThumbnail();

        const page = Array.isArray(activePage.value) ? activePage.value[0] : activePage.value;

        if (command === 'copy-image') {
            await page?.copyImage();

            return;
        }

        const method = { 'export-png': 'toPng', 'export-jpg': 'toJpeg', 'export-svg': 'toSvg' }[
            command
        ];

        if (method) await page?.exportImage(method);
    } catch (error) {
        toast.error(error.message);
    }
}

watch(projectPendingClose, async (project) => {
    if (!desktop || !project) return;

    const action = await desktop.invoke('confirm-close-project', project.tab.name);

    if (action === 'save') await saveProjectPendingClose();
    if (action === 'discard') discardProjectPendingClose();
    if (action === 'cancel') cancelClosingProjects();
});

onBeforeUnmount(() => desktop?.removeListener('desktop-command', handleDesktopCommand));

onMounted(async () => {
    hydrateFromStorage();

    const hasExistingProjects = projects.value.length > 0;

    loading.value = false;

    if (!projects.value.length) {
        addNewProject();
    }

    if (!findProjectByTabId(currentTab.value)) {
        setTabFromProject(head(projects.value));
    }

    if (desktop) {
        desktop.addListener('desktop-command', handleDesktopCommand);

        watch(
            () => ({
                hasProject: currentProject.value?.tab.kind === 'project',
                modified: Boolean(currentProject.value?.modified),
                canReopen: recentlyClosedProjects.value.length > 0,
                canSwitch: projects.value.length > 1,
                recentProjects: savedProjects.recent().map(({ tab }) => ({
                    id: tab.id,
                    name: tab.name,
                })),
            }),
            (state) => desktop.send('set-menu-state', state),
            { immediate: true, deep: true }
        );

        watch(colorMode, (theme) => desktop.send('set-window-appearance', theme), {
            immediate: true,
        });
    }

    watch(colorScheme, (scheme) => (colorMode.value = scheme));
    watch(colorMode, () => nextTick(updateMetaThemeColor), { immediate: true });

    await nextTick();
    await initializeWhatsNew(hasExistingProjects);
});
</script>

<style>
@reference '~/assets/css/app.css';

html,
body,
#__nuxt,
#__layout {
    @apply bg-ui-chrome text-ui-text h-full;
}

html.dark,
.dark,
.dark body,
.dark #__nuxt,
.dark #__layout {
    @apply bg-ui-chrome text-ui-text;
}

.v-popper--theme-tooltip .v-popper__inner {
    @apply rounded-control px-2 py-1 text-[10px] leading-tight font-medium shadow-sm;
}

.v-popper--theme-tooltip .v-popper__arrow-outer {
    border-color: var(--ui-popup-surface);
}

.v-popper--theme-tooltip .v-popper__arrow-inner {
    @apply hidden;
}

.v-popper--theme-dropdown .v-popper__inner,
.v-popper--theme-tooltip .v-popper__inner {
    border: 1px solid var(--ui-line);
    background: var(--ui-popup-surface);
    -webkit-backdrop-filter: var(--ui-popup-filter);
    backdrop-filter: var(--ui-popup-filter);
    color: var(--ui-text);
    box-shadow: var(--ui-shadow);
}

.v-popper--theme-dropdown .v-popper__inner {
    border-radius: var(--radius-popup);
}

.v-popper--theme-dropdown .v-popper__arrow-container {
    display: none;
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
    @apply absolute transition-colors duration-100 content-[''];
    background: var(--ui-line);
}

.gutter:hover::before,
.gutter:active::before {
    background: var(--ui-muted);
}

.gutter.gutter-horizontal {
    cursor: col-resize;
}

.gutter.gutter-horizontal::before {
    @apply inset-y-0 w-px;
    left: 50%;
    transform: translateX(-50%);
}

.gutter.gutter-vertical {
    cursor: row-resize;
}

.gutter.gutter-vertical::before {
    @apply inset-x-0 h-px;
    top: 50%;
    transform: translateY(-50%);
}
</style>
