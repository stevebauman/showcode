import { storeToRefs } from 'pinia';
import useSettingsStore from './useSettingsStore';
import { nextTick, useContext, watch } from 'vue';

export default function () {
    const { $bus } = useNuxtApp();

    const settings = useSettingsStore();

    const { tab: currentTab } = storeToRefs(settings);

    const setTabFromProject = (project) => {
        if (project) {
            currentTab.value = project.tab.id;
        }
    };

    const projectIsActive = (project) => settings.tab === project.tab.id;

    watch(currentTab, () => nextTick(() => $bus.$emit('editors:refresh')));

    return { currentTab, setTabFromProject, projectIsActive };
}
