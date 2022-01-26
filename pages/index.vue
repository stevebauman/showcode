<template>
    <div
        class="flex flex-col h-full overflow-hidden antialiased bg-gradient-to-tl from-ui-gray-900 via-ui-gray-800 to-ui-gray-700"
    >
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
                        v-for="(tab, index) in sortedTabs"
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

        <Page
            v-for="tab in sortedTabs"
            v-show="currentTab === tab.id"
            dusk="page"
            class="w-full h-full"
            :tab="tab"
            :key="tab.id"
            :visible="currentTab === tab.id"
        />

        <Modal dusk="modal-templates" v-model="showingTemplatesModal">
            <div class="p-2 -mx-8 -mt-8 rounded-b-none bg-ui-gray-600 rounded-xl">
                <h1 class="font-semibold tracking-wide text-center uppercase text-ui-gray-300">
                    Saved Templates
                </h1>
            </div>

            <div class="grid grid-flow-row grid-cols-2 gap-4 mt-8 lg:grid-cols-3 xl:grid-cols-4">
                <div
                    v-for="{ template, restore, remove } in templates"
                    :key="template.key"
                    class="relative flex flex-col h-48 transition-shadow transition-transform transform cursor-pointer group hover:shadow-lg rounded-xl hover:-translate-y-1"
                >
                    <button
                        dusk="button-remove-template"
                        @click="() => remove(template)"
                        class="absolute top-0 right-0 flex items-center justify-center w-8 h-8 -m-3 transition duration-100 ease-in-out rounded-lg shadow bg-ui-gray-800 text-ui-gray-200 hover:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus focus:outline-none"
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
                    class="flex items-center justify-center h-48 transition-shadow transition-transform transform border-4 border-dashed cursor-pointer border-ui-gray-600 rounded-xl group hover:shadow-lg hover:-translate-y-1"
                >
                    <PlusIcon class="w-8 h-8 text-ui-gray-500" />
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
import download from 'downloadjs';
import { v4 as uuid } from 'uuid';
import { fileDialog } from 'file-select-dialog';
import { has, head, last, defaults } from 'lodash';
import { XIcon, PlusIcon, SunIcon, MoonIcon, ImageIcon } from 'vue-feather-icons';
import Tab from '../components/Tab';
import Page from '../components/Page';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import FileDropdown from '../components/FileDropdown';
import ToggleDarkMode from '../components/ToggleDarkMode';

