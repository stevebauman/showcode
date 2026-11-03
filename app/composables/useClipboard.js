import { ref } from 'vue';
import useDesktop from './useDesktop';

export default function () {
    const copied = ref(false);

    async function copy(content, format = 'image/png') {
        const desktop = useDesktop();

        if (desktop) {
            const blob = await content;

            await desktop.invoke('copy-image', new Uint8Array(await blob.arrayBuffer()));
        } else {
            await navigator.clipboard.write([new ClipboardItem({ [format]: content })]);
        }

        copied.value = true;
        window.setTimeout(() => (copied.value = false), 4000);
    }

    return {
        copy,
        copied,
    };
}
