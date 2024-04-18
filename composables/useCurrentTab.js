import { storeToRefs } from 'pinia';
import useSettingsStore from './useSettingsStore';
import { nextTick, useContext, watch } from '@nuxtjs/composition-api';

export default function () {
    const { $bus } = useContext();

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

    watch(currentTab, () => nextTick(() => $bus.$emit('editors:refresh')));

    return { currentTab, setTabFromProject, projectIsActive };
}
