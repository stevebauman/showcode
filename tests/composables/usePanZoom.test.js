import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import usePanZoom from '~/composables/usePanZoom';

const { panzoomFactory } = vi.hoisted(() => ({
    panzoomFactory: vi.fn(),
}));

vi.mock('@panzoom/panzoom', () => ({
    default: panzoomFactory,
}));

describe('usePanZoom', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        panzoomFactory.mockReset();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.useRealTimers();
    });

    it('snaps both axes to the resting position when released nearby', async () => {
        let position = { x: 7, y: -141 };
        const pan = vi.fn((x, y) => (position = { x, y }));

        panzoomFactory.mockReturnValue({
            destroy: vi.fn(),
            getPan: () => position,
            getScale: () => 1,
            pan,
            reset: vi.fn(),
            zoom: vi.fn(),
        });

        const viewport = { x: 7, y: -141, zoom: 1 };
        const element = document.createElement('div');
        document.body.append(element);
        const { createPanZoom } = usePanZoom(viewport, {
            startY: -150,
            centerSnapThreshold: 12,
        });

        createPanZoom(element);
        element.dispatchEvent(new CustomEvent('panzoomend'));

        expect(pan).toHaveBeenCalledWith(0, -150, {
            animate: true,
            duration: 160,
            easing: 'ease-out',
        });

        await vi.advanceTimersByTimeAsync(300);

        expect(viewport).toEqual({ x: 0, y: -150, zoom: 1 });
    });

    it('snaps each axis independently', async () => {
        let position = { x: -10, y: 42 };
        const pan = vi.fn((x, y) => (position = { x, y }));

        panzoomFactory.mockReturnValue({
            destroy: vi.fn(),
            getPan: () => position,
            getScale: () => 1,
            pan,
            reset: vi.fn(),
            zoom: vi.fn(),
        });

        const viewport = { x: -10, y: 42, zoom: 1 };
        const element = document.createElement('div');
        document.body.append(element);
        const { createPanZoom } = usePanZoom(viewport, {
            startY: -150,
            centerSnapThreshold: 12,
        });

        createPanZoom(element);
        element.dispatchEvent(new CustomEvent('panzoomend'));

        expect(pan).toHaveBeenCalledWith(0, 42, {
            animate: true,
            duration: 160,
            easing: 'ease-out',
        });

        await vi.advanceTimersByTimeAsync(300);

        expect(viewport).toEqual({ x: 0, y: 42, zoom: 1 });
    });

    it('keeps movement free outside the snap threshold', async () => {
        const position = { x: 13, y: -136 };
        const pan = vi.fn();

        panzoomFactory.mockReturnValue({
            destroy: vi.fn(),
            getPan: () => position,
            getScale: () => 1,
            pan,
            reset: vi.fn(),
            zoom: vi.fn(),
        });

        const viewport = { x: 0, y: -150, zoom: 1 };
        const element = document.createElement('div');
        document.body.append(element);
        const { createPanZoom } = usePanZoom(viewport, {
            startY: -150,
            centerSnapThreshold: 12,
        });

        createPanZoom(element);
        element.dispatchEvent(new CustomEvent('panzoomend'));

        expect(pan).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(300);

        expect(viewport).toEqual({ x: 13, y: -136, zoom: 1 });
    });

    it('shows center guides only while dragging near their axes', () => {
        const position = { x: 20, y: -120 };

        panzoomFactory.mockReturnValue({
            destroy: vi.fn(),
            getPan: () => position,
            getScale: () => 1,
            pan: vi.fn(),
            reset: vi.fn(),
            zoom: vi.fn(),
        });

        const viewport = { x: 20, y: -120, zoom: 1 };
        const element = document.createElement('div');
        document.body.append(element);
        const { centerGuides, createPanZoom } = usePanZoom(viewport, {
            startY: -150,
            centerSnapThreshold: 12,
            centerGuideThreshold: 24,
        });

        createPanZoom(element);
        element.dispatchEvent(
            new CustomEvent('panzoompan', {
                detail: { x: 20, y: -120, scale: 1 },
            })
        );

        expect(centerGuides).toEqual({ x: false, y: false });

        element.dispatchEvent(new CustomEvent('panzoomstart'));
        element.dispatchEvent(
            new CustomEvent('panzoompan', {
                detail: { x: 20, y: -120, scale: 1 },
            })
        );

        expect(centerGuides).toEqual({ x: true, y: false });

        element.dispatchEvent(
            new CustomEvent('panzoompan', {
                detail: { x: 30, y: -130, scale: 1 },
            })
        );

        expect(centerGuides).toEqual({ x: false, y: true });

        element.dispatchEvent(new CustomEvent('panzoomend'));

        expect(centerGuides).toEqual({ x: false, y: false });
    });

    it('uses screen pixels for the snap threshold at different zoom levels', () => {
        let position = { x: 20, y: 0 };
        const pan = vi.fn((x, y) => (position = { x, y }));

        panzoomFactory.mockReturnValue({
            destroy: vi.fn(),
            getPan: () => position,
            getScale: () => 0.5,
            pan,
            reset: vi.fn(),
            zoom: vi.fn(),
        });

        const viewport = { x: 20, y: 0, zoom: 0.5 };
        const element = document.createElement('div');
        document.body.append(element);
        const { createPanZoom } = usePanZoom(viewport, {
            centerSnapThreshold: 12,
        });

        createPanZoom(element);
        element.dispatchEvent(new CustomEvent('panzoomend'));

        expect(pan).toHaveBeenCalledWith(0, 0, {
            animate: true,
            duration: 160,
            easing: 'ease-out',
        });
    });
});
