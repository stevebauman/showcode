import Queue from 'queue';
import hexAlpha from 'hex-alpha';
import { get, defaults } from 'lodash';
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

let highlighter;

const queue = new Queue({
    autostart: true,
    concurrency: 1,
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

    findEditorLanguageById(languages, id) {
        return get(
            languages.find((lang) => lang.id === id),
            'name'
        );
    },

    async buildCodeBlocks(config) {
        const { code, languages, opacity, theme } = defaults(config, {
            code: [],
            languages: [],
            opacity: 100,
            theme: 'github-light',
        });

        await this.loadLanguages(languages.map((lang) => lang.name));

        await this.loadTheme(theme);

        const blocks = await Promise.all(
            code.map(async (code) => {
                return {
                    added: code.added,
                    removed: code.removed,
                    focused: code.focused,
                    lines: await this.tokens(
                        code.value,
                        this.findEditorLanguageById(languages, code.id),
                        theme
                    ),
                };
            })
        );

        const { name, fg, bg, type } = this.getTheme(theme);

        return {
            blocks: blocks,
            themeType: name.includes('light') ? 'light' : type,
            themeForeground: hexAlpha(fg, parseFloat(opacity)),
            themeBackground: hexAlpha(bg, parseFloat(opacity)),
        };
    },
};

self.addEventListener('message', async (event) => {
    if (!highlighter) {
        highlighter = await getHighlighter({
            themes: preloadedThemes,
            langs: preloadedLangs,
        });
    }

    queue.push(async () => {
        postMessage(await shiki.buildCodeBlocks(event.data));
    });
});

export default self;
