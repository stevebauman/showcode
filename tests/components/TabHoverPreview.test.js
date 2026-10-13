import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TabHoverPreview from '~/components/TabHoverPreview.vue';

let wrapper;

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
    wrapper?.unmount();
    vi.useRealTimers();
});

describe('TabHoverPreview', () => {
    it('previews a project after a short hover without navigating', async () => {
        wrapper = mount(TabHoverPreview, {
            attachTo: document.body,
            props: { name: 'Example', image: 'data:image/png;base64,preview', modified: true },
            slots: { default: '<button>Example</button>' },
        });

        await wrapper
            .get('[data-grace-area-trigger]')
            .trigger('pointerenter', { pointerType: 'mouse' });
        await vi.advanceTimersByTimeAsync(449);

        expect(document.querySelector('[data-tab-preview]')).toBeNull();

        await vi.advanceTimersByTimeAsync(1);

        const preview = document.querySelector('[data-tab-preview]');

        expect(preview.textContent).toContain('Example');
        expect(preview.textContent).toContain('Unsaved changes');
        expect(preview.querySelector('img').getAttribute('src')).toBe(
            'data:image/png;base64,preview'
        );
        expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('does not preview the selected tab or tabs during a drag', async () => {
        wrapper = mount(TabHoverPreview, {
            attachTo: document.body,
            props: { disabled: true },
            slots: { default: '<button>Example</button>' },
        });

        await wrapper
            .get('[data-grace-area-trigger]')
            .trigger('pointerenter', { pointerType: 'mouse' });
        await vi.advanceTimersByTimeAsync(500);

        expect(document.querySelector('[data-tab-preview]')).toBeNull();

        await wrapper.setProps({ disabled: false });
        await vi.advanceTimersByTimeAsync(500);

        expect(document.querySelector('[data-tab-preview]')).toBeNull();
    });

    it('cancels a preview when the pointer leaves before the delay', async () => {
        wrapper = mount(TabHoverPreview, {
            attachTo: document.body,
            slots: { default: '<button>Example</button>' },
        });

        await wrapper
            .get('[data-grace-area-trigger]')
            .trigger('pointerenter', { pointerType: 'mouse' });
        await vi.advanceTimersByTimeAsync(200);
        await wrapper
            .get('[data-grace-area-trigger]')
            .trigger('pointerleave', { pointerType: 'mouse' });
        await vi.advanceTimersByTimeAsync(500);

        expect(document.querySelector('[data-tab-preview]')).toBeNull();
    });

    it('dismisses an open preview when its tab becomes selected', async () => {
        wrapper = mount(TabHoverPreview, {
            attachTo: document.body,
            slots: { default: '<button>Example</button>' },
        });

        await wrapper
            .get('[data-grace-area-trigger]')
            .trigger('pointerenter', { pointerType: 'mouse' });
        await vi.advanceTimersByTimeAsync(450);

        expect(document.querySelector('[data-tab-preview]')).not.toBeNull();

        await wrapper.setProps({ disabled: true });
        await vi.advanceTimersByTimeAsync(200);

        expect(document.querySelector('[data-tab-preview]')).toBeNull();
    });

    it.each(['pointerdown', 'contextmenu'])(
        'suppresses previews after %s until the pointer leaves',
        async (event) => {
            wrapper = mount(TabHoverPreview, {
                attachTo: document.body,
                slots: { default: '<button>Example</button>' },
            });

            await wrapper
                .get('[data-grace-area-trigger]')
                .trigger('pointerenter', { pointerType: 'mouse' });
            await vi.advanceTimersByTimeAsync(200);
            await wrapper.get('[data-grace-area-trigger]').trigger(event);
            await vi.advanceTimersByTimeAsync(500);

            expect(document.querySelector('[data-tab-preview]')).toBeNull();

            await wrapper
                .get('[data-grace-area-trigger]')
                .trigger('pointerleave', { pointerType: 'mouse' });
            await vi.advanceTimersByTimeAsync(1);
            await wrapper
                .get('[data-grace-area-trigger]')
                .trigger('pointerenter', { pointerType: 'mouse' });
            await vi.advanceTimersByTimeAsync(450);

            expect(document.querySelector('[data-tab-preview]')).not.toBeNull();
        }
    );

    it('does not show hover previews for touch input', async () => {
        wrapper = mount(TabHoverPreview, {
            attachTo: document.body,
            slots: { default: '<button>Example</button>' },
        });

        await wrapper
            .get('[data-grace-area-trigger]')
            .trigger('pointerenter', { pointerType: 'touch' });
        await vi.advanceTimersByTimeAsync(500);

        expect(document.querySelector('[data-tab-preview]')).toBeNull();
    });

    it('shows a useful preview for a new project', async () => {
        wrapper = mount(TabHoverPreview, {
            attachTo: document.body,
            props: { starting: true },
            slots: { default: '<button>New Project</button>' },
        });

        await wrapper
            .get('[data-grace-area-trigger]')
            .trigger('pointerenter', { pointerType: 'mouse' });
        await vi.advanceTimersByTimeAsync(450);

        const preview = document.querySelector('[data-tab-preview]');

        expect(preview.textContent).toContain('New Project');
        expect(preview.textContent).toContain('Start from scratch or choose a template.');
        expect(preview.querySelector('img')).toBeNull();
    });
});
