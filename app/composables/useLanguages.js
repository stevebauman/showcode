import { orderBy } from 'lodash';

const languageAliases = {
    bash: 'shellscript',
    dockerfile: 'docker',
};

export default function () {
    function options(languages = []) {
        return orderBy(
            languages.map((language) => {
                return (
                    {
                        docker: 'dockerfile',
                        shellscript: 'bash',
                    }[language] ?? language
                );
            })
        );
    }

    function highlightLanguage(language) {
        return languageAliases[language] ?? language;
    }

    return { options, highlightLanguage };
}
