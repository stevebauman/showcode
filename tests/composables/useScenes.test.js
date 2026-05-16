import { describe, expect, it } from 'vitest';
import useScenes from '~/composables/useScenes';
import useSettings from '~/composables/useSettings';
import { SCENE_BROWSERBASE, SCENE_NONE } from '~/data/scenes';

describe('useScenes', () => {
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
        expect(settings.headerTitleColor).toEqual({
            red: 255,
            green: 255,
            blue: 255,
            alpha: 1,
        });

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
