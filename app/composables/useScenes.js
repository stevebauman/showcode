import { cloneDeep } from 'lodash';
import scenes, { SCENE_NONE } from '~/data/scenes';

export default function () {
    function findScene(id) {
        return scenes.find((scene) => scene.id === id) ?? scenes[0];
    }

    function applyScene(settings, id) {
        const scene = findScene(id);
        const headerSettings = {
            showHeader: settings.showHeader,
            showTitle: settings.showTitle,
            showMenu: settings.showMenu,
            showColorMenu: settings.showColorMenu,
            showHeaderAccent: settings.showHeaderAccent,
        };

        Object.assign(settings, cloneDeep(scene.settings));
        Object.assign(settings, headerSettings);
    }

    return {
        scenes,
        findScene,
        applyScene,
        SCENE_NONE,
    };
}
