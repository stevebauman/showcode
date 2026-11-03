import { flushPromises } from '@vue/test-utils';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DesktopAppUpdateButton from '~/components/DesktopAppUpdateButton.vue';

const ipc = vi.hoisted(() => ({
    addListener: vi.fn(),
    invoke: vi.fn(),
    removeListener: vi.fn(),
}));

mockNuxtImport('useElectronIpc', () => {
    return () => ipc;
});

describe('DesktopAppUpdateButton', () => {
    beforeEach(() => {
        ipc.addListener.mockReset();
        ipc.invoke.mockReset();
        ipc.removeListener.mockReset();
    });

    it('shows an available update and asks Electron to install it', async () => {
        ipc.invoke.mockImplementation((channel) => {
            if (channel === 'get-update-state') {
                return Promise.resolve({ status: 'available' });
            }

            return Promise.resolve();
        });

        const wrapper = await mountSuspended(DesktopAppUpdateButton);

        await flushPromises();

        expect(wrapper.get('button').isVisible()).toBe(true);
        expect(wrapper.get('button').text()).toBe('Update');

        await wrapper.get('button').trigger('click');

        expect(ipc.invoke).toHaveBeenCalledWith('install-update');

        wrapper.unmount();

        expect(ipc.removeListener).toHaveBeenCalledWith(
            'update-state-changed',
            expect.any(Function)
        );
    });
});
