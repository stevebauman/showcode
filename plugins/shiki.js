import { setOnigasmWASM, setCDN, getHighlighter } from 'shiki';

setCDN('/shiki/')
setOnigasmWASM('/shiki/dist/onigasm.wasm')

const preloadedThemes  = ['github-light', 'github-dark'];
const preloadedLangs = ['css','html','php', 'javascript'];

export default async (context, inject) => {
    const highlighter = await getHighlighter({
        themes: preloadedThemes,
        langs: preloadedLangs
    });

    const shiki = {
        async loadLanguage(lang) {
            return await highlighter.loadLanguage(lang);
        },
    
        async loadLanguages(langs) {
            return await Promise.all(
                langs.map(async (lang) => await this.loadLanguage(lang))
            );
        },
    
        async loadTheme(theme) {
            return await highlighter.loadTheme(theme);       
        },
    
        getTheme(theme) {
            return highlighter.getTheme(theme);
        },
    
        tokens(code, lang, theme) {
            return highlighter.codeToThemedTokens(
                code,
                lang,
                theme,
            );
        }
    }

    inject('shiki', shiki);
}
