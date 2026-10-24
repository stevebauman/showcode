import { afterEach, describe, expect, it, vi } from 'vitest';
import useClipboard from '~/composables/useClipboard';

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe('useClipboard', () => {
    it('waits for the clipboard write before reporting success', async () => {
        vi.useFakeTimers();
        let finish;
        const write = vi.fn(() => new Promise((resolve) => (finish = resolve)));
        vi.spyOn(navigator.clipboard, 'write').mockImplementation(write);
        vi.stubGlobal(
            'ClipboardItem',
            class {
                constructor(content) {
                    this.content = content;
                }
            }
        );
        const blob = new Blob(['image'], { type: 'image/png' });
        const { copy, copied } = useClipboard();

        const pending = copy(blob);

        expect(pending).toBeInstanceOf(Promise);
        expect(copied.value).toBe(false);
        expect(write.mock.calls[0][0][0].content).toEqual({ 'image/png': blob });

        finish();
        await pending;

        expect(copied.value).toBe(true);
        await vi.advanceTimersByTimeAsync(4000);
        expect(copied.value).toBe(false);
    });

    it('propagates clipboard errors without reporting success', async () => {
        vi.spyOn(navigator.clipboard, 'write').mockRejectedValue(new Error('Permission denied'));
        vi.stubGlobal('ClipboardItem', class {});
        const { copy, copied } = useClipboard();

        await expect(copy(new Blob(['image']))).rejects.toThrow('Permission denied');
        expect(copied.value).toBe(false);
    });

    it('passes a promised image to ClipboardItem for Safari', async () => {
        vi.useFakeTimers();
        const write = vi.spyOn(navigator.clipboard, 'write').mockResolvedValue();
        vi.stubGlobal(
            'ClipboardItem',
            class {
                constructor(content) {
                    this.content = content;
                }
            }
        );
        const image = Promise.resolve(new Blob(['image'], { type: 'image/png' }));
        const { copy, copied } = useClipboard();

        const pending = copy(image);

        expect(write).toHaveBeenCalledOnce();
        expect(write.mock.calls[0][0][0].content['image/png']).toBe(image);
        await pending;
        expect(copied.value).toBe(true);
    });
});
