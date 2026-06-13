import { orderBy } from 'lodash';

const languageAliases = {
    bash: 'shellscript',
};

export default function () {
    function options(languages = []) {
        return orderBy(
            languages.map((language) => (language === 'shellscript' ? 'bash' : language))
        );
    }

    function highlightLanguage(language) {
        return languageAliases[language] ?? language;
    }

    return { options, highlightLanguage };
}
