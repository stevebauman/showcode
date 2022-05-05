import useAspectRatios from '@/composables/useAspectRatios';

describe('useAspectRatios', () => {
    it('calculates aspect ratio', () => {
        const { calculateAspectRatio } = useAspectRatios();

        const width = calculateAspectRatio([16, 9], 720);

        expect(width).toBe(1280);
    });
});
