import { v4 as uuid } from 'uuid';
import { head, last } from 'lodash';
import { useContext, ref, computed } from '@nuxtjs/composition-api';

export default function () {
    const { $memory, $config } = useContext();

    const tabs = ref([]);
    const currentTab = ref(null);

    const setCurrentTab = (tab) => (currentTab.value = typeof tab === 'object' ? tab.id : tab);

    const makeTab = (name = null) => ({
        id: uuid(),
        name: name,
        created_at: new Date(),
    });

    const findTab = (tab) => {
        if (!tab) {
            return;
        }

        const key = typeof tab === 'object' ? tab.id : tab;

        const index = tabs.value.findIndex((existingTab) => existingTab.id === key);

        return tabs.value[index] ?? null;
    };

    const addTab = (tab = null) => {
        if (!canAddNewTab.value) {
            return;
        }

        const newTab = tab ?? makeTab();

        tabs.value.push(newTab);

        setCurrentTab(newTab);
    };

    const removeTab = (tab) => {
        const index = tabs.value.findIndex((existingTab) => existingTab.id === tab.id);

        if (index !== -1) {
            $memory.pages.remove(tabs.value[index].id);

            tabs.value.splice(index, 1);

            setCurrentTab(last(tabs.value));
        }

        if (tabs.value.length === 0) {
            addTab();
        }
    };

    const exportTab = async (tab) => {
        const page = await $memory.pages.get(tab.id);

        tab.id = uuid();

        page.set('tab', tab);

        return page;
    };

    const updateTabName = async (tabToUpdate, name) => {
        const tab = findTab(tabToUpdate);

        tab.name = name;

        await $memory.pages.sync(tab.id, (record) => record.set('tab', tab));
    };

    const restoreTabsFromStorage = async () => {
        const storedTabs = await $memory.pages.keys();

        const stored = await Promise.all(
            storedTabs.map(async (id) => ({
                id: id,
                record: await $memory.pages.get(id),
            }))
        );

        stored.forEach(async ({ id, record }) => {
            record.has('tab') ? tabs.value.push(record.get('tab')) : await $memory.pages.remove(id);
        });

        const previous = await $memory.settings.value('tab');

        if (tabs.value.length === 0) {
            addTab();
        }

        setCurrentTab(findTab(previous) ?? head(tabs.value));
    };

    const canAddNewTab = computed(() => $config.isDesktop || tabs.value.length < 2);

    const sortedTabs = computed(() =>
        tabs.value.sort((aTab, bTab) => new Date(aTab.created_at) - new Date(bTab.created_at))
    );

    return {
        addTab,
        makeTab,
        findTab,
        removeTab,
        exportTab,
        updateTabName,
        canAddNewTab,
        setCurrentTab,
        restoreTabsFromStorage,
        currentTab,
        tabs: sortedTabs,
    };
}
