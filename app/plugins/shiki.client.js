import { ref } from 'vue';
import collect from 'collect.js';

export default defineNuxtPlugin(() => {
    let highlighter = null;
    const allLanguageIds = ref([]);
    const allThemeIds = ref([]);
    let readyResolve;

    const ready = new Promise((resolve) => {
        readyResolve = resolve;
    });

    // Defer shiki loading until after the app is mounted
    if (import.meta.client) {
        setTimeout(async () => {
            try {
                const { createHighlighter, bundledLanguagesInfo, bundledThemesInfo } =
                    await import('shiki');

                highlighter = await createHighlighter({
                    themes: ['github-light'],
                    langs: ['html', 'xml', 'sql', 'javascript', 'json', 'css', 'php'],
                });

                allLanguageIds.value = bundledLanguagesInfo
                    .map((lang) => lang.id)
                    .filter((id) => !['php-html', 'html-derivative'].includes(id));

                allThemeIds.value = collect(bundledThemesInfo.map((t) => t.id))
                    .filter(
                        (theme) => !['slack-ochin', 'css-variables'].some((t) => theme.includes(t))
                    )
                    .sort()
                    .toArray();

                readyResolve();
            } catch (e) {
                console.error('Failed to initialize shiki:', e);
                readyResolve();
            }
        }, 0);
    }

    const shiki = {
        ready,

        async loadLanguage(lang) {
            await ready;
            if (this.languageIsLoaded(lang)) return;
            return await highlighter.loadLanguage(lang);
        },

        async loadLanguages(langs = []) {
            return await Promise.all(langs.map(async (lang) => await this.loadLanguage(lang)));
        },

        async loadTheme(theme) {
            await ready;
            if (this.themeIsLoaded(theme)) return;
            return await highlighter.loadTheme(theme);
        },

        getTheme(theme) {
            return highlighter?.getTheme(theme);
        },

        languages() {
            return allLanguageIds.value;
        },

        languageIsLoaded(lang) {
            return this.loadedLanguages().includes(lang);
        },

        loadedLanguages() {
            return highlighter?.getLoadedLanguages() ?? [];
        },

        themes() {
            return allThemeIds.value;
        },

        themeIsLoaded(theme) {
            return this.loadedThemes().includes(theme);
        },

        loadedThemes() {
            return highlighter?.getLoadedThemes() ?? [];
        },

        async tokens(code, lang, theme) {
            await ready;

            if (code.includes('<?php') && lang === 'php') {
                await this.loadLanguage('php');
            }

            return highlighter.codeToTokensBase(code, { lang, theme });
        },
    };

    return {
        provide: {
            shiki,
        },
    };
});
