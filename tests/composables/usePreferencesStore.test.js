import { describe, it, expect, beforeEach } from 'vitest';
import usePreferencesStore from '~/composables/usePreferencesStore';

describe('usePreferencesStore', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('adds aspect ratios', () => {
        const preferences = usePreferencesStore();
        preferences.previewAspectRatios = [];

        preferences.addAspectRatio([21, 9]);

        expect(preferences.previewAspectRatios).toEqual([[21, 9]]);
    });

    it('does not add duplicate aspect ratios', () => {
        const preferences = usePreferencesStore();
        preferences.previewAspectRatios = [[16, 9]];

        preferences.addAspectRatio([16, 9]);
        preferences.addAspectRatio(['16', '9']);

        expect(preferences.previewAspectRatios).toEqual([[16, 9]]);
    });
});
