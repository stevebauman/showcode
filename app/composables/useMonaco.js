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
        getWorker: (_, label) => {
            switch (label) {
                case 'json':
                    return new Worker(
                        new URL(
                            'monaco-editor/esm/vs/language/json/json.worker.js',
                            import.meta.url
                        ),
                        { type: 'module' }
                    );
                case 'css':
                case 'scss':
                case 'less':
                    return new Worker(
                        new URL('monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url),
                        { type: 'module' }
                    );
                case 'html':
                case 'handlebars':
                case 'razor':
                    return new Worker(
                        new URL(
                            'monaco-editor/esm/vs/language/html/html.worker.js',
                            import.meta.url
                        ),
                        { type: 'module' }
                    );
                case 'javascript':
                case 'typescript':
                    return new Worker(
                        new URL(
                            'monaco-editor/esm/vs/language/typescript/ts.worker.js',
                            import.meta.url
                        ),
                        { type: 'module' }
                    );
                default:
                    return new Worker(
                        new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
                        { type: 'module' }
                    );
            }
        },
    };

    monacoPromise = import('monaco-editor/esm/vs/editor/edcore.main.js');

    return monacoPromise;
}

async function loadMonacoLanguage(language) {
    const contribution =
        {
            c: 'cpp',
            coffeescript: 'coffee',
            proto: 'protobuf',
            aes: 'sophia',
            sol: 'solidity',
            verilog: 'systemverilog',
        }[language] ?? language.split('.')[0];
    const suffix = `/basic-languages/${contribution}/${contribution}.contribution.js`;
    const loader = Object.entries(languageLoaders).find(([path]) => path.endsWith(suffix))?.[1];

    const features = {
        json: () => import('monaco-editor/esm/vs/language/json/monaco.contribution.js'),
        css: () => import('monaco-editor/esm/vs/language/css/monaco.contribution.js'),
        scss: () => import('monaco-editor/esm/vs/language/css/monaco.contribution.js'),
        less: () => import('monaco-editor/esm/vs/language/css/monaco.contribution.js'),
        html: () => import('monaco-editor/esm/vs/language/html/monaco.contribution.js'),
        handlebars: () => import('monaco-editor/esm/vs/language/html/monaco.contribution.js'),
        razor: () => import('monaco-editor/esm/vs/language/html/monaco.contribution.js'),
        javascript: () => import('monaco-editor/esm/vs/language/typescript/monaco.contribution.js'),
        typescript: () => import('monaco-editor/esm/vs/language/typescript/monaco.contribution.js'),
    };

    await Promise.all([loader?.(), features[language]?.()]);
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

        await Promise.all([loadMonacoLanguage(language), loadMonacoTheme(monaco, theme)]);

        return monaco;
    }

    return {
        prepare,
        loadLanguage: async (language) => {
            await loadMonaco();
            await loadMonacoLanguage(language);
        },
        loadTheme: async (theme) => loadMonacoTheme(await loadMonaco(), theme),
    };
}
