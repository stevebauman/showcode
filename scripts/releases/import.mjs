import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { stringify } from 'yaml';
import { parseRelease, compareReleaseVersions } from '../../app/utils/releaseNotes.js';
import { projectRoot, readReleases, setPackageVersion } from './catalog.mjs';

export async function importRelease(root, metadata) {
    const { id, version, publishedAt, title, description, announce, content } = metadata;
    if (typeof content !== 'string' || !content.trim()) {
        throw new Error('Release notes cannot be empty.');
    }
    const source = `---\n${stringify({ id, version, date: publishedAt, title, description, announce })}---\n\n${content}\n`;
    const release = parseRelease(source);
    const releases = await readReleases(root);
    const existing = releases.find((entry) => entry.version === version);
    const fields = ['id', 'publishedAt', 'title', 'description', 'announce', 'content'];
    if (existing && fields.some((field) => existing[field] !== release[field])) {
        throw new Error(`Release ${version} already exists with different notes.`);
    }
    if (!existing) {
        await writeFile(path.join(root, 'app/content/releases', `${version}.md`), source);
    }
    const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
    if (compareReleaseVersions(version, pkg.version) > 0) await setPackageVersion(root, version);
    return release;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const metadata = JSON.parse(await readFile(process.argv[2], 'utf8'));
    await importRelease(projectRoot, metadata);
    console.log(`Imported release ${metadata.version}`);
}
