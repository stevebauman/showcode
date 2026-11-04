import { parseRelease, sortReleases } from '@/utils/releaseNotes';

const sources = import.meta.glob('./releases/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

export default sortReleases(
    Object.entries(sources).map(([filename, source]) => parseRelease(source, filename))
);
