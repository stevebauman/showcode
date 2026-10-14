import { afterEach, describe, expect, it, vi } from 'vitest';
import shikiPlugin from '~/plugins/shiki.client';

const OriginalWorker = globalThis.Worker;
afterEach(() => vi.stubGlobal('Worker', OriginalWorker));

describe('Shiki worker client', () => {
    it('matches concurrent replies to their requests', async () => {
        const worker = new EventTarget();
        worker.postMessage = vi.fn();
        vi.stubGlobal('Worker', function () {
            return worker;
        });
        const {
            provide: { shiki },
        } = shikiPlugin();
        worker.dispatchEvent(
            new MessageEvent('message', {
                data: { id: 1, result: { languages: ['php'], themes: ['github-dark'] } },
            })
        );
        await shiki.ready;
        expect(shiki.languages()).toEqual(['php']);
        const first = shiki.tokenizeBlocks({ theme: 'github-dark', blocks: [] });
        const second = shiki.tokenizeBlocks({ theme: 'github-light', blocks: [] });
        await Promise.resolve();
        worker.dispatchEvent(new MessageEvent('message', { data: { id: 3, result: 'light' } }));
        worker.dispatchEvent(new MessageEvent('message', { data: { id: 2, result: 'dark' } }));

        await expect(first).resolves.toBe('dark');
        await expect(second).resolves.toBe('light');
    });

    it('rejects initialization when the worker cannot load', async () => {
        const worker = new EventTarget();
        worker.postMessage = vi.fn();
        worker.terminate = vi.fn();
        vi.stubGlobal('Worker', function () {
            return worker;
        });
        const {
            provide: { shiki },
        } = shikiPlugin();
        const ready = expect(shiki.ready).rejects.toThrow('Worker failed to load');
        worker.dispatchEvent(new ErrorEvent('error', { message: 'Worker failed to load' }));

        await ready;
        await expect(shiki.tokenizeBlocks({ blocks: [] })).rejects.toThrow('Worker failed to load');
        expect(worker.terminate).toHaveBeenCalledOnce();
    });

    it('rejects pending and future requests when the worker stops responding', async () => {
        const worker = new EventTarget();
        worker.postMessage = vi.fn();
        worker.terminate = vi.fn();
        vi.stubGlobal('Worker', function () {
            return worker;
        });
        const {
            provide: { shiki },
        } = shikiPlugin();
        worker.dispatchEvent(
            new MessageEvent('message', {
                data: { id: 1, result: { languages: [], themes: [] } },
            })
        );
        await shiki.ready;
        const pending = expect(shiki.tokenizeBlocks({ blocks: [] })).rejects.toThrow(
            'syntax highlighter'
        );
        await Promise.resolve();
        worker.dispatchEvent(new MessageEvent('messageerror'));

        await pending;
        await expect(shiki.tokenizeBlocks({ blocks: [] })).rejects.toThrow('syntax highlighter');
        expect(worker.postMessage).toHaveBeenCalledTimes(2);
    });
});
