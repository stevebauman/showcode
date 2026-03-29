import { describe, it, expect } from 'vitest';
import useAspectRatios from '~/composables/useAspectRatios';

describe('useAspectRatios', () => {
    it('returns the default aspect ratios', () => {
        const { aspectRatios } = useAspectRatios();

        expect(aspectRatios).toEqual([
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

