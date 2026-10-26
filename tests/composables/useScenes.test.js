import { describe, expect, it } from 'vitest';
import useScenes from '~/composables/useScenes';
import useSettings from '~/composables/useSettings';
import scenes, { SCENE_BROWSERBASE, SCENE_NONE } from '~/data/scenes';

describe('useScenes', () => {
    it.each([null, [4, 3]])(
        'preserves canvas sizing across scenes with aspect ratio %j',
        (aspectRatio) => {
            const sizing = {
                width: 1200,
                height: 900,
                aspectRatio,
                lockWindowSize: false,
                lockWindowPaddingX: 80,
                lockWindowPaddingY: 60,
            };
            const { settings } = useSettings(sizing);
            const { applyScene } = useScenes();

            for (const scene of scenes.filter((scene) => scene.id !== SCENE_NONE)) {
                applyScene(settings, scene.id);

                expect(settings.scene).toBe(scene.id);
                expect(settings).toMatchObject(sizing);
            }

            applyScene(settings, SCENE_NONE);

            expect(settings).toMatchObject(sizing);
        }
    );

    it('preserves sizing changes made while a scene is active when removing it', () => {
        const { settings } = useSettings({ width: 1200, height: 900, lockWindowSize: false });
        const { applyScene } = useScenes();

        applyScene(settings, SCENE_BROWSERBASE);

        const sizing = {
            width: 1500,
            height: 1000,
            aspectRatio: [3, 2],
            lockWindowSize: true,
            lockWindowPaddingX: 100,
            lockWindowPaddingY: 50,
        };
        Object.assign(settings, sizing);

        applyScene(settings, SCENE_NONE);

        expect(settings).toMatchObject(sizing);
    });

    it('preserves canvas sizing when removing a saved scene', () => {
        const sizing = {
            width: 1200,
            height: 900,
            aspectRatio: null,
            lockWindowSize: true,
            lockWindowPaddingX: 80,
            lockWindowPaddingY: 60,
        };
        const { settings } = useSettings({ ...sizing, scene: SCENE_BROWSERBASE });
        const { applyScene } = useScenes();

        applyScene(settings, SCENE_NONE);

        expect(settings).toMatchObject(sizing);
    });

    it('applies scene title colors without locking them to the scene afterward', () => {
        const { settings } = useSettings({
            showHeader: false,
            showTitle: false,
            showMenu: false,
            showColorMenu: false,
            headerTitleColor: {
                red: 12,
                green: 34,
                blue: 56,
                alpha: 1,
            },
        });
        const { applyScene } = useScenes();

        applyScene(settings, SCENE_BROWSERBASE);

        expect(settings.showHeader).toBe(false);
        expect(settings.showTitle).toBe(false);
        expect(settings.headerTitleColor).toBeNull();

        settings.headerTitleColor = {
            red: 20,
            green: 40,
            blue: 60,
            alpha: 0.8,
        };

        expect(settings.headerTitleColor).toEqual({
            red: 20,
            green: 40,
            blue: 60,
            alpha: 0.8,
        });

        applyScene(settings, SCENE_NONE);

        expect(settings.headerTitleColor).toEqual({
            red: 12,
            green: 34,
            blue: 56,
            alpha: 1,
        });
    });
});
