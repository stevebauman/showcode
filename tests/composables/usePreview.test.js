import { describe, it, expect, vi } from 'vitest';
import { nextTick, reactive, ref } from 'vue';
import usePreview from '~/composables/usePreview';

describe('usePreview', () => {
    it('marks appearance changes as unsaved after every edit', async () => {
        const emit = vi.fn();
        const { settings } = usePreview(reactive({ settings: {} }), { emit, pane: ref(null) });

        await nextTick();
        expect(emit).not.toHaveBeenCalled();

        settings.showShadow = !settings.showShadow;
        await nextTick();
        expect(emit).toHaveBeenCalledWith('update:touched');

        emit.mockClear();
        settings.borderColor.red = 100;
        await nextTick();
        expect(emit).toHaveBeenCalledWith('update:touched');
    });

    it('updates the supplied settings and dependent values before returning to the caller', () => {
        const props = reactive({ settings: { showHeader: true } });
        const emit = vi.fn();
        const { settings } = usePreview(props, { emit, pane: ref(null) });

        expect(settings).toBe(props.settings);

        settings.showHeader = false;
        settings.padding = 32;

        expect(props.settings.showMenu).toBe(false);
        expect(props.settings.showTitle).toBe(false);
        expect(props.settings.paddingTop).toBe(32);
        expect(props.settings.paddingBottom).toBe(32);
        expect(emit).toHaveBeenCalledWith('update:touched');
    });

    it('does not mark generated preview metadata as unsaved', async () => {
        const emit = vi.fn();
        const { settings } = usePreview(reactive({ settings: {} }), { emit, pane: ref(null) });

        settings.image = 'generated-thumbnail';
        settings.themeType = 'light';
        settings.themeBackground = '#123456';
        await nextTick();

        expect(emit).not.toHaveBeenCalled();
    });
});
