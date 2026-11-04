import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rename, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { parseRelease, sortReleases } from '../../app/utils/releaseNotes.js';
import { currentRelease } from '../../scripts/releases/catalog.mjs';
import { importRelease } from '../../scripts/releases/import.mjs';

test('one Markdown entry supplies the announcement and changelog', () => {
    const release = parseRelease(`---
id: polished-workspace
version: 3.1.0
date: 2026-11-04
title: A polished workspace
description: More room for your code.
announce: true
image: /images/releases/workspace.svg
imageAlt: The Showcode workspace
---

**Changed**

- Refined the editor controls.
`);
    assert.equal(release.date, 'November 4, 2026');
    assert.equal(release.announce, true);
    assert.equal(release.content, '**Changed**\n\n- Refined the editor controls.');
});

test('release entries reject malformed dates, versions, and duplicate identities', () => {
    const markdown =
        '---\nid: fixes\nversion: 3.0.1\ndate: 2026-11-04\ntitle: Fixes\ndescription: Small fixes\nannounce: false\n---\n\n**Fixed**\n\n- Editor layout.';
    assert.throws(() => parseRelease(markdown.replace('2026-11-04', '2026-02-31')), /date/);
    assert.throws(() => parseRelease(markdown.replace('3.0.1', '3.0.1-beta.1')), /stable version/);
    assert.throws(
        () => parseRelease(markdown.replace('announce: false', 'announce: maybe')),
        /announce/
    );
    assert.throws(() => sortReleases([parseRelease(markdown), parseRelease(markdown)]), /unique/);
    assert.deepEqual(
        sortReleases([
            { id: 'a', version: '3.9.0' },
            { id: 'b', version: '3.10.0' },
        ]).map((r) => r.version),
        ['3.10.0', '3.9.0']
    );
});

test('imports GitHub Markdown into the app and synchronizes both versions', async (t) => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'showcode-import-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    await mkdir(path.join(root, 'app/content/releases'), { recursive: true });
    await writeFile(path.join(root, 'package.json'), JSON.stringify({ version: '3.0.0' }));
    await writeFile(
        path.join(root, 'package-lock.json'),
        JSON.stringify({ version: '3.0.0', packages: { '': { version: '3.0.0' } } })
    );
    const metadata = {
        id: 'github-release-42',
        version: '3.0.1',
        publishedAt: '2026-11-04',
        title: 'Smoother editing',
        description: 'Showcode 3.0.1 is now available.',
        announce: true,
        content:
            "## What's Changed\n* Fix editor transitions by @stevebauman in https://github.com/stevebauman/showcode/pull/1\n\n**Full Changelog**: https://github.com/stevebauman/showcode/compare/v3.0.0...v3.0.1",
    };
    await importRelease(root, metadata);
    await rename(
        path.join(root, 'app/content/releases/3.0.1.md'),
        path.join(root, 'app/content/releases/smoother-editing.md')
    );
    await importRelease(root, metadata);
    assert.deepEqual(await readdir(path.join(root, 'app/content/releases')), [
        'smoother-editing.md',
    ]);
    const release = await currentRelease(root);
    assert.equal(release.version, '3.0.1');
    assert.equal(release.id, 'github-release-42');
    assert.equal(release.content, metadata.content);
    assert.equal(
        JSON.parse(await readFile(path.join(root, 'package-lock.json'))).packages[''].version,
        '3.0.1'
    );
    await importRelease(root, metadata);
    await assert.rejects(
        importRelease(root, { ...metadata, content: 'Changed later' }),
        /different notes/
    );
    await assert.rejects(
        importRelease(root, { ...metadata, title: 'Changed title' }),
        /different notes/
    );
    await assert.rejects(importRelease(root, { ...metadata, content: undefined }), /empty/);
    await importRelease(root, { ...metadata, id: 'github-release-41', version: '3.0.0' });
    assert.equal(JSON.parse(await readFile(path.join(root, 'package.json'))).version, '3.0.1');
});
