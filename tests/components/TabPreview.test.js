import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TabPreview from '~/components/TabPreview.vue';
import InputMargin from '~/components/InputMargin.vue';
import InputCornerRadius from '~/components/InputCornerRadius.vue';
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
    it('resets every padding side, including the right side', () => {
        const { settings, settingsDefaults } = useSettings({
            paddingLocked: false,
            paddingTop: 20,
            paddingRight: 30,
            paddingBottom: 40,
            paddingLeft: 50,
        });
        const wrapper = mount(TabPreview, {
            props: { blocks: [], themes: ['github-dark'], settings },
            global: {
                directives: { tooltip: {} },
                stubs: {
                    PopoverSettings: {
                        name: 'PopoverSettings',
                        props: ['title'],
                        emits: ['reset'],
                        template: '<section><slot /></section>',
                    },
                },
            },
        });

        wrapper
            .findAllComponents({ name: 'PopoverSettings' })
            .find((popover) => popover.props('title') === 'Padding Properties')
            .vm.$emit('reset');

        expect(settings.paddingTop).toBe(settingsDefaults.paddingTop);
        expect(settings.paddingRight).toBe(settingsDefaults.paddingRight);
        expect(settings.paddingBottom).toBe(settingsDefaults.paddingBottom);
        expect(settings.paddingLeft).toBe(settingsDefaults.paddingLeft);
        wrapper.unmount();
    });

    it('keeps linked edits consistent when padding and corners are unlinked', async () => {
        const { settings } = useSettings();
        const wrapper = mount(TabPreview, {
            props: { blocks: [], themes: ['github-dark'], settings },
            global: {
                directives: { tooltip: {} },
                stubs: { PopoverSettings: passthroughStub },
            },
        });
        const padding = wrapper
            .findAllComponents(InputMargin)
            .find((input) => input.props('inset'));

        padding.vm.$emit('update:margin-right', 28);
        padding.vm.$emit('update:linked', false);
        await wrapper.vm.$nextTick();

        expect(settings.padding).toBe(28);
        expect([
            settings.paddingTop,
            settings.paddingRight,
            settings.paddingBottom,
            settings.paddingLeft,
        ]).toEqual([28, 28, 28, 28]);

        padding.vm.$emit('update:margin-right', 32);
        expect(settings.paddingLeft).toBe(28);
        expect(settings.paddingRight).toBe(32);

        const corners = wrapper.getComponent(InputCornerRadius);
        corners.vm.$emit('change', 'topLeft', 24);
        corners.vm.$emit('update:linked', false);
        await wrapper.vm.$nextTick();

        expect(settings.borderRadius).toBe(24);
        expect(corners.props('values')).toEqual({
            topLeft: 24,
            topRight: 24,
            bottomLeft: 24,
            bottomRight: 24,
        });

        corners.vm.$emit('change', 'bottomRight', 8);
        expect(settings.borderRadiusTopLeft).toBe(24);
        expect(settings.borderRadiusBottomRight).toBe(8);
        wrapper.unmount();
    });

    it('associates labels with their inputs and switches', () => {
        const { settings } = useSettings({ scene: 'none', themeName: 'github-dark' });
        const wrapper = mount(TabPreview, {
            props: { blocks: [], themes: ['github-dark'], settings },
            global: { directives: { tooltip: {} } },
        });

        for (const name of [
            'Font Size',
            'Line Height',
            'Header',
            'Line Numbers',
            'Border',
            'Shadow',
            'Shine',
            'Social Badge',
        ]) {
            const label = wrapper.findAll('label').find((label) => label.text() === name);
            const target = wrapper.get(`[id="${label.attributes('for')}"]`);

            expect(['INPUT', 'BUTTON']).toContain(target.element.tagName);
        }

        wrapper.unmount();
    });

    it('keeps the theme selector changeable when a scene is selected', () => {
        const wrapper = mountPreview();

        expect(fieldClasses(wrapper, 'Theme')).not.toContain('pointer-events-none');
        expect(fieldClasses(wrapper, 'Position')).toContain('pointer-events-none');
    });
});
