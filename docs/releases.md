# Releasing Showcode

## Publish a release

1. Merge your changes into `master`.
2. Open [New release](https://github.com/stevebauman/showcode/releases/new) in **Showcode**.
3. Create a new stable tag such as `v3.0.1`, targeting `master`.
4. Enter a title, click **Generate release notes**, and review the resulting Markdown.
5. Click **Publish release**. Do not mark it as a prerelease.

Publishing is the approval to ship. Saving a draft does nothing. A new version must be greater than the current desktop version; do not move an existing release tag.

The workflow passes the release ID to showcode-app. The desktop workflow reads its tag, title, publication date, and body, resolves the exact tagged commit, and checks that it belongs to Showcode master. Package versions are derived automatically from the release tag; no manual package or Markdown changes are needed.

The desktop repository records the version, renderer commit, and a snapshot of the release metadata in `releases/VERSION.json`. Builds inject those notes into the tagged renderer checkout without changing the source tag. The same Markdown appears in the desktop changelog and What's New dialog, including GitHub's headings, links, and contributor lists. Announcements are identified by the GitHub release ID so they appear once per installation.

After every platform builds successfully, the workflow verifies installers and updater manifests, uploads them to a draft desktop release, syncs the notes and package version back to Showcode master, and publishes the desktop release automatically. The source release appears immediately; installers follow when the build completes. The web changelog updates through the normal web deployment after the notes-sync commit.

## Failures and retries

If a build or validation fails, the desktop release is not published. Prefer **Re-run failed jobs** on the original workflow run. To start a fresh run, use **showcode-app → Actions → Build desktop release** and supply the original numeric GitHub release ID (available from the release API or original workflow inputs).

Retries must use the original release body and tagged renderer commit. If either changes after the snapshot is recorded, preparation refuses to overwrite it. Fix the build problem and retry the original run, or create a new version for changed product code/notes. A previously published desktop version cannot be rebuilt or overwritten.

If web-note synchronization fails after the installers upload, the desktop release remains a draft; retry the failed job after correcting the error. If publishing succeeds but the job loses its connection, check the desktop release page before retrying.

## Release notes in the application

`app/content/releases/*.md` is generated from published releases. Each entry has YAML metadata followed by the original release body. `app/content/changelog.md` preserves the older, pre-3.0 archive. Do not edit generated entries to revise an already-published release; ship corrections in the next version.

To preview a saved metadata snapshot locally:

```sh
npm run release:import -- /path/to/metadata.json
npm run release:check
```

This edits local files only. The desktop workflow runs the same import during each platform build and the web synchronization step. A historical import never lowers the current package version.

## GitHub configuration

Use the existing **Showcode Release Bot**, installed only on `stevebauman/showcode` and `stevebauman/showcode-app`. Its Contents read/write permission is used to record desktop releases and synchronize web notes; Actions read/write dispatches desktop builds. The previous Pull requests permission is no longer needed by this flow and may be removed from the App.

Both repositories need:

| Kind             | Name                      | Value                     |
| ---------------- | ------------------------- | ------------------------- |
| Actions variable | `RELEASE_APP_ID`          | GitHub App ID             |
| Actions secret   | `RELEASE_APP_PRIVATE_KEY` | Generated PEM private key |

The bot must be allowed to push the mechanical commits to **both master branches** and create desktop `v*` tags. If protected-branch/tag rules are introduced, configure the bot's access accordingly; the workflow never disables those rules.

Keep the existing Apple signing secrets in showcode-app: `APPLE_ID`, `APPLE_ID_PASSWORD`, `APPLE_TEAM_ID`, `CSC_LINK` (base64 P12), and `CSC_KEY_PASSWORD`.

Deploy the updated **showcode-app workflow first**, then the Showcode release trigger and importer. The old Prepare release action and release-PR trigger are removed. No existing releases are replayed by merging this setup.
