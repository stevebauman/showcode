import { appendResponseHeader } from 'h3';
import { defineNitroPlugin } from 'nitropack/runtime';
import { parseURL } from 'ufo';

const SPA_ROUTES: Record<string, { title: string; highlight: string; description: string }> = {
    '/': {
        title: 'Create beautiful',
        highlight: 'images of code',
        description: 'A free, open-source code screenshot designer.',
    },
    '/generator': {
        title: 'Generate beautiful',
        highlight: 'code screenshots',
        description: 'Render code images programmatically with the Showcode API.',
    },
};

const SITE_URL = 'https://showcode.app';
const COMPONENT = 'Default';
const WIDTH = 1200;
const HEIGHT = 600;

function encodeSegment(value: string): string {
    return Buffer.from(value, 'utf8')
        .toString('base64')
        .replace(/=+$/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '~');
}

function buildOgImagePath(path: string, props: Record<string, string>): string {
    const segments = [`c_${COMPONENT}`];

    for (const [key, value] of Object.entries(props)) {
        segments.push(`${key}_${encodeURIComponent(value).replace(/%20/g, '+')}`);
    }

    segments.push(`p_${encodeSegment(JSON.stringify(path))}`);

    return `/_og/s/${segments.join(',')}.png`;
}

export default defineNitroPlugin((nitro) => {
    if (process.env.IS_DESKTOP === 'true') return;

    nitro.hooks.hook('render:html', (html, ctx) => {
        const path = parseURL(ctx.event.path).pathname;
        const props = SPA_ROUTES[path];

        if (!props) return;

        const ogPath = buildOgImagePath(path, props);
        const absoluteUrl = `${SITE_URL}${ogPath}`;

        html.head.push(
            `<meta property="og:image" content="${absoluteUrl}">`,
            `<meta property="og:image:type" content="image/png">`,
            `<meta property="og:image:width" content="${WIDTH}">`,
            `<meta property="og:image:height" content="${HEIGHT}">`,
            `<meta name="twitter:card" content="summary_large_image">`,
            `<meta name="twitter:image" content="${absoluteUrl}">`,
            `<meta name="twitter:image:width" content="${WIDTH}">`,
            `<meta name="twitter:image:height" content="${HEIGHT}">`,
        );

        if (import.meta.prerender) {
            appendResponseHeader(ctx.event, 'x-nitro-prerender', ogPath.replace(/,/g, '%2C'));
        }
    });
});
