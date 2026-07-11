import themeList from '@/data/monaco-themes/themelist.json';

const builtInThemes = new Set(['vs', 'vs-light', 'vs-dark', 'hc-black']);
const loadedThemes = new Set(builtInThemes);

const themeLoaders = import.meta.glob(
    ['../data/monaco-themes/*.json', '!../data/monaco-themes/themelist.json'],
    { import: 'default' }
);

const languageLoaders = import.meta.glob(
    '../../node_modules/monaco-editor/esm/vs/basic-languages/*/*.contribution.js'
);

let monacoPromise = null;

function loadMonaco() {
    if (monacoPromise) {
        return monacoPromise;
    }

    self.MonacoEnvironment = {
        getWorker: () =>
            new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
                type: 'module',
            }),
    };

    monacoPromise = import('monaco-editor/esm/vs/editor/editor.api.js').then(async (monaco) => {
        await Promise.all([
            import('monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching.js'),
            import('monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard.js'),
            import('monaco-editor/esm/vs/editor/contrib/comment/browser/comment.js'),
            import('monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js'),
            import('monaco-editor/esm/vs/editor/contrib/find/browser/findController.js'),
            import('monaco-editor/esm/vs/editor/contrib/hover/browser/hoverContribution.js'),
            import('monaco-editor/esm/vs/editor/contrib/indentation/browser/indentation.js'),
            import('monaco-editor/esm/vs/editor/contrib/linesOperations/browser/linesOperations.js'),
            import('monaco-editor/esm/vs/editor/contrib/multicursor/browser/multicursor.js'),
            import('monaco-editor/esm/vs/editor/contrib/wordOperations/browser/wordOperations.js'),
        ]);

        return monaco;
    });

    return monacoPromise;
}

async function loadMonacoLanguage(monaco, language) {
    if (monaco.languages.getLanguages().some(({ id }) => id === language)) {
        return;
    }

    const suffix = `/basic-languages/${language}/${language}.contribution.js`;
    const loader = Object.entries(languageLoaders).find(([path]) => path.endsWith(suffix))?.[1];

    await loader?.();
}

async function loadMonacoTheme(monaco, theme) {
    if (loadedThemes.has(theme)) {
        return;
    }

    const filename = themeList[theme];
    const loader = themeLoaders[`../data/monaco-themes/${filename}.json`];

    if (!loader) {
        return;
    }

    monaco.editor.defineTheme(theme, await loader());
    loadedThemes.add(theme);
}

export default function () {
    async function prepare({ language, theme }) {
        const monaco = await loadMonaco();

        await Promise.all([loadMonacoLanguage(monaco, language), loadMonacoTheme(monaco, theme)]);

        return monaco;
    }

    return {
        prepare,
        loadLanguage: async (language) => loadMonacoLanguage(await loadMonaco(), language),
        loadTheme: async (theme) => loadMonacoTheme(await loadMonaco(), theme),
    };
}
