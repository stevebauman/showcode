import { describe, it, expect, beforeEach } from 'vitest';
import useBackgrounds, { DEFAULT_BACKGROUND } from '~/composables/useBackgrounds';
import useSettingsStore from '~/composables/useSettingsStore';

describe('useBackgrounds', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns the default backgrounds', () => {
        const { backgrounds } = useBackgrounds();

        expect(backgrounds.value.length).toBeGreaterThan(0);
        expect(backgrounds.value[0].id).toBe('transparent');
    });

    it('returns the default background', () => {
        const { defaultBackground } = useBackgrounds();

        expect(defaultBackground.value.id).toBe(DEFAULT_BACKGROUND);
    });

    it('gets background attrs by ID', () => {
        const { getBackgroundAttrs } = useBackgrounds();

        const attrs = getBackgroundAttrs('transparent');

        expect(attrs).toHaveProperty('style');
        expect(attrs).not.toHaveProperty('id');
    });

    it('falls back to default background when ID is not found', () => {
        const { getBackgroundAttrs, defaultBackground } = useBackgrounds();

        const attrs = getBackgroundAttrs('non-existent');
        const { id, ...expectedAttrs } = defaultBackground.value;

        expect(attrs).toEqual(expectedAttrs);
    });

    it('adds a custom background', () => {
        const { backgrounds, addCustomBackground } = useBackgrounds();

        const countBefore = backgrounds.value.length;

        addCustomBackground({ class: 'bg-red-500' });

        expect(backgrounds.value.length).toBe(countBefore + 1);
    });

    it('inserts custom backgrounds after transparent', () => {
        const { backgrounds, addCustomBackground } = useBackgrounds();

        const countBefore = backgrounds.value.length;

        const id = addCustomBackground({ class: 'bg-red-500' });

        expect(backgrounds.value[0].id).toBe('transparent');

        // Custom backgrounds are inserted right after transparent.
        const customIndex = backgrounds.value.findIndex((bg) => bg.id === id);

        expect(customIndex).toBeGreaterThan(0);
        expect(customIndex).toBeLessThan(countBefore);
    });

    it('deletes a custom background', () => {
        const { backgrounds, addCustomBackground, deleteCustomBackground } = useBackgrounds();

        const id = addCustomBackground({ class: 'bg-red-500' });
        const countAfterAdd = backgrounds.value.length;

        deleteCustomBackground(id);

        expect(backgrounds.value.length).toBe(countAfterAdd - 1);
        expect(backgrounds.value.find((bg) => bg.id === id)).toBeUndefined();
    });
});

