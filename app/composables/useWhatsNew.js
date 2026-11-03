import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import releases from '@/content/releases';
import useDesktop from './useDesktop';

function compareVersions(left, right) {
    return left.split('-')[0].localeCompare(right.split('-')[0], 'en', { numeric: true });
}

export default function () {
    const desktop = useDesktop();
    const open = ref(false);
    const release = ref(null);
    const version = ref(null);
    const showAfterUpdate = ref(true);
    const availableReleases = computed(() =>
        version.value
            ? releases.filter((entry) => compareVersions(entry.version, version.value) <= 0)
            : []
    );

    async function acknowledge() {
        await desktop.invoke('acknowledge-release-notes', {
            releaseIds: availableReleases.value.map((entry) => entry.id),
            showAfterUpdate: showAfterUpdate.value,
        });
    }

    async function initialize(hasExistingProjects) {
        if (!desktop) return;

        try {
            const state = await desktop.invoke('get-release-notes-state');
            version.value = state.version;
            showAfterUpdate.value = state.showAfterUpdate;
            release.value = availableReleases.value[0] ?? null;

            if (!hasExistingProjects && state.seenReleases.length === 0) {
                await acknowledge();
                return;
            }

            const announcement = availableReleases.value.find(
                (entry) => entry.announce && !state.seenReleases.includes(entry.id)
            );

            if (showAfterUpdate.value && announcement) {
                release.value = announcement;
                open.value = true;
            }
        } catch {
            toast.error('Unable to load your release note preferences.');
        }
    }

    function show() {
        release.value = availableReleases.value[0] ?? null;
        open.value = Boolean(release.value);

        return open.value;
    }

    async function dismiss() {
        open.value = false;

        try {
            await acknowledge();
        } catch {
            toast.error('Unable to save your release note preferences.');
        }
    }

    return { open, release, availableReleases, showAfterUpdate, initialize, show, dismiss };
}
