import { afterEach, describe, expect, it, vi } from 'vitest';
import useWhatsNew from '~/composables/useWhatsNew';
import releases from '~/content/releases';

afterEach(() => {
    delete window.electronIpc;
    vi.restoreAllMocks();
});

describe('release announcements', () => {
    it('opens unseen release notes for an existing installation', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                version: '3.0.0',
                seenReleases: [],
                showAfterUpdate: true,
            }),
        };
        const whatsNew = useWhatsNew();

        await whatsNew.initialize(true);

        expect(whatsNew.open.value).toBe(true);
        expect(whatsNew.release.value.id).toBe('workspace-refresh');
    });

    it('acknowledges the release and preference when dismissed', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                version: '3.0.0-local.0',
                seenReleases: [],
                showAfterUpdate: true,
            }),
        };
        const whatsNew = useWhatsNew();
        await whatsNew.initialize(true);
        whatsNew.showAfterUpdate.value = false;

        await whatsNew.dismiss();

        expect(whatsNew.open.value).toBe(false);
        expect(window.electronIpc.invoke).toHaveBeenLastCalledWith('acknowledge-release-notes', {
            releaseIds: ['workspace-refresh'],
            showAfterUpdate: false,
        });
    });

    it('keeps a fresh installation on its new-project screen', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                version: '3.0.0',
                seenReleases: [],
                showAfterUpdate: true,
            }),
        };
        const whatsNew = useWhatsNew();

        await whatsNew.initialize(false);

        expect(whatsNew.open.value).toBe(false);
        expect(window.electronIpc.invoke).toHaveBeenLastCalledWith('acknowledge-release-notes', {
            releaseIds: ['workspace-refresh'],
            showAfterUpdate: true,
        });
    });

    it('does not repeat acknowledged notes after another launch or a patch update', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                version: '3.0.1',
                seenReleases: ['workspace-refresh'],
                showAfterUpdate: true,
            }),
        };
        const whatsNew = useWhatsNew();

        await whatsNew.initialize(true);

        expect(whatsNew.open.value).toBe(false);
        expect(whatsNew.show()).toBe(true);
    });

    it('does not show notes for a newer app version', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                version: '2.0.20',
                seenReleases: [],
                showAfterUpdate: true,
            }),
        };
        const whatsNew = useWhatsNew();

        await whatsNew.initialize(true);

        expect(whatsNew.open.value).toBe(false);
        expect(whatsNew.show()).toBe(false);
    });

    it('keeps manual access available when automatic display is disabled', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                version: '3.0.0',
                seenReleases: [],
                showAfterUpdate: false,
            }),
        };
        const whatsNew = useWhatsNew();

        await whatsNew.initialize(true);

        expect(whatsNew.open.value).toBe(false);
        expect(whatsNew.show()).toBe(true);
    });

    it('keeps maintenance notes accessible without announcing them', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                version: '3.0.0',
                seenReleases: [],
                showAfterUpdate: true,
            }),
        };
        const whatsNew = useWhatsNew();
        releases[0].announce = false;

        try {
            await whatsNew.initialize(true);

            expect(whatsNew.open.value).toBe(false);
            expect(whatsNew.show()).toBe(true);
        } finally {
            releases[0].announce = true;
        }
    });

    it('leaves the browser version using its existing changelog', async () => {
        const whatsNew = useWhatsNew();

        await whatsNew.initialize(true);

        expect(whatsNew.open.value).toBe(false);
        expect(whatsNew.show()).toBe(false);
    });
});
