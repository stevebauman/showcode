import { bundledLanguagesInfo, bundledThemesInfo, createHighlighter } from 'shiki';

let highlighter = null;
let initialization = null;

async function initialize() {
    if (initialization) {
        return initialization;
    }

    initialization = (async () => {
        highlighter = await createHighlighter({
            themes: ['github-light'],
            langs: ['html', 'xml', 'sql', 'javascript', 'json', 'css', 'php'],
        });

        const languages = bundledLanguagesInfo
            .map(({ id }) => id)
            .filter((id) => !['php-html', 'html-derivative'].includes(id));

        const bundledThemes = bundledThemesInfo
            .map(({ id }) => id)
            .filter((theme) => !theme.includes('css-variables'));

        const response = await fetch('/shiki/themes/all.json');
        const customThemes = response.ok ? await response.json() : [];

        return {
            languages,
            themes: [...new Set([...bundledThemes, ...customThemes])].sort(),
        };
    })();

    return initialization;
}

async function loadLanguage(language) {
    if (!highlighter.getLoadedLanguages().includes(language)) {
        await highlighter.loadLanguage(language);
    }
}

async function loadTheme(theme) {
    if (highlighter.getLoadedThemes().includes(theme)) {
        return;
    }

    try {
        await highlighter.loadTheme(theme);
    } catch {
        const response = await fetch(`/shiki/themes/${theme}.json`);

        if (!response.ok) {
            throw new Error(`Theme "${theme}" not found.`);
        }

        await highlighter.loadTheme(await response.json());
    }
}

async function tokenizeBlocks({ blocks, theme }) {
    await initialize();

    const languages = [...new Set(blocks.map(({ language }) => language))];

    await Promise.all([loadTheme(theme), ...languages.map(loadLanguage)]);

    const tokenized = blocks.map(({ value, language }) =>
        highlighter.codeToTokensBase(value, { lang: language, theme })
    );

    const { name, fg, bg, type } = highlighter.getTheme(theme);

    return {
        blocks: tokenized,
        theme: { name, fg, bg, type },
    };
}

const handlers = {
    initialize,
    tokenizeBlocks,
};

self.addEventListener('message', async ({ data: { id, method, payload } }) => {
    try {
        self.postMessage({ id, result: await handlers[method](payload) });
    } catch (error) {
        self.postMessage({
            id,
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
