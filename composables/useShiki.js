import hexAlpha from 'hex-alpha';
import { defaults } from 'lodash';
import { useContext } from '@nuxtjs/composition-api';

export default function () {
    const { $queue, $shiki } = useContext();

    const findEditorLanguageById = (languages, id) =>
        languages.find((lang) => lang.id === id)?.name;

    const themeTypeOverrides = {
        hc_light: 'dark',
    };

    const buildCodeBlocks = async (config, callback, limit = null) => {
        const { code, languages, opacity, theme } = defaults(config, {
            code: [],
            languages: [],
            opacity: 100,
            theme: 'github-dark',
        });

        $queue.push(async () => {
            await $shiki.loadLanguages(languages.map((lang) => lang.name));

            await $shiki.loadTheme(theme);

            const blocks = await Promise.all(
                code.map(async (code) => {
                    return {
                        added: code.added,
                        removed: code.removed,
                        focused: code.focused,
                        lines: await $shiki.tokens(
                            limit ? code.value?.split('\n').slice(0, limit).join('\n') : code.value,
                            findEditorLanguageById(languages, code.id),
                            theme
                        ),
                    };
                })
            );

            const { name, fg, bg, type } = $shiki.getTheme(theme);

            callback({
                blocks: blocks,
                themeType: themeTypeOverrides[name] ?? (name.includes('light') ? 'light' : type),
                themeForeground: hexAlpha(fg, parseFloat(opacity)),
                themeBackground: hexAlpha(bg, parseFloat(opacity)),
            });
        });
    };

    return { buildCodeBlocks };
}
