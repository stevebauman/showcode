import { storeToRefs } from 'pinia';
import { nextTick, watch } from 'vue';
import useSettingsStore from './useSettingsStore';

export default function () {
    const { $bus } = useNuxtApp();

    const settings = useSettingsStore();

    const { tab: currentTab } = storeToRefs(settings);

    function setTabFromProject(project) {
        if (project) {
            currentTab.value = project.tab.id;
        }
    }

    function projectIsActive(project) {
        return settings.tab === project.tab.id;
    }

    watch(currentTab, () => nextTick(() => $bus.emit('editors:refresh')));

    return { currentTab, setTabFromProject, projectIsActive };
}
