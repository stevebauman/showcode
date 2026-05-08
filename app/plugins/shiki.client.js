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

                const bundledIds = collect(bundledThemesInfo.map((t) => t.id))
                    .filter((theme) => !['css-variables'].some((t) => theme.includes(t)))
                    .sort()
                    .toArray();

                // Load custom theme IDs from the static manifest
                let customIds = [];

                try {
                    const manifest = await fetch('/shiki/themes/all.json').then((r) => r.json());
                    customIds = manifest.filter((id) => !bundledIds.includes(id)).sort();
                } catch {
                    // No custom themes manifest found
                }

                allThemeIds.value = [...bundledIds, ...customIds].sort();

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

            // Try loading as a bundled shiki theme first.
            // If that fails, fetch from the static custom themes directory.
            try {
                return await highlighter.loadTheme(theme);
            } catch {
                const themeData = await fetch(`/shiki/themes/${theme}.json`).then((r) => {
                    if (!r.ok) throw new Error(`Theme "${theme}" not found.`);
                    return r.json();
                });

                return await highlighter.loadTheme(themeData);
            }
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
