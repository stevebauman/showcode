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
const preloadedLangs = ['html', 'xml', 'sql', 'javascript', 'json', 'css', 'php'];

export default async (context, inject) => {
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
            return BUNDLED_LANGUAGES.map((lang) => lang.id);
        },

        languageIsLoaded(lang) {
            return this.loadedLanguages().includes(lang);
        },

        loadedLanguages() {
            return highlighter.getLoadedLanguages();
        },

        themes() {
            return BUNDLED_THEMES.filter((theme) => theme !== 'css-variables');
        },

        themeIsLoaded(theme) {
            return this.loadedThemes().includes(theme);
        },

        loadedThemes() {
            return highlighter.getLoadedThemes();
        },

        tokens(code, lang, theme) {
            return highlighter.codeToThemedTokens(code, lang, theme);
        },
    };

    inject('shiki', shiki);
};
