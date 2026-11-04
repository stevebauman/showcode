import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, expect, it } from 'vitest';
import ModalChangelog from '~/components/ModalChangelog.vue';
import releases from '~/content/releases';

afterEach(() => {
    document.body.innerHTML = '';
});

it('renders GitHub release Markdown and lists bundled versions only once', async () => {
    const wrapper = await mountSuspended(ModalChangelog, {
        props: {
            modelValue: true,
            releases: [
                releases.find((release) => release.version === '3.0.0'),
                {
                    id: 'github-release-42',
                    version: '3.0.1',
                    title: 'Smoother editing',
                    date: 'November 4, 2026',
                    content:
                        "## What's Changed\n* Fix transitions by @stevebauman in [#42](https://github.com/stevebauman/showcode/pull/42)\n\n**Full Changelog**: https://github.com/stevebauman/showcode/compare/v3.0.0...v3.0.1",
                },
            ],
        },
        attachTo: document.body,
    });

    expect(
        [...document.body.querySelectorAll('h2')].map((heading) => heading.textContent)
    ).toContain("What's Changed");
    expect(document.body.querySelector('li').textContent).toContain('@stevebauman');
    expect(document.body.querySelector('a').getAttribute('href')).toBe(
        'https://github.com/stevebauman/showcode/pull/42'
    );
    const titles = [...document.body.querySelectorAll('h3')].map((heading) => heading.textContent);
    expect(titles).toContain('Smoother editing');
    expect(titles.indexOf('Smoother editing')).toBeLessThan(titles.indexOf('A refreshed workspace'));
    expect(titles.filter((title) => title === 'A refreshed workspace')).toHaveLength(1);
    wrapper.unmount();
});
