# Releasing Showcode

Release metadata and notes live together in `app/content/releases/*.md`. These entries supply the in-app What's New dialog, the recent changelog, and the desktop GitHub release. `app/content/changelog.md` contains only the older, pre-3.0 history.

## Normal release flow

1. Merge feature and fix PRs into `master` normally.
2. In **Showcode → Actions → Prepare release**, choose a new stable version such as `3.0.1`. Add a title and short description. Enable **announce** for releases that should open What's New automatically; leave it off for maintenance updates.
3. The action opens `release/v3.0.1`. Review the Markdown entry and replace the generated commit bullets with useful release notes. Add an optional image if appropriate.
4. Merge the release PR after checks pass. This queues the desktop build with the exact merged Showcode SHA. Later web commits cannot slip into that build.
5. Wait for **showcode-app → Build desktop release**. It synchronizes the submodule and desktop version, records a commit/tag, builds all platforms, verifies installers and updater manifests, and creates a draft GitHub release.
6. Download and test an installer from the draft, then click **Publish release**. The tested files are the files users receive; publishing does not rebuild them.

Releases are never automatically published to users. Ordinary merges do not queue desktop releases; only merged branches whose names start with `release/v` do.

## Release entry

```markdown
---
id: 3-0-1
version: 3.0.1
date: 2026-11-04
title: Smoother editing
description: Small improvements to your workspace.
announce: false
image: /images/releases/3.0.1.png
imageAlt: The improved Showcode editor
---

**Changed**

- Improved the editor opening animation.

**Fixed**

- Fixed an issue with …
```

Images are optional. Place them in `public/images/releases/`, use the `/images/releases/...` URL, and include `imageAlt`. Keep `id` stable after shipping: desktop installations use it to remember which announcements they have seen. Use **Added**, **Changed**, **Fixed**, or **Removed** sections with bullet points so the changelog can display them.

The current version is checked against the newest entry. A release must use a new, increasing `major.minor.patch` version. This workflow currently publishes stable releases only.

To prepare a release locally instead of using Actions:

```sh
npm run release:prepare -- 3.0.1
npm run release:check
npm run test:releases
```

This edits files only. It does not commit, push, create a PR, or start a release. Open a PR from `release/v3.0.1` to use the automated handoff.

## GitHub configuration

Create a GitHub App (for example, **Showcode Release Bot**) and install it only on `stevebauman/showcode` and `stevebauman/showcode-app`. Webhooks can be disabled; the workflows call GitHub directly.

Give the App these repository permissions:

| Permission    | Access         | Purpose                                                                             |
| ------------- | -------------- | ----------------------------------------------------------------------------------- |
| Contents      | Read and write | Create release branches, synchronize the desktop submodule/version, and create tags |
| Pull requests | Read and write | Open release PRs in Showcode                                                        |
| Actions       | Read and write | Dispatch the desktop build workflow                                                 |
| Metadata      | Read           | GitHub's required repository access                                                 |

In **both repositories**, configure:

| Kind             | Name                      | Value                                  |
| ---------------- | ------------------------- | -------------------------------------- |
| Actions variable | `RELEASE_APP_ID`          | The GitHub App ID                      |
| Actions secret   | `RELEASE_APP_PRIVATE_KEY` | The complete generated PEM private key |

Each workflow requests only the repository and permissions it needs. The regular `GITHUB_TOKEN` handles draft release uploads inside showcode-app.

Keep the existing Apple signing secrets in showcode-app: `APPLE_ID`, `APPLE_ID_PASSWORD`, `APPLE_TEAM_ID`, `CSC_LINK`, and `CSC_KEY_PASSWORD`. `CSC_LINK` must remain the base64-encoded P12 certificate expected by the build workflow.

Allow the App to push the mechanical release commit to **showcode-app/master** and create its `v*` tags. If branch/tag rules require PRs, signatures, or status checks before every push, grant this App a targeted bypass for the desktop release path. Showcode itself still uses reviewed PRs and needs no master bypass. Also permit the actions used in these workflows under the repository's Actions policy.

## First-time rollout and recovery

Merge/configure **showcode-app first**, then Showcode. The first configuration PR should use an ordinary branch name, not `release/v…`; it does not represent a new product release. Keep the current 3.0.0 version until preparing the next release.

If dispatch fails, re-run **Queue desktop release** after correcting the App configuration. If a platform build fails, choose **Re-run failed jobs** on the existing desktop workflow run. This retains the approved commit and successful platform artifacts.

For a full rebuild, manually run **Build desktop release** with the original approved Showcode SHA. A published version cannot be rebuilt or overwritten; prepare a new version instead. If desktop master has advanced since the failed run, prefer re-running its failed jobs rather than starting from a different master snapshot.

Draft creation and uploading happen only after all platform jobs succeed. If uploading fails, retry the failed job: existing draft assets are replaced, but a published release is never modified.
