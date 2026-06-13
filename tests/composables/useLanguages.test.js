import { describe, expect, it } from 'vitest';
import useLanguages from '~/composables/useLanguages';

describe('useLanguages', () => {
    it('exposes familiar markdown language ids instead of internal grammar ids', () => {
        const { options } = useLanguages();

        expect(options(['typescript', 'shellscript', 'php', 'docker'])).toEqual([
            'bash',
            'dockerfile',
            'php',
            'typescript',
        ]);
    });

    it('resolves aliases to shiki grammar ids', () => {
        const { highlightLanguage } = useLanguages();

        expect(highlightLanguage('bash')).toBe('shellscript');
        expect(highlightLanguage('dockerfile')).toBe('docker');
        expect(highlightLanguage('php')).toBe('php');
    });
});
