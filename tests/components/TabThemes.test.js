import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TabThemes from '~/components/TabThemes.vue';

const ButtonThemeStub = {
    name: 'ButtonTheme',
    props: ['theme'],
    template: '<button class="theme-card">{{ theme }}</button>',
};

describe('TabThemes', () => {
    it('only mounts theme cards near the visible viewport', async () => {
        const themes = Array.from({ length: 80 }, (_, index) => `theme-${index}`);

        const wrapper = mount(TabThemes, {
            props: {
                code: [],
                theme: 'theme-40',
                themes,
                settings: {},
                background: {},
                languages: [],
            },
            global: {
                stubs: {
                    ButtonTheme: ButtonThemeStub,
                },
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 30));

        const renderedThemes = wrapper.findAll('.theme-card').map((card) => card.text());

        expect(renderedThemes).toContain('theme-40');
        expect(renderedThemes.length).toBeGreaterThan(0);
        expect(renderedThemes.length).toBeLessThan(12);
    });
});
