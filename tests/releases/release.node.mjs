import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { parseRelease, sortReleases, releaseChangelog } from '../../app/utils/releaseNotes.js';
import { currentRelease } from '../../scripts/releases/catalog.mjs';
import { prepareRelease } from '../../scripts/releases/prepare.mjs';

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
    assert.equal(
        releaseChangelog([release]),
        '## November 4, 2026 — Version 3.1.0\n\n**Changed**\n\n- Refined the editor controls.'
    );
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

test('preparing a release gathers commits and updates both package versions without committing', async (t) => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'showcode-prepare-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    await mkdir(path.join(root, 'app/content/releases'), { recursive: true });
    await writeFile(path.join(root, 'package.json'), JSON.stringify({ version: '3.0.0' }));
    await writeFile(
        path.join(root, 'package-lock.json'),
        JSON.stringify({ version: '3.0.0', packages: { '': { version: '3.0.0' } } })
    );
    await writeFile(
        path.join(root, 'app/content/releases/3.0.0.md'),
        '---\nid: 3-0-0\nversion: 3.0.0\ndate: 2026-11-03\ntitle: Showcode 3\ndescription: A fresh workspace\nannounce: true\n---\n\n**Added**\n\n- Floating controls.'
    );
    const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
    git('init', '-b', 'master');
    git('config', 'commit.gpgsign', 'false');
    git('config', 'user.name', 'Release Test');
    git('config', 'user.email', 'release@example.test');
    git('add', '.');
    git('commit', '-m', 'Release 3.0.0');
    await writeFile(path.join(root, 'change.txt'), 'fixed');
    git('add', '.');
    git('commit', '-m', 'Fix the editor opening transition');
    const before = git('rev-parse', 'HEAD');

    await prepareRelease({ root, version: '3.0.1', title: 'Smoother editing', announce: false });

    const release = await currentRelease(root);
    assert.equal(release.version, '3.0.1');
    assert.equal(release.title, 'Smoother editing');
    assert.match(release.content, /Fix the editor opening transition/);
    assert.equal(
        JSON.parse(await readFile(path.join(root, 'package-lock.json'))).packages[''].version,
        '3.0.1'
    );
    assert.equal(git('rev-parse', 'HEAD'), before);
    await assert.rejects(prepareRelease({ root, version: '3.0.1' }), /newer/);
});
