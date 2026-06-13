import { describe, expect, it } from 'vitest';
import useLanguages from '~/composables/useLanguages';

describe('useLanguages', () => {
    it('exposes bash instead of the internal shellscript grammar id', () => {
        const { options } = useLanguages();

        expect(options(['typescript', 'shellscript', 'php'])).toEqual([
            'bash',
            'php',
            'typescript',
        ]);
    });

    it('resolves bash to the shiki shellscript grammar', () => {
        const { highlightLanguage } = useLanguages();

        expect(highlightLanguage('bash')).toBe('shellscript');
        expect(highlightLanguage('php')).toBe('php');
    });
});
