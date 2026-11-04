import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { stringify } from 'yaml';
import { assertReleaseVersion, compareReleaseVersions } from '../../app/utils/releaseNotes.js';
import { currentRelease, projectRoot, setPackageVersion } from './catalog.mjs';

export async function prepareRelease({
    root = projectRoot,
    version,
    title,
    description,
    announce = false,
}) {
    assertReleaseVersion(version);
    const previous = await currentRelease(root);
    if (compareReleaseVersions(version, previous.version) <= 0) {
        throw new Error(`Choose a version newer than ${previous.version}.`);
    }

    const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
    const filenames = git('ls-files', 'app/content/releases').split('\n');
    const previousFile =
        filenames.find((file) => file.endsWith(`/${previous.id}.md`)) ??
        filenames.find((file) => file.endsWith(`/${previous.version}.md`));
    if (!previousFile) throw new Error('Cannot find the previous release notes in Git.');
    const since = git('log', '-1', '--format=%H', '--diff-filter=A', '--', previousFile);
    const subjects = git('log', '--no-merges', '--format=%s', `${since}..HEAD`)
        .split('\n')
        .filter(Boolean);
    const changes = subjects.length
        ? subjects.map((subject) => `- ${subject}`).join('\n')
        : '- Describe the changes in this release.';
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(
        new Date()
    );
    const metadata = {
        id: version.replaceAll('.', '-'),
        version,
        date,
        title: title || `Showcode ${version}`,
        description: description || 'Improvements and fixes for your workspace.',
        announce,
    };
    const filename = path.join(root, 'app/content/releases', `${version}.md`);
    await writeFile(filename, `---\n${stringify(metadata)}---\n\n**Changed**\n\n${changes}\n`, {
        flag: 'wx',
    });
    await setPackageVersion(root, version);
    return filename;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    console.log(
        await prepareRelease({
            version: process.env.RELEASE_VERSION || process.argv[2],
            title: process.env.RELEASE_TITLE,
            description: process.env.RELEASE_DESCRIPTION,
            announce: process.env.RELEASE_ANNOUNCE === 'true',
        })
    );
}
