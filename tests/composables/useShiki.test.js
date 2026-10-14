import { useNuxtApp } from '#app';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useShiki from '~/composables/useShiki';

afterEach(() => vi.restoreAllMocks());

describe('useShiki', () => {
    it('returns a complete highlighted snapshot without mutating the input', async () => {
        let finish;
        const tokenize = vi.spyOn(useNuxtApp().$shiki, 'tokenizeBlocks').mockImplementation(
            () =>
                new Promise((resolve) => {
                    finish = resolve;
                })
        );
        const config = {
            code: [{ id: 'editor', value: 'first\nsecond', added: [1], removed: [], focused: [] }],
            languages: [{ id: 'editor', name: 'bash' }],
        };
        const pending = useShiki().buildCodeBlocks(config, 1);
        config.code[0].added.push(2);
        config.code.push({ id: 'later', value: 'unrelated' });
        const tokens = [[{ content: 'first', color: '#ffffff' }]];
        finish({
            blocks: [tokens],
            theme: { name: 'github-dark', type: 'dark', fg: '#ffffff', bg: '#000000' },
        });
        const result = await pending;

        expect(tokenize).toHaveBeenCalledWith({
            blocks: [{ value: 'first', language: 'shellscript' }],
            theme: 'github-dark',
        });
        expect(result.blocks).toEqual([{ added: [1], removed: [], focused: [], lines: tokens }]);
        expect(result.themeType).toBe('dark');
        expect(config).not.toHaveProperty('theme');
    });
});
