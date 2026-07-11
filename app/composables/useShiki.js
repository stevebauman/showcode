import hexAlpha from 'hex-alpha';
import { defaults } from 'lodash';

export default function () {
    const { $shiki } = useNuxtApp();
    const { highlightLanguage } = useLanguages();

    const themeTypeOverrides = {
        hc_light: 'dark',
    };

    function findEditorLanguageById(languages, id) {
        return highlightLanguage(languages.find((lang) => lang.id === id)?.name);
    }

    function buildCodeBlocks(config, callback, limit = null) {
        const { code, languages, opacity, theme } = defaults(config, {
            code: [],
            languages: [],
            opacity: 100,
            theme: 'github-dark',
        });

        const sourceBlocks = code.map((block) => ({
            value: limit ? block.value?.split('\n').slice(0, limit).join('\n') : block.value,
            language: findEditorLanguageById(languages, block.id),
        }));

        return $shiki.tokenizeBlocks({ blocks: sourceBlocks, theme }).then((result) => {
            const { name, fg, bg, type } = result.theme;

            callback({
                blocks: code.map((block, index) => ({
                    added: block.added,
                    removed: block.removed,
                    focused: block.focused,
                    lines: result.blocks[index],
                })),
                themeType: themeTypeOverrides[name] ?? (name.includes('light') ? 'light' : type),
                themeForeground: hexAlpha(fg, parseFloat(opacity)),
                themeBackground: hexAlpha(bg, parseFloat(opacity)),
            });
        });
    }

    return { buildCodeBlocks };
}
