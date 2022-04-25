import { v4 as uuid } from 'uuid';
import { head, last, orderBy, sortBy } from 'lodash';
import { useContext, ref, computed, watch } from '@nuxtjs/composition-api';

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

    const updateTab = async (tabToUpdate, data) => {
        const tab = findTab(tabToUpdate);

        if (!tab) {
            return;
        }

        Object.assign(tab, data);

        await $memory.pages.sync(tab.id, (record) => record.set('tab', tab));
    };

    const updateTabName = async (tab, name) => {
        await updateTab(tab, { name });
    };

    const updateTabOrder = async (tabs) => {
        return Promise.all(tabs.map(async (tab, index) => await updateTab(tab, { order: index })));
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

        tabs.value = sortBy(tabs.value, (tab) => tab.order ?? tab.created_at);

        const previous = await $memory.settings.value('tab');

        if (tabs.value.length === 0) {
            addTab();
        }

        setCurrentTab(findTab(previous) ?? head(tabs.value));
    };

    watch(tabs, (values) => updateTabOrder(values));

    const canAddNewTab = computed(() => $config.isDesktop || tabs.value.length < 2);

    return {
        tabs,
        addTab,
        makeTab,
        findTab,
        removeTab,
        exportTab,
        currentTab,
        canAddNewTab,
        updateTabName,
        setCurrentTab,
        updateTabOrder,
        restoreTabsFromStorage,
    };
}
