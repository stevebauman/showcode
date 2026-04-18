import hexAlpha from 'hex-alpha';
import { defaults } from 'lodash';

function yieldToMain() {
    if (typeof requestIdleCallback === 'function') {
        return new Promise((resolve) =>
            requestIdleCallback(() => resolve(), { timeout: 50 })
        );
    }

    return new Promise((resolve) => setTimeout(resolve, 0));
}

export default function () {
    const { $queue, $shiki } = useNuxtApp();

    const themeTypeOverrides = {
        hc_light: 'dark',
    };

    function findEditorLanguageById(languages, id) {
        return languages.find((lang) => lang.id === id)?.name;
    }

    function buildCodeBlocks(config, callback, limit = null) {
        const { code, languages, opacity, theme } = defaults(config, {
            code: [],
            languages: [],
            opacity: 100,
            theme: 'github-dark',
        });

        return new Promise((resolve, reject) => {
            $queue.push(async () => {
                try {
                    await yieldToMain();

                    await $shiki.loadLanguages(languages.map((lang) => lang.name));

                    await yieldToMain();

                    await $shiki.loadTheme(theme);

                    const blocks = [];

                    for (const block of code) {
                        await yieldToMain();

                        blocks.push({
                            added: block.added,
                            removed: block.removed,
                            focused: block.focused,
                            lines: await $shiki.tokens(
                                limit ? block.value?.split('\n').slice(0, limit).join('\n') : block.value,
                                findEditorLanguageById(languages, block.id),
                                theme
                            ),
                        });
                    }

                    const { name, fg, bg, type } = $shiki.getTheme(theme);

                    callback({
                        blocks: blocks,
                        themeType: themeTypeOverrides[name] ?? (name.includes('light') ? 'light' : type),
                        themeForeground: hexAlpha(fg, parseFloat(opacity)),
                        themeBackground: hexAlpha(bg, parseFloat(opacity)),
                    });

                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    return { buildCodeBlocks };
}
