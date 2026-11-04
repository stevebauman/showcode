import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeLine from '~/components/CodeLine.vue';
import usePreferencesStore from '~/composables/usePreferencesStore';

describe('CodeLine', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it.each([
        { fontStyle: 3, underline: false },
        { fontStyle: 7, underline: true },
    ])('preserves combined token styles for flag $fontStyle', ({ fontStyle, underline }) => {
        const wrapper = mount(CodeLine, {
            props: {
                line: [{ content: 'example', color: '#ffffff', fontStyle }],
            },
        });
        const token = wrapper.get('span > span').element;

        expect(token.style.fontWeight).toBe('bold');
        expect(token.style.fontStyle).toBe('italic');
        expect(token.style.textDecoration).toBe(underline ? 'underline' : '');
    });

    it('does not treat an unset token style as combined flags', () => {
        const wrapper = mount(CodeLine, {
            props: {
                line: [{ content: 'example', color: '#ffffff', fontStyle: -1 }],
            },
        });
        const token = wrapper.get('span > span').element;

        expect(token.style.fontWeight).toBe('');
        expect(token.style.fontStyle).toBe('');
        expect(token.style.textDecoration).toBe('');
    });

    it('blurs non-focused lines while focusing', () => {
        const preferences = usePreferencesStore();
        preferences.previewCodeBlurStrength = 3;

        const wrapper = mount(CodeLine, {
            props: {
                line: [{ content: 'const foo = true;', color: '#ffffff', fontStyle: 0 }],
                focusing: true,
                focused: false,
            },
        });

        expect(wrapper.attributes('style')).toContain('filter: blur(3px)');
    });

    it('does not blur focused lines', () => {
        const preferences = usePreferencesStore();
        preferences.previewCodeBlurStrength = 3;

        const wrapper = mount(CodeLine, {
            props: {
                line: [{ content: 'const foo = true;', color: '#ffffff', fontStyle: 0 }],
                focusing: true,
                focused: true,
            },
        });

        expect(wrapper.attributes('style')).toContain('filter: blur(0px)');
    });
});
