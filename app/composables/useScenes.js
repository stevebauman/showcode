import { cloneDeep, pick } from 'lodash';
import scenes, { SCENE_NONE } from '~/data/scenes';
import useSettings from '~/composables/useSettings';

const SCENE_CONTROLLED_SETTING_KEYS = [
    'scene',
    'background',
    'backgroundColor',
    'themeName',
    'themeOpacity',
    'position',
    'width',
    'height',
    'aspectRatio',
    'lockWindowSize',
    'lockWindowPaddingX',
    'lockWindowPaddingY',
    'scale',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'showHeader',
    'showHeaderAccent',
    'showTitle',
    'showMenu',
    'showColorMenu',
    'showBorder',
    'showShadow',
    'borderRadius',
    'borderRadiusLocked',
    'borderRadiusTopLeft',
    'borderRadiusTopRight',
    'borderRadiusBottomRight',
    'borderRadiusBottomLeft',
    'borderWidth',
    'borderColor',
    'padding',
    'paddingLocked',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
];

export default function () {
    const { settingsDefaults } = useSettings();
    let previousSceneSettings = null;

    function findScene(id) {
        return scenes.find((scene) => scene.id === id) ?? scenes[0];
    }

    function cloneSceneControlledSettings(settings) {
        return pick(cloneDeep(settings), SCENE_CONTROLLED_SETTING_KEYS);
    }

    function defaultSceneSettings() {
        return pick(cloneDeep(settingsDefaults), SCENE_CONTROLLED_SETTING_KEYS);
    }

    function applyScene(settings, id) {
        const scene = findScene(id);

        if (scene.id === SCENE_NONE) {
            if ((!settings.scene || settings.scene === SCENE_NONE) && !previousSceneSettings) {
                settings.scene = SCENE_NONE;

                return;
            }

            Object.assign(settings, previousSceneSettings ?? defaultSceneSettings(), {
                scene: SCENE_NONE,
            });

            previousSceneSettings = null;

            return;
        }

        if (!settings.scene || settings.scene === SCENE_NONE) {
            previousSceneSettings = cloneSceneControlledSettings(settings);
        }

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
