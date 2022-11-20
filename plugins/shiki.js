import {
    setCDN,
    setWasm,
    getHighlighter,
    BUNDLED_THEMES,
    BUNDLED_LANGUAGES,
} from '@stevebauman/shiki';

setCDN('/shiki/');
setWasm('/shiki/dist/onig.wasm');

const preloadedThemes = ['github-light'];
const preloadedLangs = [
    'html',
    'html-derivative',
    'xml',
    'sql',
    'javascript',
    'json',
    'css',
    'php',
    'php-html',
];

const langAliases = ['bash', 'shell'];
const exludedLangs = ['php-html', 'html-derivative'];

export default defineNuxtPlugin(async (nuxtApp) => {
    const highlighter = await getHighlighter({
        themes: preloadedThemes,
        langs: preloadedLangs,
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
            const langs = BUNDLED_LANGUAGES.filter((lang) => !exludedLangs.includes(lang.id)).map(
                (lang) => lang.id
            );

            return [...langs, ...langAliases];
        },

        languageIsLoaded(lang) {
            return this.loadedLanguages().includes(lang);
        },

        loadedLanguages() {
            return highlighter.getLoadedLanguages();
        },

        themes() {
            return BUNDLED_THEMES.filter(
                (theme) => !['slack-ochin', 'css-variables'].some((t) => theme.includes(t))
            );
        },

        themeIsLoaded(theme) {
            return this.loadedThemes().includes(theme);
        },

        loadedThemes() {
            return highlighter.getLoadedThemes();
        },

        async tokens(code, lang, theme) {
            // If an opening PHP tag is detected, we will
            // swap out the language to php-html which
            // supports both html and php languages.
            if (code.includes('<?php') && lang === 'php') {
                await this.loadLanguage((lang = 'php-html'));
            }

            return highlighter.codeToThemedTokens(code, lang, theme);
        },
    };

    return { provide: { shiki } };
});
