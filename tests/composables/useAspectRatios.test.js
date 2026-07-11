import { describe, it, expect, beforeEach } from 'vitest';
import useAspectRatios from '~/composables/useAspectRatios';
import usePreferencesStore from '~/composables/usePreferencesStore';

describe('useAspectRatios', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns the default aspect ratios', () => {
        const { aspectRatios } = useAspectRatios();

        expect(aspectRatios.value).toEqual([
            [16, 9],
            [4, 3],
            [1, 1],
        ]);
    });

    it('returns aspect ratios from preferences', () => {
        const preferences = usePreferencesStore();
        preferences.previewAspectRatios = [
            [21, 9],
            [5, 4],
        ];

        const { aspectRatios } = useAspectRatios();

        expect(aspectRatios.value).toEqual([
            [21, 9],
            [5, 4],
        ]);
    });

    it('can return no aspect ratios', () => {
        const preferences = usePreferencesStore();
        preferences.previewAspectRatios = [];

        const { aspectRatios } = useAspectRatios();

        expect(aspectRatios.value).toEqual([]);
    });

    it('ignores duplicate aspect ratios', () => {
        const preferences = usePreferencesStore();
        preferences.previewAspectRatios = [
            [16, 9],
            [21, 9],
            [21, 9],
        ];

        const { aspectRatios } = useAspectRatios();

        expect(aspectRatios.value).toEqual([
            [16, 9],
            [21, 9],
        ]);
    });

    it('ignores invalid aspect ratios', () => {
        const preferences = usePreferencesStore();
        preferences.previewAspectRatios = [
            [21, 9],
            [0, 9],
            [-1, 9],
            [4],
            ['wide', 9],
            null,
        ];

        const { aspectRatios } = useAspectRatios();

        expect(aspectRatios.value).toEqual([[21, 9]]);
    });

    it('resets aspect ratios to defaults', () => {
        const preferences = usePreferencesStore();
        preferences.previewAspectRatios = [[21, 9]];

        preferences.resetAspectRatios();

        expect(preferences.previewAspectRatios).toEqual([
            [16, 9],
            [4, 3],
            [1, 1],
        ]);
    });

    it('calculates 16:9 aspect ratio from height', () => {
        const { calculateAspectRatio } = useAspectRatios();

        expect(calculateAspectRatio([16, 9], 900)).toBe(1600);
        expect(calculateAspectRatio([16, 9], 450)).toBe(800);
    });

    it('calculates 4:3 aspect ratio from height', () => {
        const { calculateAspectRatio } = useAspectRatios();

        expect(calculateAspectRatio([4, 3], 300)).toBe(400);
        expect(calculateAspectRatio([4, 3], 600)).toBe(800);
    });

    it('calculates 1:1 aspect ratio from height', () => {
        const { calculateAspectRatio } = useAspectRatios();

        expect(calculateAspectRatio([1, 1], 500)).toBe(500);
    });
});
