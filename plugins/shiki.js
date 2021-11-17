import { setOnigasmWASM, setCDN, getHighlighter } from 'shiki';

setCDN('/shiki/');
setOnigasmWASM('/shiki/dist/onigasm.wasm');

const preloadedThemes  = ['github-light'];
const preloadedLangs = ['php'];
const customLangs = [
    {
        id: 'antlers',
        scopeName: 'text.html.statamic',
        path: 'languages/antlers.tmLanguage.json',
        embeddedLangs: ['html', 'php'],
    },
    {
        id: 'blade',
        scopeName: 'text.html.php.blade',
        path: 'languages/blade.tmLanguage.json',
        embeddedLangs: ['html', 'php'],
    },
];

export default async (context, inject) => {
    const highlighter = await getHighlighter({
        themes: preloadedThemes,
        langs: preloadedLangs
    });

    const shiki = {
        async loadLanguage(lang) {
            const custom = customLangs.find(({id}) => id === lang);

            return await highlighter.loadLanguage(custom ?? lang);
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
