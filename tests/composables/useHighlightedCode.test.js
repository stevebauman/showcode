import { describe, expect, it, vi } from 'vitest';
import { effectScope, ref } from 'vue';
import useHighlightedCode from '~/composables/useHighlightedCode';

const buildCodeBlocks = vi.hoisted(() => vi.fn());
vi.mock('~/composables/useShiki', () => ({ default: () => ({ buildCodeBlocks }) }));

describe('useHighlightedCode', () => {
    it('ignores old results as soon as code changes, even before the debounce runs', async () => {
        vi.useFakeTimers();
        let finishOld;
        buildCodeBlocks.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finishOld = resolve;
                })
        );
        buildCodeBlocks.mockResolvedValueOnce({ blocks: ['new'] });
        const code = ref('old');
        const scope = effectScope();
        const highlighting = scope.run(() => useHighlightedCode(() => ({ code: code.value })));
        code.value = 'new';
        finishOld({ blocks: ['old'] });
        await Promise.resolve();
        expect(highlighting.result.value).toBeNull();
        expect(highlighting.loading.value).toBe(true);

        await vi.advanceTimersByTimeAsync(150);
        expect(highlighting.result.value.blocks).toEqual(['new']);
        expect(highlighting.loading.value).toBe(false);
        scope.stop();
        vi.useRealTimers();
    });

    it('waits for the newest request when inputs change during a flush', async () => {
        let finishOld;
        buildCodeBlocks.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finishOld = resolve;
                })
        );
        buildCodeBlocks.mockResolvedValueOnce({ blocks: ['new'] });
        const code = ref('old');
        const scope = effectScope();
        const highlighting = scope.run(() => useHighlightedCode(() => ({ code: code.value })));
        const saving = highlighting.flush();
        code.value = 'new';
        finishOld({ blocks: ['old'] });

        await expect(saving).resolves.toEqual({ blocks: ['new'] });
        expect(highlighting.result.value.blocks).toEqual(['new']);
        scope.stop();
    });

    it('keeps separate preview instances independent', async () => {
        let finishFirst;
        buildCodeBlocks.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finishFirst = resolve;
                })
        );
        buildCodeBlocks.mockResolvedValueOnce({ blocks: ['second'] });
        const scope = effectScope();
        const first = scope.run(() => useHighlightedCode(() => ({ theme: 'first' })));
        const second = scope.run(() => useHighlightedCode(() => ({ theme: 'second' })));
        await second.flush();
        finishFirst({ blocks: ['first'] });
        await first.flush();

        expect(first.result.value.blocks).toEqual(['first']);
        expect(second.result.value.blocks).toEqual(['second']);
        scope.stop();
    });

    it('cancels delayed work and ignores pending results when disposed', async () => {
        vi.useFakeTimers();
        let finish;
        const calls = buildCodeBlocks.mock.calls.length;
        buildCodeBlocks.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve;
                })
        );
        const code = ref('old');
        const scope = effectScope();
        const highlighting = scope.run(() => useHighlightedCode(() => ({ code: code.value })));
        code.value = 'new';
        scope.stop();
        finish({ blocks: ['old'] });
        await vi.advanceTimersByTimeAsync(1000);

        expect(highlighting.result.value).toBeNull();
        expect(buildCodeBlocks.mock.calls.length - calls).toBe(1);
        vi.useRealTimers();
    });

    it('only highlights visible cards and refreshes their latest language on return', async () => {
        const visible = ref(false);
        const language = ref('php');
        const calls = buildCodeBlocks.mock.calls.length;
        buildCodeBlocks.mockResolvedValue({ blocks: [] });
        const scope = effectScope();
        const highlighting = scope.run(() =>
            useHighlightedCode(() => ({ language: language.value }), { enabled: visible, limit: 5 })
        );
        expect(buildCodeBlocks.mock.calls.length).toBe(calls);
        visible.value = true;
        await highlighting.flush();
        visible.value = false;
        language.value = 'json';
        expect(buildCodeBlocks.mock.calls.length - calls).toBe(1);
        visible.value = true;
        await highlighting.flush();

        expect(buildCodeBlocks).toHaveBeenLastCalledWith({ language: 'json' }, 5);
        scope.stop();
    });
});
