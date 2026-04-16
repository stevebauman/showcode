import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sources, type ThemeSource } from './sources.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../../public/shiki/themes');

/**
 * Convert a GitHub blob URL to a raw content URL.
 *
 * https://github.com/user/repo/blob/branch/path/file.json
 * -> https://raw.githubusercontent.com/user/repo/branch/path/file.json
 */
function toRawGitHubUrl(blobUrl: string): string {
    return blobUrl
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
}

/**
 * Strip JSON comments and trailing commas for JSONC support.
 */
function parseJsonc(text: string): any {
    let result = '';
    let inString = false;
    let escape = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (escape) {
            result += char;
            escape = false;
            continue;
        }

        if (inString) {
            if (char === '\\') escape = true;
            if (char === '"') inString = false;
            result += char;
            continue;
        }

        if (char === '"') {
            inString = true;
            result += char;
            continue;
        }

        if (char === '/' && next === '/') {
            while (i < text.length && text[i] !== '\n') i++;
            result += '\n';
            continue;
        }

        if (char === '/' && next === '*') {
            i += 2;
            while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
            i++;
            continue;
        }

        result += char;
    }

    result = result.replace(/,\s*([\]}])/g, '$1');

    return JSON.parse(result);
}

/**
 * Cache downloaded VSIX zips to avoid re-downloading
 * for extensions that contain multiple themes.
 */
const vsixCache = new Map<string, any>();

/**
 * Download the VS Code marketplace VSIX and extract a theme JSON by path.
 */
async function fetchFromMarketplace(marketplace: { name: string; path: string }): Promise<any> {
    const AdmZip = (await import('adm-zip')).default;

    let zip = vsixCache.get(marketplace.name);

    if (!zip) {
        const [publisher, extId] = marketplace.name.split('.');

        const vsixUrl =
            `https://${publisher}.gallery.vsassets.io` +
            `/_apis/public/gallery/publisher/${publisher}` +
            `/extension/${extId}/latest` +
            `/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;

        const response = await fetch(vsixUrl);

        if (!response.ok) {
            throw new Error(`Failed to download VSIX for ${marketplace.name}: ${response.status}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        zip = new AdmZip(buffer);
        vsixCache.set(marketplace.name, zip);
    }

    const entry = zip.getEntry(marketplace.path);

    if (!entry) {
        const available = zip.getEntries()
            .map((e: any) => e.entryName)
            .filter((n: string) => n.endsWith('.json') && n.includes('theme'))
            .join('\n    ');

        throw new Error(
            `File "${marketplace.path}" not found in VSIX for ${marketplace.name}.\n    Available theme files:\n    ${available}`,
        );
    }

    const raw = String(entry.getData());

    return parseJsonc(raw);
}

/**
 * Clean up a theme JSON to only include the fields shiki needs.
 */
function cleanupTheme(theme: any, source: ThemeSource): any {
    const cleaned: any = {};

    for (const key of ['name', 'displayName', 'type', 'colors', 'fg', 'bg', 'tokenColors', 'semanticHighlighting', 'semanticTokenColors']) {
        if (theme[key] !== undefined) {
            cleaned[key] = theme[key];
        }
    }

    // Normalize: use settings as tokenColors if needed (older format).
    cleaned.tokenColors ??= theme.settings;
    delete cleaned.settings;

    cleaned.name = source.name;

    if (source.type) {
        cleaned.type = source.type;
    } else if (!cleaned.type) {
        const bg = cleaned.colors?.['editor.background'] ?? '';
        if (bg) {
            const hex = bg.replace('#', '').slice(0, 6);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            cleaned.type = luminance > 0.5 ? 'light' : 'dark';
        } else {
            cleaned.type = source.name.includes('light') ? 'light' : 'dark';
        }
    }

    return cleaned;
}

async function fetchTheme(source: ThemeSource): Promise<any> {
    if (source.marketplace) {
        return fetchFromMarketplace(source.marketplace);
    }

    const url = toRawGitHubUrl(source.source);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${source.name} from ${url}: ${response.status}`);
    }

    const text = await response.text();

    return parseJsonc(text);
}

async function main() {
    fs.mkdirSync(outputDir, { recursive: true });

    console.log(`Fetching ${sources.length} themes...\n`);

    const fetchedNames: string[] = [];

    for (const source of sources) {
        try {
            process.stdout.write(`  Fetching ${source.name}...`);
            const raw = await fetchTheme(source);
            const theme = cleanupTheme(raw, source);
            const outPath = path.join(outputDir, `${source.name}.json`);
            fs.writeFileSync(outPath, JSON.stringify(theme, null, 2) + '\n');
            fetchedNames.push(source.name);
            console.log(` ✓`);
        } catch (e: any) {
            console.error(` ✗ ${e.message}`);
        }
    }

    // Generate the manifest file containing all custom theme IDs.
    const manifestPath = path.join(outputDir, 'all.json');
    fs.writeFileSync(manifestPath, JSON.stringify(fetchedNames.sort()) + '\n');

    console.log(`\nDone. ${fetchedNames.length}/${sources.length} themes written to ${outputDir}`);
    console.log(`Manifest written to ${manifestPath}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
