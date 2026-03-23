import {
    setCDN,
    setWasm,
    getHighlighter,
    BUNDLED_THEMES,
    BUNDLED_LANGUAGES,
} from '@stevebauman/shiki';
import collect from 'collect.js';

export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig().public;

    try {
        setCDN(config.isDesktop ? 'shiki/' : '/shiki/');
        setWasm(config.isDesktop ? 'shiki/dist/onig.wasm' : '/shiki/dist/onig.wasm');

        const highlighter = await getHighlighter({
            themes: ['github-light'],
            langs: [
                'html',
                'html-derivative',
                'xml',
                'sql',
                'javascript',
                'json',
                'css',
                'php',
                'php-html',
            ],
        });

        const shiki = {
            async loadLanguage(lang) {
                if (this.languageIsLoaded(lang)) {
                    return;
                }

                return await highlighter.loadLanguage(lang);
            },

            async loadLanguages(langs = []) {
                return await Promise.all(langs.map(async (lang) => await this.loadLanguage(lang)));
            },

            async loadTheme(theme) {
                if (this.themeIsLoaded(theme)) {
                    return;
                }

                return await highlighter.loadTheme(theme);
            },

            getTheme(theme) {
                return highlighter.getTheme(theme);
            },

            languages() {
                const excludedLangs = ['php-html', 'html-derivative'];

                const langs = BUNDLED_LANGUAGES.filter((lang) => !excludedLangs.includes(lang.id)).map(
                    (lang) => lang.id
                );

                return [...langs, 'bash', 'shell'];
            },

            languageIsLoaded(lang) {
                return this.loadedLanguages().includes(lang);
            },

            loadedLanguages() {
                return highlighter.getLoadedLanguages();
            },

            themes() {
                return collect(BUNDLED_THEMES)
                    .filter((theme) => !['slack-ochin', 'css-variables'].some((t) => theme.includes(t)))
                    .merge(['bluloco-light', 'bluloco-dark'])
                    .sort()
                    .toArray();
            },

            themeIsLoaded(theme) {
                return this.loadedThemes().includes(theme);
            },

            loadedThemes() {
                return highlighter.getLoadedThemes();
            },

            async tokens(code, lang, theme) {
                if (code.includes('<?php') && lang === 'php') {
                    await this.loadLanguage((lang = 'php-html'));
                }

                return highlighter.codeToThemedTokens(code, lang, theme);
            },
        };

        return {
            provide: {
                shiki,
            },
        };
    } catch (error) {
        console.error('Failed to initialize Shiki.', error);

        return {
            provide: {
                shiki: {
                    async loadLanguage() {},
                    async loadLanguages() {},
                    async loadTheme() {},
                    getTheme() {
                        return {
                            name: 'fallback-dark',
                            fg: '#f8fafc',
                            bg: '#0f172a',
                            type: 'dark',
                        };
                    },
                    languages() {
                        return [];
                    },
                    languageIsLoaded() {
                        return false;
                    },
                    loadedLanguages() {
                        return [];
                    },
                    themes() {
                        return [];
                    },
                    themeIsLoaded() {
                        return false;
                    },
                    loadedThemes() {
                        return [];
                    },
                    async tokens(code) {
                        return code.split('\n').map((line) => [{ content: line }]);
                    },
                },
            },
        };
    }
});
