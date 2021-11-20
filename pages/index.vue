<template>
    <div
        class="flex flex-col h-full overflow-hidden antialiased  bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
    >
        <div class="hidden lg:block">
            <div class="flex items-center h-full min-h-full">
                <File
                    text="File"
                    class="z-50"
                    :options="fileOptions"
                    :templates="templateOptions"
                />

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
            :key="tab.id"
            :tab="tab"
            :visible="currentTab === tab.id"
            class="w-full h-full"
        />
    </div>
</template>

<script>
import { head, last } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from 'vue-feather-icons';
import Tab from '../components/Tab';
import Page from '../components/Page';
import File from '../components/FileDropdown';

export default {
    head: { title: 'Beautiful code screenshots' },

    components: { Tab, Page, File, PlusIcon },

    data() {
        return {
            tabs: [],
            currentTab: null,
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
        canRemoveTab() {
            return this.tabs.length > 1;
        },

        fileOptions() {
            return [
                {
                    name: 'save-as-template',
                    title: 'Save As Template',
                    click: this.saveAsTemplate,
                },
            ];
        },
    },

    asyncComputed: {
        async templateOptions() {
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
                id: uuidv4(),
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
            if (!this.canRemoveTab) {
                return;
            }

            const index = this.tabs.findIndex((existingTab) => existingTab.id === tab.id);

            if (index !== -1) {
                this.$memory.pages.remove(this.tabs[index].id);

                this.tabs.splice(index, 1);

                this.setCurrentTab(last(this.tabs));
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
        },

        /**
         * Remove a template from memory.
         *
         * @param {Object} template
         */
        async removeTemplate(template) {
            await this.$memory.templates.remove(template.get('tab.id'));

            this.$asyncComputed.templateOptions.update();
        },

        /**
         * Save the current tab as a template.
         */
        async saveAsTemplate() {
            const tab = { ...this.findTab(this.currentTab) };

            const page = await this.$memory.pages.get(tab.id);

            tab.id = uuidv4();

            page.set('tab', tab);

            await this.$memory.templates.set(tab.id, page.all());

            this.$asyncComputed.templateOptions.update();
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
