import hexAlpha from 'hex-alpha';
import { defaults } from 'lodash';
import { useContext } from '@nuxtjs/composition-api';

export default function () {
    const { $shiki } = useContext();

    const findEditorLanguageById = (languages, id) =>
        languages.find((lang) => lang.id === id)?.name;

    const buildCodeBlocks = async (config, callback) => {
        const { code, languages, opacity, theme } = defaults(config, {
            code: [],
            languages: [],
            opacity: 100,
            theme: 'github-light',
        });

        await $shiki.loadLanguages(languages.map((lang) => lang.name));

        await $shiki.loadTheme(theme);

        const { name, bg, type } = $shiki.getTheme(theme);

        callback({
            themeType: name.includes('light') ? 'light' : type,
            themeBackground: hexAlpha(bg, parseFloat(opacity)),
            blocks: code.map((code) =>
                $shiki.tokens(code.value, findEditorLanguageById(languages, code.id), theme)
            ),
        });
    };

    return { buildCodeBlocks };
}
