import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from 'vue';
import { createPinia, defineStore } from 'pinia';
import projectStorage from '~/plugins/project-storage.client';

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe('project storage', () => {
    it('restores the existing project format and batches writes of the latest state', async () => {
        vi.useFakeTimers();
        localStorage.setItem(
            'pages/storage-batch',
            JSON.stringify({
                tab: { id: 'storage-batch' },
                settings: {},
                page: { code: 'restored' },
            })
        );
        const pinia = createPinia();
        projectStorage.setup({ $pinia: pinia });
        createApp({}).use(pinia);
        const project = defineStore('pages/storage-batch', {
            state: () => ({ page: { code: '' } }),
        })(pinia);
        expect(project.page.code).toBe('restored');
        const setItem = vi.spyOn(localStorage, 'setItem');

        project.page.code = 'first edit';
        await vi.advanceTimersByTimeAsync(250);
        project.page.code = 'latest edit';
        expect(project.page.code).toBe('latest edit');
        expect(setItem).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(500);

        expect(setItem).toHaveBeenCalledExactlyOnceWith(
            'pages/storage-batch',
            JSON.stringify(project.$state)
        );
        project.$dispose();
        localStorage.removeItem('pages/storage-batch');
    });

    it('flushes an immediate edit on pagehide', () => {
        vi.useFakeTimers();
        const pinia = createPinia();
        projectStorage.setup({ $pinia: pinia });
        createApp({}).use(pinia);
        const project = defineStore('pages/storage-pagehide', {
            state: () => ({ page: { code: '' } }),
        })(pinia);

        project.page.code = 'last edit';
        window.dispatchEvent(new Event('pagehide'));

        expect(JSON.parse(localStorage.getItem(project.$id)).page.code).toBe('last edit');
        project.$dispose();
        localStorage.removeItem(project.$id);
    });

    it('does not recreate storage after a project is closed', async () => {
        vi.useFakeTimers();
        const pinia = createPinia();
        projectStorage.setup({ $pinia: pinia });
        createApp({}).use(pinia);
        const project = defineStore('pages/storage-closed', {
            state: () => ({ page: { code: '' } }),
        })(pinia);

        project.page.code = 'pending edit';
        project.$dispose();
        localStorage.removeItem(project.$id);
        await vi.advanceTimersByTimeAsync(2500);
        window.dispatchEvent(new Event('pagehide'));

        expect(localStorage.getItem(project.$id)).toBeNull();
    });
});
