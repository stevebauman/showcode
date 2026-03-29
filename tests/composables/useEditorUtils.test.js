import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import useEditorUtils from '~/composables/useEditorUtils';
import usePreferencesStore from '~/composables/usePreferencesStore';

describe('useEditorUtils', () => {
    let preferences;

    beforeEach(() => {
        localStorage.clear();

        preferences = usePreferencesStore();
    });

    describe('stripInitialPhpTag', () => {
        it('strips opening PHP tag', () => {
            const { stripInitialPhpTag } = useEditorUtils();

            expect(stripInitialPhpTag('<?php\necho "hello";')).toBe('echo "hello";');
        });

        it('strips opening PHP tag without newline', () => {
            const { stripInitialPhpTag } = useEditorUtils();

            expect(stripInitialPhpTag('<?php echo "hello";')).toBe(' echo "hello";');
        });

        it('does not strip PHP tag in the middle', () => {
            const { stripInitialPhpTag } = useEditorUtils();

            expect(stripInitialPhpTag('echo "hello"; <?php')).toBe('echo "hello"; <?php');
        });
    });

    describe('getCodeFromEditors', () => {
        it('returns code from editors', () => {
            const { getCodeFromEditors } = useEditorUtils();

            const editors = [
                { id: '1', language: 'javascript', value: 'const x = 1;', added: [], removed: [], focused: [] },
            ];

            const result = getCodeFromEditors(editors);

            expect(result).toEqual([
                { id: '1', value: 'const x = 1;', added: [], removed: [], focused: [] },
            ]);
        });

        it('strips initial PHP tag when preference is enabled', () => {
            preferences.stripIntialPhpTag = true;

            const { getCodeFromEditors } = useEditorUtils();

            const editors = [
                { id: '1', language: 'php', value: '<?php\necho "hello";', added: [2], removed: [3], focused: [4] },
            ];

            const result = getCodeFromEditors(editors);

            expect(result[0].value).toBe('echo "hello";');
            expect(result[0].added).toEqual([1]);
            expect(result[0].removed).toEqual([2]);
            expect(result[0].focused).toEqual([3]);
        });

        it('does not strip PHP tag when preference is disabled', () => {
            preferences.stripIntialPhpTag = false;

            const { getCodeFromEditors } = useEditorUtils();

            const editors = [
                { id: '1', language: 'php', value: '<?php\necho "hello";', added: [2], removed: [], focused: [] },
            ];

            const result = getCodeFromEditors(editors);

            expect(result[0].value).toBe('<?php\necho "hello";');
            expect(result[0].added).toEqual([2]);
        });

        it('only strips PHP tag for PHP language', () => {
            preferences.stripIntialPhpTag = true;

            const { getCodeFromEditors } = useEditorUtils();

            const editors = [
                { id: '1', language: 'javascript', value: '<?php\nconst x = 1;', added: [], removed: [], focused: [] },
            ];

            const result = getCodeFromEditors(editors);

            expect(result[0].value).toBe('<?php\nconst x = 1;');
        });

        it('accepts a ref of editors', () => {
            const { getCodeFromEditors } = useEditorUtils();

            const editors = ref([
                { id: '1', language: 'javascript', value: 'const x = 1;', added: [], removed: [], focused: [] },
            ]);

            const result = getCodeFromEditors(editors);

            expect(result).toHaveLength(1);
        });

        it('handles null added/removed/focused', () => {
            const { getCodeFromEditors } = useEditorUtils();

            const editors = [
                { id: '1', language: 'javascript', value: 'x', added: null, removed: null, focused: null },
            ];

            const result = getCodeFromEditors(editors);

            expect(result[0].added).toEqual([]);
            expect(result[0].removed).toEqual([]);
            expect(result[0].focused).toEqual([]);
        });
    });

    describe('getLanguagesFromEditors', () => {
        it('returns languages from editors', () => {
            const { getLanguagesFromEditors } = useEditorUtils();

            const editors = [
                { id: '1', language: 'php', value: '' },
                { id: '2', language: 'javascript', value: '' },
            ];

            expect(getLanguagesFromEditors(editors)).toEqual([
                { id: '1', name: 'php' },
                { id: '2', name: 'javascript' },
            ]);
        });
    });
});

