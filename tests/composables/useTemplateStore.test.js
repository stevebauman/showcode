import { describe, it, expect, beforeEach } from 'vitest';
import useTemplateStore from '~/composables/useTemplateStore';
import useSettingsStore from '~/composables/useSettingsStore';

describe('useTemplateStore', () => {
    let templates;
    let settings;

    beforeEach(() => {
        localStorage.clear();

        templates = useTemplateStore();
        settings = useSettingsStore();

        templates.$reset();
        settings.$reset();
    });

    it('starts with no templates', () => {
        expect(templates.all()).toEqual([]);
    });

    it('adds a template', () => {
        templates.add({ tab: { id: 't-1', name: 'My Template' } });

        expect(templates.all()).toHaveLength(1);
        expect(templates.all()[0].tab.name).toBe('My Template');
    });

    it('removes a template', () => {
        templates.add({ tab: { id: 't-1', name: 'Template 1' } });
        templates.add({ tab: { id: 't-2', name: 'Template 2' } });

        templates.remove({ tab: { id: 't-1' } });

        expect(templates.all()).toHaveLength(1);
        expect(templates.all()[0].tab.id).toBe('t-2');
    });

    it('does nothing when removing a non-existent template', () => {
        templates.add({ tab: { id: 't-1', name: 'Template 1' } });

        templates.remove({ tab: { id: 'non-existent' } });

        expect(templates.all()).toHaveLength(1);
    });

    it('finds a template by ID', () => {
        templates.add({ tab: { id: 't-1', name: 'My Template' } });

        expect(templates.findById('t-1').tab.name).toBe('My Template');
    });

    it('returns null when finding a template by non-existent ID', () => {
        expect(templates.findById('non-existent')).toBeNull();
    });

    it('renames a template', () => {
        const template = { tab: { id: 't-1', name: 'Old Name' } };

        templates.add(template);

        templates.rename(template, 'New Name');

        expect(templates.findById('t-1').tab.name).toBe('New Name');
    });

    it('sets a template as default', () => {
        const template = { tab: { id: 't-1', name: 'My Template' } };

        templates.add(template);

        templates.setAsDefault(template);

        expect(templates.isDefault(template)).toBe(true);
    });

    it('gets the default template', () => {
        const template = { tab: { id: 't-1', name: 'My Template' } };

        templates.add(template);
        templates.setAsDefault(template);

        expect(templates.getDefault().tab.id).toBe('t-1');
    });

    it('returns null when no default template is set', () => {
        expect(templates.getDefault()).toBeNull();
    });

    it('clears the default template', () => {
        const template = { tab: { id: 't-1', name: 'My Template' } };

        templates.add(template);
        templates.setAsDefault(template);
        templates.clearAsDefault();

        expect(templates.isDefault(template)).toBe(false);
        expect(templates.getDefault()).toBeNull();
    });

    it('clears default template when removing the default template', () => {
        const template = { tab: { id: 't-1', name: 'My Template' } };

        templates.add(template);
        templates.setAsDefault(template);

        templates.remove(template);

        expect(settings.getDefaultTemplate()).toBeNull();
    });

    it('does not clear default template when removing a non-default template', () => {
        const defaultTemplate = { tab: { id: 't-1', name: 'Default' } };
        const otherTemplate = { tab: { id: 't-2', name: 'Other' } };

        templates.add(defaultTemplate);
        templates.add(otherTemplate);
        templates.setAsDefault(defaultTemplate);

        templates.remove(otherTemplate);

        expect(settings.getDefaultTemplate()).toBe('t-1');
    });
});

