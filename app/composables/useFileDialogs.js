import download from 'downloadjs';
import { fileDialog } from 'file-select-dialog';
import useDesktop from './useDesktop';

export default function () {
    const desktop = useDesktop();

    async function openFile(kind) {
        if (desktop) {
            const file = await desktop.invoke('open-file', kind);

            return file ? new File([file.data], file.name) : null;
        }

        const files = await fileDialog({
            accept: kind === 'project' ? '.json' : ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        });

        return files?.[0] ?? null;
    }

    async function saveFile(content, name, extension) {
        if (!desktop) {
            download(content, name);

            return true;
        }

        const blob =
            typeof content === 'string' && content.startsWith('data:')
                ? await (await fetch(content)).blob()
                : new Blob([content]);

        return desktop.invoke('save-file', {
            name,
            extension,
            data: new Uint8Array(await blob.arrayBuffer()),
        });
    }

    return { openFile, saveFile };
}
