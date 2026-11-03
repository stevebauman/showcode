import { afterEach, describe, expect, it, vi } from 'vitest';
import { fileDialog } from 'file-select-dialog';
import download from 'downloadjs';
import useFileDialogs from '~/composables/useFileDialogs';
import useClipboard from '~/composables/useClipboard';
import useConfirm from '~/composables/useConfirm';

vi.mock('file-select-dialog', () => ({ fileDialog: vi.fn() }));
vi.mock('downloadjs', () => ({ default: vi.fn() }));

afterEach(() => {
    delete window.electronIpc;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

describe('desktop file operations', () => {
    it('returns no file when the native picker is cancelled', async () => {
        window.electronIpc = { invoke: vi.fn().mockResolvedValue(null) };

        expect(await useFileDialogs().openFile('project')).toBeNull();
        expect(fileDialog).not.toHaveBeenCalled();
    });

    it('turns native file contents into a browser file', async () => {
        window.electronIpc = {
            invoke: vi.fn().mockResolvedValue({
                name: 'project.json',
                data: new TextEncoder().encode('{"tab":{"name":"Example"}}'),
            }),
        };

        const file = await useFileDialogs().openFile('project');

        expect(file.name).toBe('project.json');
        expect(JSON.parse(await file.text())).toEqual({ tab: { name: 'Example' } });
    });

    it('sends binary data to the native save dialog and preserves cancellation', async () => {
        window.electronIpc = { invoke: vi.fn().mockResolvedValue(false) };

        expect(await useFileDialogs().saveFile('{"example":true}', 'project.json', 'json')).toBe(
            false
        );
        expect(window.electronIpc.invoke).toHaveBeenCalledWith('save-file', {
            name: 'project.json',
            extension: 'json',
            data: new TextEncoder().encode('{"example":true}'),
        });
        expect(download).not.toHaveBeenCalled();
    });

    it('keeps browser downloads and file selection available without Electron', async () => {
        const file = new File(['{}'], 'project.json');
        fileDialog.mockResolvedValue([file]);

        expect(await useFileDialogs().openFile('project')).toBe(file);
        await useFileDialogs().saveFile('{}', 'project.json', 'json');
        expect(download).toHaveBeenCalledWith('{}', 'project.json');
    });

    it('copies images through Electron without requiring browser clipboard APIs', async () => {
        window.electronIpc = { invoke: vi.fn().mockResolvedValue(undefined) };
        const { copy, copied } = useClipboard();

        await copy(Promise.resolve(new Blob([new Uint8Array([137, 80, 78, 71])])));

        expect(window.electronIpc.invoke).toHaveBeenCalledWith(
            'copy-image',
            new Uint8Array([137, 80, 78, 71])
        );
        expect(copied.value).toBe(true);
    });

    it('does not report a successful copy when the native clipboard rejects the image', async () => {
        window.electronIpc = { invoke: vi.fn().mockRejectedValue(new Error('Invalid image')) };
        const { copy, copied } = useClipboard();

        await expect(copy(new Blob(['invalid']))).rejects.toThrow('Invalid image');
        expect(copied.value).toBe(false);
    });

    it('uses a native confirmation without invoking browser confirm', async () => {
        const confirm = vi.fn();
        vi.stubGlobal('confirm', confirm);
        window.electronIpc = { invoke: vi.fn().mockResolvedValue(false) };

        expect(await useConfirm()('Delete this project?')).toBe(false);
        expect(confirm).not.toHaveBeenCalled();
    });
});
