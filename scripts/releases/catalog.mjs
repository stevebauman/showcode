import { readFile, readdir, access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseRelease, sortReleases } from '../../app/utils/releaseNotes.js';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

export async function readReleases(root = projectRoot) {
    const directory = path.join(root, 'app/content/releases');
    const files = (await readdir(directory)).filter((file) => file.endsWith('.md'));
    const releases = await Promise.all(
        files.map(async (file) => {
            const release = parseRelease(await readFile(path.join(directory, file), 'utf8'), file);
            if (release.image) await access(path.join(root, 'public', release.image));
            return release;
        })
    );
    return sortReleases(releases);
}

export async function currentRelease(root = projectRoot) {
    const releases = await readReleases(root);
    const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
    const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
    if (releases[0]?.version !== pkg.version) {
        throw new Error('The newest release notes must match package.json.');
    }
    if (lock.version !== pkg.version || lock.packages[''].version !== pkg.version) {
        throw new Error('The package lock version must match package.json.');
    }
    return releases[0];
}

export async function setPackageVersion(root, version) {
    for (const filename of ['package.json', 'package-lock.json']) {
        const file = path.join(root, filename);
        const source = await readFile(file, 'utf8');
        const data = JSON.parse(source);
        data.version = version;
        if (filename === 'package-lock.json') data.packages[''].version = version;
        const indentation = source.match(/\n( +)"/)?.[1].length ?? 4;
        await writeFile(file, `${JSON.stringify(data, null, indentation)}\n`);
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const release = await currentRelease();
    if (process.argv[2] === 'json') console.log(JSON.stringify(release));
    else console.log(`Release notes verified: ${release.version}`);
}
