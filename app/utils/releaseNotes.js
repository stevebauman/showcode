import { parse } from 'yaml';

export function compareReleaseVersions(left, right) {
    const a = left.split('.').map(Number);
    const b = right.split('.').map(Number);
    return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

export function assertReleaseVersion(version) {
    if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
        throw new Error('Use a stable version such as 3.0.1.');
    }
}

export function parseRelease(source, filename = 'Release notes') {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) throw new Error(`${filename}: YAML front matter is required.`);
    const metadata = parse(match[1]);
    const content = match[2].trim();

    for (const field of ['id', 'version', 'date', 'title', 'description']) {
        if (typeof metadata?.[field] !== 'string' || !metadata[field].trim()) {
            throw new Error(`${filename}: ${field} is required.`);
        }
    }

    assertReleaseVersion(metadata.version);
    if (!/^[a-z0-9-]+$/.test(metadata.id)) throw new Error(`${filename}: Invalid release ID.`);
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) ||
        !Number.isFinite(Date.parse(metadata.date)) ||
        new Date(metadata.date).toISOString().slice(0, 10) !== metadata.date
    ) {
        throw new Error(`${filename}: Use a valid YYYY-MM-DD date.`);
    }
    if (typeof metadata.announce !== 'boolean') {
        throw new Error(`${filename}: announce must be true or false.`);
    }
    if (!content) throw new Error(`${filename}: Release notes cannot be empty.`);
    if (
        metadata.image &&
        (typeof metadata.image !== 'string' ||
            !metadata.image.startsWith('/images/') ||
            metadata.image.split('/').includes('..') ||
            !metadata.imageAlt)
    ) {
        throw new Error(`${filename}: Images need a /images/ path and imageAlt.`);
    }

    return {
        ...metadata,
        publishedAt: metadata.date,
        date: new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
            timeZone: 'UTC',
        }).format(new Date(metadata.date)),
        content,
    };
}

export function sortReleases(releases) {
    for (const field of ['id', 'version']) {
        if (new Set(releases.map((release) => release[field])).size !== releases.length) {
            throw new Error(`Release ${field}s must be unique.`);
        }
    }
    return releases.sort((a, b) => compareReleaseVersions(b.version, a.version));
}
