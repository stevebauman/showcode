import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeLine from '~/components/CodeLine.vue';
import usePreferencesStore from '~/composables/usePreferencesStore';

describe('CodeLine', () => {
    beforeEach(() => {
        localStorage.clear();
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
