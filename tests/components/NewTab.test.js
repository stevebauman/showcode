import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import NewTab from '~/components/NewTab.vue';

describe('NewTab', () => {
    it('offers to start from scratch when there are no saved templates', async () => {
        const templates = {
            all: vi.fn(() => []),
            isDefault: vi.fn(() => false),
        };
        const wrapper = mount(NewTab, {
            props: { templates },
        });

        expect(wrapper.get('[data-new-tab]').classes()).toEqual(
            expect.arrayContaining(['bg-white', 'dark:bg-zinc-950'])
        );
        expect(wrapper.text()).toContain('New project');
        expect(wrapper.text()).toContain('Blank project');
        expect(wrapper.text()).toContain('Saved templates will appear here');

        await wrapper.get('[data-start-from-scratch]').trigger('click');

        expect(wrapper.emitted('start')).toHaveLength(1);
    });

    it('opens a project from a saved template', async () => {
        const template = {
            settings: {},
            tab: {
                id: 'template-id',
                name: 'Laravel Dark',
                created_at: '2026-08-11T12:00:00.000Z',
            },
        };
        const templates = {
            all: vi.fn(() => [template]),
            isDefault: vi.fn((item) => item === template),
        };
        const wrapper = mount(NewTab, {
            props: { templates },
        });

        expect(wrapper.text()).toContain('Laravel Dark');
        expect(wrapper.text()).toContain('Default');

        await wrapper.get('[data-template-id="template-id"]').trigger('click');

        expect(wrapper.emitted('template')).toEqual([[template]]);
    });

    it('opens template management', async () => {
        const template = {
            settings: {},
            tab: { id: 'template-id', name: 'Laravel Dark' },
        };
        const templates = {
            all: vi.fn(() => [template]),
            isDefault: vi.fn(() => false),
        };
        const wrapper = mount(NewTab, {
            props: { templates },
        });

        await wrapper.get('[data-manage-templates]').trigger('click');

        expect(wrapper.emitted('manage-templates')).toHaveLength(1);
    });
});
