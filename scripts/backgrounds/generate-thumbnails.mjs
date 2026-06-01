import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import colors from 'tailwindcss/colors';

const THUMBNAIL_WIDTH = 96;
const THUMBNAIL_HEIGHT = 80;
const DEVICE_SCALE_FACTOR = 2;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const backgroundsFile = path.join(root, 'app/data/backgrounds.js');
const thumbnailsDir = path.join(root, 'public/background-thumbnails');

const legacyColors = {
    'blue-gray': colors.slate,
    'cool-gray': colors.gray,
};

function thumbnailFilename(id) {
    return `${id.replace(/[^a-zA-Z0-9_-]/g, '-')}.png`;
}

function kebabCase(value) {
    return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function mimeType(file) {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
    if (file.endsWith('.webp')) return 'image/webp';
    if (file.endsWith('.svg')) return 'image/svg+xml';

    return 'image/png';
}

async function fileToDataUrl(file) {
    const data = await fs.readFile(file);

    return `data:${mimeType(file)};base64,${data.toString('base64')}`;
}

async function loadBackgrounds() {
    const source = await fs.readFile(backgroundsFile, 'utf8');
    const importValues = new Map();
    const importPattern = /^import\s+(\w+)\s+from\s+['"](.+)['"];?$/gm;
    let match;

    while ((match = importPattern.exec(source))) {
        const [, variable, importPath] = match;
        const file = path.resolve(path.dirname(backgroundsFile), importPath);

        importValues.set(variable, await fileToDataUrl(file));
    }

    const body = source.replace(importPattern, '').replace('export default', 'return');
    const factory = new Function(...importValues.keys(), body);

    return factory(...importValues.values());
}

function colorValue(token) {
    token = token.replace(/^bg-gradient-to-[a-z]+-/, '');

    if (token === 'black') return '#000000';
    if (token === 'white') return '#ffffff';

    const parts = token.split('-');
    const shade = parts.pop();
    const name = parts.join('-');
    const palette = legacyColors[name] ?? colors[name];

    if (palette && palette[shade]) {
        return palette[shade];
    }

    throw new Error(`Unsupported Tailwind color: ${token}`);
}

function gradientStops(tokens) {
    const stops = [];

    for (const token of tokens) {
        if (token.startsWith('from-')) {
            stops[0] = colorValue(token.slice(5));
        } else if (token.startsWith('via-')) {
            stops.splice(1, 0, colorValue(token.slice(4)));
        } else if (token.startsWith('to-')) {
            stops.push(colorValue(token.slice(3)));
        }
    }

    return stops;
}

function tailwindGradientStyle(className) {
    const tokens = className.split(/\s+/).filter(Boolean);
    const stops = gradientStops(tokens);
    const direction = tokens.find((token) => token.startsWith('bg-gradient-to-'));
    const conic = tokens.find((token) => token.startsWith('bg-conic-to-'));
    const radial = tokens.find((token) => token === 'bg-radial' || token.startsWith('bg-radial-at-'));
    const positions = {
        b: 'bottom',
        bl: 'bottom left',
        br: 'bottom right',
        l: 'left',
        r: 'right',
        t: 'top',
        tl: 'top left',
        tr: 'top right',
    };

    if (direction) {
        const side = direction.replace('bg-gradient-to-', '');
        const cssDirection = positions[side] ?? side.replace(/-/g, ' ');

        return { backgroundImage: `linear-gradient(to ${cssDirection}, ${stops.join(', ')})` };
    }

    if (conic) {
        const side = conic.replace('bg-conic-to-', '');

        return {
            backgroundImage: `conic-gradient(from 180deg at ${positions[side] ?? side}, ${stops.join(', ')})`,
        };
    }

    if (radial) {
        const side = radial === 'bg-radial' ? 'center' : radial.replace('bg-radial-at-', '');

        return {
            backgroundImage: `radial-gradient(circle at ${positions[side] ?? side}, ${stops.join(', ')})`,
        };
    }

    return {};
}

function styleToCss(style) {
    return Object.entries(style)
        .map(([property, value]) => `${kebabCase(property)}: ${value}`)
        .join('; ');
}

function backgroundCss(background) {
    return styleToCss({
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...(background.class ? tailwindGradientStyle(background.class) : {}),
        ...(background.style ?? {}),
    });
}

async function launchBrowser() {
    try {
        return await chromium.launch({ headless: true });
    } catch (error) {
        const executablePath = path.join(
            process.env.HOME,
            'Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell'
        );

        if (!existsSync(executablePath)) {
            throw error;
        }

        return chromium.launch({ headless: true, executablePath });
    }
}

await fs.mkdir(thumbnailsDir, { recursive: true });

const backgrounds = await loadBackgrounds();
const browser = await launchBrowser();
const page = await browser.newPage({
    viewport: {
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
    },
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
});

await page.setContent(`
    <!doctype html>
    <html>
        <head>
            <style>
                html,
                body {
                    width: ${THUMBNAIL_WIDTH}px;
                    height: ${THUMBNAIL_HEIGHT}px;
                    margin: 0;
                    overflow: hidden;
                    background: transparent;
                }

                #thumbnail {
                    width: ${THUMBNAIL_WIDTH}px;
                    height: ${THUMBNAIL_HEIGHT}px;
                    overflow: hidden;
                }
            </style>
        </head>
        <body>
            <div id="thumbnail"></div>
        </body>
    </html>
`);

const thumbnail = page.locator('#thumbnail');

for (const background of backgrounds) {
    const file = path.join(thumbnailsDir, thumbnailFilename(background.id));

    await thumbnail.evaluate((node, css) => node.setAttribute('style', css), backgroundCss(background));
    await thumbnail.screenshot({ path: file, type: 'png' });
}

await browser.close();

console.log(`Generated ${backgrounds.length} background thumbnails in ${thumbnailsDir}`);
