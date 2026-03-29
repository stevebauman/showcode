<template>
    <div v-if="!loading" class="flex h-full flex-col overflow-hidden antialiased">
        <DesktopTitlebar
            v-if="config.isDesktop && (config.platform.darwin || config.platform.windows)"
        />

        <Hotkeys v-if="config.isDesktop" :shortcuts="['T']" @triggered="() => addNewProject()" />

        <ModalHelp v-model="showingHelpModal" />
        <ModalChangelog v-model="showingChangelogModal" />
        <ModalPreferences v-model="showingPreferencesModal" />

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
            class="m-1 hidden flex-1 flex-col overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-800 lg:flex"
        >
            <div
                class="flex items-center rounded-t-lg border-b border-zinc-200 bg-zinc-100/60 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60"
            >
                <ScrollArea
                    orientation="horizontal"
                    force-vertical-scroll
                    class="flex h-full w-full"
                >
                    <div class="flex h-full w-full items-center gap-0.5 p-1">
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
                                    @close="() => deleteProject(project)"
                                    @navigate="() => setTabFromProject(project)"
                                    @duplicate="() => duplicateProject(project)"
                                    @update:name="
                                        project.$patch((state) => (state.tab.name = $event))
                                    "
                                />
                            </template>
                        </Draggable>

                        <button
                            @click="() => addNewProject()"
                            class="flex h-7 items-center rounded-lg px-2 text-zinc-400 transition-colors hover:bg-zinc-200/50 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
                        >
                            <PlusIcon class="h-3.5 w-3.5" />
                        </button>
                    </div>
                </ScrollArea>
            </div>

            <div class="flex-1 overflow-hidden rounded-b-lg bg-zinc-100 p-1 dark:bg-zinc-900">
                <template v-for="(project, index) in projects" :key="project.tab.id">
                    <KeepAlive>
                        <Page
                            v-if="projectIsActive(project)"
                            class="h-full w-full"
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
import useMetaThemeColor from '@/composables/useMetaThemeColor';
import { colorMode, initColorMode } from '@/composables/useApplicationStore';
import { toast } from 'vue-sonner';
import { Toaster } from '@/components/ui/sonner';
import { PlusIcon } from 'lucide-vue-next';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

initColorMode();

const config = useRuntimeConfig().public;

const templates = useTemplateStore();

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
} = useProjectStores();

const loading = ref(true);
const showingHelpModal = ref(false);
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
            title: 'Import JSON Configuration',
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
html,
body,
#__nuxt,
#__layout {
    @apply h-full bg-zinc-200 text-zinc-950;
}

.dark,
.dark body,
.dark #__nuxt,
.dark #__layout {
    @apply bg-zinc-950 text-zinc-50;
}

.v-popper--theme-tooltip .v-popper__inner {
    @apply rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium leading-tight text-zinc-100 shadow;
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
    box-shadow: rgba(#e5e7eb, 0.5) 0px 0px 0px 99999px;
}

.dark .bg-overlay {
    box-shadow: rgba(#1f2937, 0.5) 0px 0px 0px 99999px;
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
    @apply rounded-full bg-transparent hover:bg-zinc-300 hover:transition-colors hover:delay-200 active:bg-violet-500;
    background-repeat: no-repeat;
    background-position: 50%;
}

.dark .gutter {
    @apply hover:bg-zinc-700 active:bg-violet-500;
}

.gutter.gutter-horizontal {
    @apply cursor-resize-width;
}

.gutter.gutter-vertical {
    @apply cursor-resize-height;
}
</style>
