<template>
    <div
        class="flex flex-col h-full overflow-hidden antialiased  bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
    >
        <div class="hidden lg:block">
            <div class="flex items-center h-full min-h-full">
                <FileDropdown text="File" :options="fileOptions" />

                <div class="flex h-full overflow-x-scroll">
                    <Tab
                        v-for="tab in tabs"
                        :key="tab.id"
                        :name="tab.name"
                        :active="currentTab === tab.id"
                        @change-name="(name) => updateTabName(tab, name)"
                        @navigate="() => setCurrentTab(tab)"
                        @close="() => removeTab(tab)"
                    />
                </div>

                <button
                    @click="() => addTab()"
                    class="flex items-center h-full px-4 py-1 space-x-4 text-gray-400 bg-gray-700  hover:text-gray-300 hover:bg-gray-900"
                >
                    <PlusIcon class="w-6 h-6" />
                </button>
            </div>
        </div>

        <Page
            v-for="tab in tabs"
            v-show="currentTab === tab.id"
            :tab="tab"
            :key="tab.id"
            :visible="currentTab === tab.id"
            class="w-full h-full"
        />

        <Modal v-model="showingTemplatesModal">
            <h1 class="text-lg font-semibold text-gray-50">Saved Templates</h1>
            <h2 class="mb-2 text-sm font-medium text-gray-400">
                Click a template to start a new project from it.
            </h2>

            <div class="space-y-4">
                <div
                    v-for="{ template, restore, remove } in templates"
                    :key="template.key"
                    class="flex items-stretch justify-between overflow-hidden border border-gray-600 rounded-lg "
                >
                    <a
                        href="#"
                        @click.prevent="() => restore(template)"
                        class="flex flex-col w-full px-4 py-2 text-gray-100  hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                    >
                        <div class="mb-1 text-sm font-semibold">{{ template.get('tab.name') }}</div>
                        <div class="text-xs text-gray-200">
                            {{ new Date(template.get('tab.created_at')).toLocaleString() }}
                        </div>
                    </a>

                    <a
                        href="#"
                        @click.prevent="() => remove(template)"
                        class="inline-flex items-center justify-center px-4 py-2 text-gray-300  hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                    >
                        <XIcon class="w-5 h-5" />
                    </a>
                </div>

                <div
                    v-if="templates && templates.length === 0"
                    class="p-4 text-sm text-center text-gray-300 border border-gray-600 rounded-lg"
                >
                    <em>No saved templates.</em>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import download from 'downloadjs';
import { v4 as uuid } from 'uuid';
import { has, head, last } from 'lodash';
import { fileDialog } from 'file-select-dialog';
import { XIcon, PlusIcon } from 'vue-feather-icons';
import Tab from '../components/Tab';
import Page from '../components/Page';
import Modal from '../components/Modal';
import FileDropdown from '../components/FileDropdown';

export default {
    head: { title: 'Beautiful code screenshots' },

    components: { Tab, Page, Modal, FileDropdown, XIcon, PlusIcon },

    data() {
        return {
            tabs: [],
            currentTab: null,
            showingTemplatesModal: false,
        };
    },

    async created() {
        const tabs = await this.$memory.pages.keys();

        const stored = await Promise.all(tabs.map(async (id) => await this.$memory.pages.get(id)));

        stored.length > 0
            ? stored.map((record) => this.tabs.push(record.get('tab')))
            : this.addTab();

        const previous = await this.$memory.settings.get('tab');

        const tab = this.findTab(previous.all()) ?? head(this.tabs);

        this.setCurrentTab(tab);
    },

    watch: {
        currentTab(tab) {
            this.$memory.settings.set('tab', tab);
        },
    },

    computed: {
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
                created_at: new Date(),
                name: name ?? 'Untitled Project',
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
            await this.$memory.templates.remove(template.get('tab.id'));

            this.$asyncComputed.templates.update();
        },

        /**
         * Save the current tab as a template.
         */
        async saveAsTemplate() {
            const tab = { ...this.findTab(this.currentTab) };

            tab.created_at = new Date();

            const data = await this.exportTab(tab);

            await this.$memory.templates.set(tab.id, data.all());

            this.$asyncComputed.templates.update();

            alert('Successfully saved template.');
        },

        /**
         * Export the current tab as a configuration file.
         */
        async exportConfig() {
            const tab = { ...this.findTab(this.currentTab) };

            const data = await this.exportTab(tab);

            download(JSON.stringify(data.all(), null, 2), `${tab.name}.json`);
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
</style>
