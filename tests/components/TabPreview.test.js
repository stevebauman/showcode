import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TabPreview from '~/components/TabPreview.vue';
import useSettings from '~/composables/useSettings';
import { SCENE_BROWSERBASE } from '~/data/scenes';

const passthroughStub = {
    template: '<div><slot /></div>',
};

function mountPreview(settingsOverrides = {}) {
    const { settings } = useSettings({
        scene: SCENE_BROWSERBASE,
        themeName: 'github-dark',
        ...settingsOverrides,
    });

    return mount(TabPreview, {
        props: {
            blocks: [],
            themes: ['github-dark', 'github-light'],
            settings,
        },
        global: {
            directives: {
                tooltip: {},
            },
            stubs: {
                ButtonLock: passthroughStub,
                ControlRow: {
                    template: '<div class="control-row"><slot /></div>',
                },
                Input: passthroughStub,
                InputMargin: passthroughStub,
                Label: {
                    template: '<label><slot /></label>',
                },
                PopoverSettings: passthroughStub,
                Select: passthroughStub,
                SelectContent: passthroughStub,
                SelectItem: passthroughStub,
                SelectTrigger: passthroughStub,
                SelectValue: passthroughStub,
                Slider: passthroughStub,
                Toggle: passthroughStub,
                ToggleBorder: passthroughStub,
                ToggleHeader: passthroughStub,
                ToggleShadow: passthroughStub,
                ToggleShine: passthroughStub,
                ToggleSocialBadge: passthroughStub,
            },
        },
    });
}

function fieldClasses(wrapper, label) {
    const fieldLabel = wrapper.findAll('label').find((node) => node.text() === label);

    return fieldLabel.element.parentElement.className;
}

describe('TabPreview', () => {
    it('keeps the theme selector changeable when a scene is selected', () => {
        const wrapper = mountPreview();

        expect(fieldClasses(wrapper, 'Theme')).not.toContain('pointer-events-none');
        expect(fieldClasses(wrapper, 'Position')).toContain('pointer-events-none');
    });
});
