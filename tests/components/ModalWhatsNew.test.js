import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, expect, it } from 'vitest';
import ModalWhatsNew from '~/components/ModalWhatsNew.vue';
import releases from '~/content/releases';

afterEach(() => {
    document.body.innerHTML = '';
});

it('shows the bundled highlights and offers continue and full changelog actions', async () => {
    const wrapper = await mountSuspended(ModalWhatsNew, {
        props: {
            modelValue: true,
            release: releases.find((release) => release.version === '3.0.0'),
        },
        attachTo: document.body,
    });

    expect(document.body.textContent).toContain('A refreshed workspace');
    expect(document.body.textContent).toContain('floating editor and preview toolbars');
    expect(document.body.textContent).toContain('a collapsible inspector');
    expect(document.body.querySelector('img').getAttribute('alt')).toContain('floating toolbars');

    const buttons = [...document.body.querySelectorAll('button')];
    buttons.find((button) => button.textContent === 'Full changelog').click();
    expect(wrapper.emitted('changelog')).toHaveLength(1);
    buttons.find((button) => button.textContent === 'Continue').click();
    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    wrapper.unmount();
});

it('toggles the update preference through its checkbox and label', async () => {
    const wrapper = await mountSuspended(ModalWhatsNew, {
        props: {
            modelValue: true,
            release: releases.find((release) => release.version === '3.0.0'),
            showAfterUpdate: true,
        },
        attachTo: document.body,
    });

    document.body.querySelector('input[type="checkbox"]').click();
    expect(wrapper.emitted('update:showAfterUpdate')).toEqual([[false]]);

    await wrapper.setProps({ showAfterUpdate: false });
    document.body.querySelector('label').click();
    expect(wrapper.emitted('update:showAfterUpdate')).toEqual([[false], [true]]);
    wrapper.unmount();
});
