<template>
    <div
        class="flex flex-col h-full antialiased  bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
    >
        <div class="hidden lg:block">
            <div class="flex items-center h-8 min-h-full overflow-x-scroll">
                <Tab
                    v-for="tab in tabs"
                    :key="tab.key"
                    :active="currentTab === tab.key"
                    @navigate="() => setCurrentTab(tab)"
                    @close="() => removeTab(tab)"
                >
                    {{ tab.name }}
                </Tab>

                <button
                    @click="newTab"
                    class="flex items-center h-full px-4 py-1 space-x-4 text-gray-400 bg-gray-700  hover:text-gray-300 hover:bg-gray-900"
                >
                    <PlusIcon class="w-6 h-6" />
                </button>
            </div>
        </div>

        <Page
            v-for="tab in tabs"
            v-show="currentTab === tab.key"
            :visible="currentTab === tab.key"
            :key="tab.name"
            :tab="tab"
            class="w-full h-full"
        />
    </div>
</template>

<script>
import Tab from '../components/Tab';
import Page from '../components/Page';
import { head, last, uniqueId } from 'lodash';
import { PlusIcon } from 'vue-feather-icons';

export default {
    head: { title: 'Beautiful code screenshots' },

    components: { Tab, Page, PlusIcon },

    data() {
        return {
            tabs: [],
            currentTab: null,
        };
    },

    created() {
        const tabs = Object.keys(this.$settings.all());

        tabs.length > 0
            ? tabs.forEach((id) => this.restoreTab(this.$settings.get(id).tab))
            : this.newTab();

        this.setCurrentTab(head(this.tabs));
    },

    computed: {
        canRemoveTab() {
            return this.tabs.length > 1;
        },
    },

    methods: {
        /**
         * Make a new tab.
         */
        newTab() {
            const previous = last(this.tabs);

            const tab = previous ? this.makeTab(previous.id + 1) : this.makeTab(1);

            this.tabs.push(tab);

            this.setCurrentTab(tab);
        },

        /**
         * Restore a tab from settings.
         */
        restoreTab(tab) {
            // Push a new key into the tab to make sure it's unique in the DOM.
            tab.key = uniqueId('tab-');

            this.tabs.push(tab);
        },

        /**
         * Set the current tab.
         *
         * @param {Object} tab
         */
        setCurrentTab(tab) {
            this.currentTab = tab.key;
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

            const index = this.tabs.findIndex((existingTab) => existingTab.key === tab.key);

            if (index !== -1) {
                this.$settings.remove(this.tabs[index].id);

                this.tabs.splice(index, 1);

                this.setCurrentTab(last(this.tabs));
            }
        },

        /**
         * Make a new tab.
         *
         * @param {Number} id
         */
        makeTab(id) {
            return {
                id,
                key: uniqueId('tab-'),
                name: `Project - ${id}`,
            };
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
