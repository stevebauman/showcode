import collect from 'collect.js';
import { some, includes } from 'lodash';

const FONT_STYLE = {
    NotSet: -1,
    None: 0,
    Italic: 1,
    Bold: 2,
    Underline: 4,
};

const FONT_STYLE_TO_CSS = {
    [FONT_STYLE.Bold]: { fontWeight: 'bold' },
    [FONT_STYLE.Italic]: { fontStyle: 'italic' },
    [FONT_STYLE.Underline]: { textDecoration: 'underline' },
};

const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

const addRegex = /{\+}/;
const removeRegex = /{\-}/;
const focusRegex = /{\*}/;
const hexRegex = /{#[0-9A-Fa-f]{3,6}}/;

export default function () {
    const escapeHtml = (html) => html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);

    const tokenFontStyle = (token) =>
        token.fontStyle > FONT_STYLE.None ? FONT_STYLE_TO_CSS[token.fontStyle] : {};

    const tokensContainRegex = (tokens, regex) =>
        collect(tokens).contains(({ content }) => regex.test(content));

    const tokensContainHex = (tokens) => tokensContainRegex(tokens, hexRegex);
    const tokensContainAdd = (tokens) => tokensContainRegex(tokens, addRegex);
    const tokensContainFocus = (tokens) => tokensContainRegex(tokens, focusRegex);
    const tokensContainRemove = (tokens) => tokensContainRegex(tokens, removeRegex);

    const tokenContainsAnnotation = (token) =>
        some([addRegex, removeRegex, focusRegex, hexRegex], (regex) => regex.test(token.content));

    const findHexInTokens = (tokens) => {
        const token = collect(tokens)
            .filter(({ content }) => hexRegex.test(content))
            .first();

        const hex = token.content?.match(hexRegex)[0] ?? null;

        if (!hex) {
            return;
        }

        return hex.slice(1, -1);
    };

    return {
        escapeHtml,
        findHexInTokens,
        tokenFontStyle,
        tokensContainHex,
        tokensContainAdd,
        tokensContainFocus,
        tokensContainRemove,
        tokenContainsAnnotation,
    };
}
