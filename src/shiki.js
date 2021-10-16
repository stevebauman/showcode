const shiki = require('shiki');
const fs = require('fs');
const path = require('path');
const renderer = require('./renderer');

const arguments = JSON.parse(process.argv.slice(2));

const customLanguages = [
    {
        id: 'antlers',
        scopeName: 'text.html.statamic',
        path: getLanguagePath('antlers'),
        embeddedLangs: ['html'],
    },
    {
        id: 'blade',
        scopeName: 'text.html.php.blade',
        path: getLanguagePath('blade'),
        embeddedLangs: ['html', 'php'],
    },
];

if (arguments[0] === 'themes') {
    process.stdout.write(JSON.stringify(shiki.BUNDLED_THEMES));
    return;
}

let allLanguages = shiki.BUNDLED_LANGUAGES;
allLanguages.push(...customLanguages);

if (arguments[0] === 'languages') {
    process.stdout.write(JSON.stringify(allLanguages));
    return;
}

const language = arguments[1] || 'php';
let theme = arguments[2] || 'nord';

const languagesToLoad = allLanguages.filter(lang => lang.id === language || (lang.aliases && lang.aliases.includes(language)));

(function loadEmbeddedLangsRecursively() {
    languagesToLoad.forEach(function (language) {
        const embeddedLangs = language.embeddedLangs || [];
        embeddedLangs.forEach(function (languageKey) {
            if (languagesToLoad.find(lang => lang.id === languageKey || (lang.aliases && lang.aliases.includes(languageKey)))) {
                return;
            }

            languagesToLoad.push(allLanguages.find(lang => lang.id === languageKey || (lang.aliases && lang.aliases.includes(languageKey))));
            loadEmbeddedLangsRecursively();
        });
    });
})();

if (fs.existsSync(theme)) {
    theme = JSON.parse(fs.readFileSync(theme, 'utf-8'));
}

shiki.getHighlighter({
    theme,
    langs: languagesToLoad,
}).then((highlighter) => {
    const tokens = highlighter.codeToThemedTokens(arguments[0], language);
    const theme = highlighter.getTheme();
    const options = arguments[3] || {};

    process.stdout.write(renderer.renderToHtml(tokens, {
        fg: theme.fg,
        bg: theme.bg,
        highlightLines: options.highlightLines,
        addLines: options.addLines,
        deleteLines: options.deleteLines,
        focusLines: options.focusLines,
    }));
});

function getLanguagePath(language)
{
    const pathToShikiDistDirectory = path.dirname(require.resolve('shiki'));
    const pathToShikiLanguages = path.resolve(`${pathToShikiDistDirectory}/../languages`);
    const relativeDirectory = path.relative(pathToShikiLanguages, `${__dirname}/../languages`) ;

    return `${relativeDirectory}/${language}.tmLanguage.json`
}