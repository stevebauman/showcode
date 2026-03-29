import { describe, it, expect, beforeEach } from 'vitest';
import useSettingsStore from '~/composables/useSettingsStore';

describe('useSettingsStore', () => {
    let settings;

    beforeEach(() => {
        localStorage.clear();

        settings = useSettingsStore();

        settings.$reset();
    });

    it('starts with empty state', () => {
        expect(settings.tab).toBe('');
        expect(settings.defaultTemplate).toBeNull();
        expect(settings.backgrounds).toEqual([]);
    });

    it('adds a background', () => {
        settings.addBackground('bg-1', { class: 'bg-red-500' });

        expect(settings.backgrounds).toHaveLength(1);
        expect(settings.backgrounds[0]).toEqual({ id: 'bg-1', class: 'bg-red-500' });
    });

    it('adds multiple backgrounds', () => {
        settings.addBackground('bg-1', { class: 'bg-red-500' });
        settings.addBackground('bg-2', { class: 'bg-blue-500' });

        expect(settings.backgrounds).toHaveLength(2);
    });

    it('deletes a background', () => {
        settings.addBackground('bg-1', { class: 'bg-red-500' });
        settings.addBackground('bg-2', { class: 'bg-blue-500' });

        settings.deleteBackground('bg-1');

        expect(settings.backgrounds).toHaveLength(1);
        expect(settings.backgrounds[0].id).toBe('bg-2');
    });

    it('returns displayable backgrounds with custom flag', () => {
        settings.addBackground('bg-1', { class: 'bg-red-500' });

        const displayable = settings.getDisplayableBackgrounds();

        expect(displayable).toHaveLength(1);
        expect(displayable[0]).toEqual({
            id: 0,
            custom: true,
            class: 'bg-red-500',
            'id': 'bg-1',
        });
    });

    it('sets a default template', () => {
        settings.setDefaultTemplate('template-1');

        expect(settings.getDefaultTemplate()).toBe('template-1');
    });

    it('clears the default template', () => {
        settings.setDefaultTemplate('template-1');

        settings.clearDefaultTemplate();

        expect(settings.getDefaultTemplate()).toBeNull();
    });
});

