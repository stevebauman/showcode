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
        ]);

        await wrapper.findAll('button')[1].trigger('click');
        await wrapper.findAll('button')[2].trigger('click');
        await wrapper.findAll('button')[5].trigger('click');

        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save-as')).toHaveLength(1);
        expect(wrapper.emitted('close')).toHaveLength(1);
    });
});
