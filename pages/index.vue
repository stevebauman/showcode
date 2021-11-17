<template>
    <div
        class="flex flex-col h-full overflow-hidden antialiased  bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
    >
        <div class="hidden lg:block">
            <div class="flex items-center h-full min-h-full">
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
            :key="tab.name"
            class="w-full h-full"
        />
    </div>
</template>

<script>
import { last, uniqueId } from 'lodash';
import { PlusIcon } from 'vue-feather-icons';
import Tab from '../components/Tab';
import Page from '../components/Page';

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
        this.newTab();
    },

    computed: {
        canRemoveTab() {
            return this.tabs.length > 1;
        },
    },

    methods: {
        newTab() {
            const previous = last(this.tabs);

            const tab = previous ? this.makeTab(previous.id + 1) : this.makeTab(1);

            this.tabs.push(tab);

            this.setCurrentTab(tab);
        },

        setCurrentTab(tab) {
            this.currentTab = tab.key;
        },

        removeTab(tab) {
            if (!this.canRemoveTab) {
                return;
            }

            const index = this.tabs.findIndex((existingTab) => existingTab.key === tab.key);

            if (index !== -1) {
                this.tabs.splice(index, 1);

                this.setCurrentTab(last(this.tabs));
            }
        },

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
