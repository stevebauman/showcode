import hexAlpha from 'hex-alpha';
import { cloneDeep } from 'lodash';

export default function () {
    const { $shiki } = useNuxtApp();
    const { highlightLanguage } = useLanguages();

    const themeTypeOverrides = {
        hc_light: 'dark',
    };

    function findEditorLanguageById(languages, id) {
        return highlightLanguage(languages.find((lang) => lang.id === id)?.name);
    }

    async function buildCodeBlocks(config, limit = null) {
        const {
            code = [],
            languages = [],
            opacity = 100,
            theme = 'github-dark',
        } = cloneDeep(config);

        const sourceBlocks = code.map((block) => ({
            value: limit ? block.value?.split('\n').slice(0, limit).join('\n') : block.value,
            language: findEditorLanguageById(languages, block.id),
        }));

        const result = await $shiki.tokenizeBlocks({ blocks: sourceBlocks, theme });
        const { name, fg, bg, type } = result.theme;

        return {
            blocks: code.map((block, index) => ({
                added: block.added,
                removed: block.removed,
                focused: block.focused,
                lines: result.blocks[index],
            })),
            themeType: themeTypeOverrides[name] ?? (name.includes('light') ? 'light' : type),
            themeForeground: hexAlpha(fg, parseFloat(opacity)),
            themeBackground: hexAlpha(bg, parseFloat(opacity)),
        };
    }

    return { buildCodeBlocks };
}
