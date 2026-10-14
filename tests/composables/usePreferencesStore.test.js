import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, disposePinia } from 'pinia';
import usePreferencesStore, {
    defaultAspectRatios,
    defaults,
} from '~/composables/usePreferencesStore';

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

    it('restores built-in aspect ratios after adding one on a fresh profile', () => {
        const pinia = createPinia();
        const preferences = usePreferencesStore(pinia);

        try {
            preferences.addAspectRatio([21, 9]);
            preferences.resetAspectRatios();

            expect(preferences.previewAspectRatios).toEqual([
                [16, 9],
                [4, 3],
                [1, 1],
            ]);
            expect(defaultAspectRatios).toEqual([
                [16, 9],
                [4, 3],
                [1, 1],
            ]);
        } finally {
            disposePinia(pinia);
        }
    });

    it('keeps default arrays detached after resetting all preferences', () => {
        const pinia = createPinia();
        const preferences = usePreferencesStore(pinia);
        vi.stubGlobal('confirm', () => true);

        try {
            preferences.reset();
            preferences.addAspectRatio([21, 9]);
            preferences.previewAspectRatios[0][0] = 32;

            expect(defaults.previewAspectRatios).toEqual([
                [16, 9],
                [4, 3],
                [1, 1],
            ]);
            preferences.resetAspectRatios();
            expect(preferences.previewAspectRatios).toEqual([
                [16, 9],
                [4, 3],
                [1, 1],
            ]);
        } finally {
            disposePinia(pinia);
            vi.unstubAllGlobals();
        }
    });

    it('keeps hydrated defaults detached when a stored preference is missing', () => {
        localStorage.setItem('preferences', JSON.stringify({ editorFontSize: 14 }));
        const pinia = createPinia();
        const preferences = usePreferencesStore(pinia);

        try {
            preferences.addAspectRatio([21, 9]);

            expect(defaultAspectRatios).toEqual([
                [16, 9],
                [4, 3],
                [1, 1],
            ]);
            expect(preferences.editorFontSize).toBe(14);
        } finally {
            disposePinia(pinia);
        }
    });
});
