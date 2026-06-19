import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Tab from '~/components/Tab.vue';

const ContextMenuStub = {
    template: '<div><slot /></div>',
};

const ContextMenuTriggerStub = {
    template: '<div><slot /></div>',
};

const ContextMenuContentStub = {
    template: '<div><slot /></div>',
};

const ContextMenuItemStub = {
    emits: ['select'],
    template: '<button type="button" @click="$emit(\'select\')"><slot /></button>',
};

const ContextMenuSeparatorStub = {
    template: '<hr />',
};

function mountTab() {
    return mount(Tab, {
        props: {
            name: 'Saved Project',
            active: true,
            modified: false,
            canCloseOthers: true,
            canCloseProjectsToLeft: true,
            canCloseProjectsToRight: true,
            canReopenClosedProject: true,
        },
        global: {
            stubs: {
                ContextMenu: ContextMenuStub,
                ContextMenuTrigger: ContextMenuTriggerStub,
                ContextMenuContent: ContextMenuContentStub,
                ContextMenuItem: ContextMenuItemStub,
                ContextMenuSeparator: ContextMenuSeparatorStub,
            },
        },
    });
}

describe('Tab', () => {
    it('shows common desktop save states in the context menu', async () => {
        const wrapper = mountTab();

        expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
            '',
            'Save',
            'Save As...',
            'Rename',
            'Duplicate',
            'Close Tab',
            'Close Other Projects',
            'Close Projects to the Left',
            'Close Projects to the Right',
            'Reopen Closed Project',
        ]);

        await wrapper.findAll('button')[1].trigger('click');
        await wrapper.findAll('button')[2].trigger('click');
        await wrapper.findAll('button')[5].trigger('click');
        await wrapper.findAll('button')[6].trigger('click');
        await wrapper.findAll('button')[7].trigger('click');
        await wrapper.findAll('button')[8].trigger('click');
        await wrapper.findAll('button')[9].trigger('click');

        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save-as')).toHaveLength(1);
        expect(wrapper.emitted('close')).toHaveLength(1);
        expect(wrapper.emitted('close-others')).toHaveLength(1);
        expect(wrapper.emitted('close-projects-to-left')).toHaveLength(1);
        expect(wrapper.emitted('close-projects-to-right')).toHaveLength(1);
        expect(wrapper.emitted('reopen-closed')).toHaveLength(1);
    });
});