export default {
    components: {
        Tab,
        Page,
        Modal,
        XIcon,
        Alert,
        PlusIcon,
        SunIcon,
        MoonIcon,
        ImageIcon,
        FileDropdown,
        ToggleDarkMode,
    },

    data() {
        return {
            tabs: [],
            alert: null,
            currentTab: null,
            showingTemplatesModal: false,
        };
    },

    created() {
        this.restoreTabsFromStorage();

        this.$nuxt.$on('alert', (variant, message) => (this.alert = { variant, message }));
    },

    watch: {
        currentTab(tab) {
            this.$nextTick(() => this.$nuxt.$emit('editors:refresh'));

            this.$memory.settings.set('tab', tab);
        },

        alert(alert) {
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
            }

            if (alert) {
                this.alertTimeout = setTimeout(() => (this.alert = null), 10 * 1000);
            }
        },
    },

    computed: {
        canAddNewTab() {
            return this.$config.isDesktop || this.tabs.length < 2;
        },

        canAddNewTemplate() {
            return this.$config.isDesktop || this.templates.length < 3;
        },

        sortedTabs() {
            return this.tabs.sort(
                (aTab, bTab) => new Date(aTab.created_at) - new Date(bTab.created_at)
            );
        },

        fileOptions() {
            return [
                {
                    name: 'save-as-template',
                    title: 'Save As Template',
                    click: this.saveAsTemplate,
                },
                {
                    name: 'open-templates-modal',
                    title: 'Open Saved Templates',
                    click: () => (this.showingTemplatesModal = true),
                },
                {
                    name: 'export-config',
                    title: 'Export Configuration',
                    click: this.exportConfig,
                },
                {
                    name: 'import-config',
                    title: 'Import Configuration',
                    click: this.importConfig,
                },
            ];
        },
    },

    asyncComputed: {
        async templates() {
            const templates = await this.$memory.templates.all();

            return templates
                .sort(
                    (aTemplate, bTemplate) =>
                        new Date(aTemplate.get('tab.created_at')) -
                        new Date(bTemplate.get('tab.created_at'))
                )
                .map((template) => ({
                    template: template,
                    restore: this.newFromTemplate,
                    remove: this.removeTemplate,
                }));
        },
    },

    methods: {
        /**
         * Make a new tab.
         *
         * @param {Object|null} tab
         */
        addTab(tab = null) {
            if (!this.canAddNewTab) {
                return;
            }

            const newTab = tab ?? this.makeTab();

            this.tabs.push(newTab);

            this.setCurrentTab(newTab);
        },

        /**
         * Make a new tab.
         *
         * @param {String|null} name
         */
        makeTab(name = null) {
            return {
                id: uuid(),
                name: name,
                created_at: new Date(),
            };
        },

        /**
         * Find a tab.
         *
         * @param {Object|String}
         *
         * @return {Object|null}
         */
        findTab(tab) {
            if (!tab) {
                return;
            }

            const key = typeof tab === 'object' ? tab.id : tab;

            const index = this.tabs.findIndex((existingTab) => existingTab.id === key);

            return this.tabs[index] ?? null;
        },

        /**
         * Set the current tab.
         *
         * @param {Object|String} tab
         */
        setCurrentTab(tab) {
            this.currentTab = typeof tab === 'object' ? tab.id : tab;
        },

        /**
         * Remove a tab.
         *
         * @param {Object} tab
         */
        removeTab(tab) {
            const index = this.tabs.findIndex((existingTab) => existingTab.id === tab.id);

            if (index !== -1) {
                this.$memory.pages.remove(this.tabs[index].id);

                this.tabs.splice(index, 1);

                this.setCurrentTab(last(this.tabs));
            }

            if (this.tabs.length === 0) {
                this.addTab();
            }
        },

        /**
         * Update the tab's name.
         *
         * @param {Object} tabToUpdate
         * @param {String} name
         */
        async updateTabName(tabToUpdate, name) {
            const tab = this.findTab(tabToUpdate);

            tab.name = name;

            await this.$memory.pages.sync(tab.id, (record) => record.set('tab', tab));
        },

        /**
         * Make a new tab from a template.
         *
         * @param {Object} template
         */
        async newFromTemplate(template) {
            const clone = template.clone();

            const newTab = this.makeTab(clone.get('tab.name'));

            clone.set('tab', newTab);

            this.$memory.pages.set(newTab.id, clone.all());

            this.addTab(newTab);

            this.showingTemplatesModal = false;
        },

        /**
         * Remove a template from memory.
         *
         * @param {Object} template
         */
        async removeTemplate(template) {
            if (confirm('Delete Template?')) {
                await this.$memory.templates.remove(template.get('tab.id'));

                this.$asyncComputed.templates.update();
            }
        },

        /**
         * Save the current tab as a template.
         */
        async saveAsTemplate() {
            if (!this.canAddNewTemplate) {
                return this.$nuxt.$emit(
                    'alert',
                    'danger',
                    'Download the desktop app to unlock more templates.'
                );
            }

            const tab = { ...this.findTab(this.currentTab) };

            tab.name = tab.name || 'Untitled Project';

            tab.created_at = new Date();

            const data = await this.exportTab(tab);

            await this.$memory.templates.set(tab.id, data.all());

            this.$asyncComputed.templates.update();

            this.$nuxt.$emit('alert', 'success', 'Successfully saved template.');
        },

        /**
         * Export the current tab as a configuration file.
         */
        async exportConfig() {
            const tab = { ...this.findTab(this.currentTab) };

            const data = await this.exportTab(tab);

            const name = tab.name || 'Untitled Project';

            const config = defaults(data.all(), { page: {}, settings: {} });

            download(JSON.stringify(config, null, 2), `${name}.json`);
        },

        /**
         * Import a configuration file into memory.
         */
        async importConfig() {
            const files = await fileDialog({ accept: '.json' });

            const file = head(files);

            if (!file) {
                return;
            }

            const data = await new Response(file).json();

            ['tab', 'page', 'settings'].forEach((requiredKey) => {
                if (!has(data, requiredKey)) {
                    alert('Error importing configuration. Required data is missing.');

                    throw new Error(
                        `The configuration file is missing the data key [${requiredKey}].`
                    );
                }
            });

            const config = this.$memory.pages.makeRecord(data.tab.id, data);

            const newTab = this.makeTab(config.get('tab.name'));

            config.set('tab', newTab);

            this.$memory.pages.set(newTab.id, config.all());

            this.addTab(newTab);
        },

        /**
         * Export the tab's data.
         *
         * @param {Object} tab
         *
         * @return {Object}
         */
        async exportTab(tab) {
            const page = await this.$memory.pages.get(tab.id);

            tab.id = uuid();

            page.set('tab', tab);

            return page;
        },

        /**
         * Restore the tabs from local storage.
         */
        async restoreTabsFromStorage() {
            const tabs = await this.$memory.pages.keys();

            const stored = await Promise.all(
                tabs.map(async (id) => ({
                    id: id,
                    record: await this.$memory.pages.get(id),
                }))
            );

            stored.forEach(async ({ id, record }) => {
                record.has('tab')
                    ? this.tabs.push(record.get('tab'))
                    : await this.$memory.pages.remove(id);
            });

            const previous = await this.$memory.settings.value('tab');

            if (this.tabs.length === 0) {
                this.addTab();
            }

            const tab = this.findTab(previous) ?? head(this.tabs);

            this.setCurrentTab(tab);
        },
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

@font-face {
    font-family: MonoLisa;
    src: url('/fonts/mono-lisa/MonoLisa-Regular.ttf');
}

@font-face {
    font-family: JetBrainsMono;
    src: url('/fonts/jetbrains-mono/JetBrainsMono-Regular.ttf');
}

:root {
    --color-ui-gray-50: theme('colors.gray.900');
    --color-ui-gray-100: theme('colors.gray.800');
    --color-ui-gray-200: theme('colors.gray.700');
    --color-ui-gray-300: theme('colors.gray.600');
    --color-ui-gray-400: theme('colors.gray.800');
    --color-ui-gray-500: theme('colors.gray.400');
    --color-ui-gray-600: theme('colors.gray.50');
    --color-ui-gray-700: theme('colors.gray.100');
    --color-ui-gray-800: theme('colors.gray.200');
    --color-ui-gray-900: theme('colors.white');

    --color-ui-violet-500: theme('colors.violet.800');
    --color-ui-violet-600: theme('colors.violet.700');
    --color-ui-violet-900: theme('colors.violet.600');
}

html[lights-out] {
    --color-ui-gray-50: theme('colors.gray.50');
    --color-ui-gray-100: theme('colors.gray.100');
    --color-ui-gray-200: theme('colors.gray.200');
    --color-ui-gray-300: theme('colors.gray.300');
    --color-ui-gray-400: theme('colors.gray.400');
    --color-ui-gray-500: theme('colors.gray.500');
    --color-ui-gray-600: theme('colors.gray.600');
    --color-ui-gray-700: theme('colors.gray.700');
    --color-ui-gray-800: theme('colors.gray.800');
    --color-ui-gray-900: theme('colors.gray.900');

    --color-ui-violet-500: theme('colors.violet.500');
    --color-ui-violet-600: theme('colors.violet.600');
    --color-ui-violet-900: theme('colors.violet.900');
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
