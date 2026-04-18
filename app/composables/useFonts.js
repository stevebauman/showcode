import { startsWith } from 'lodash';
import { onMounted, ref } from 'vue';

function isMonospace(fontFamily) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const escaped = fontFamily.replace(/"/g, '\\"');
    ctx.font = `16px "${escaped}"`;
    const iWidth = ctx.measureText('i').width;
    const wWidth = ctx.measureText('W').width;
    return Math.abs(iWidth - wWidth) < 0.5;
}

export default function () {
    const { $ipc } = useNuxtApp();

    const fontFamilies = ref([
        {
            group: 'Built-In',
            title: 'Default',
            name: 'font-mono',
            attributes: { class: 'font-mono' },
        },
        {
            group: 'Built-In',
            title: 'Geist Mono',
            name: 'font-mono-geist',
            attributes: { style: { fontFamily: 'GeistMono' } },
        },
        {
            group: 'Built-In',
            title: 'JetBrains Mono',
            name: 'font-mono-jetbrains',
            attributes: { style: { fontFamily: 'JetbrainsMono' } },
        },
        {
            group: 'Built-In',
            title: 'Mono Lisa',
            name: 'font-mono-lisa',
            attributes: { style: { fontFamily: 'MonoLisa' } },
        },
    ]);

    onMounted(async () => {
        const fonts = await $ipc.invoke('get-system-fonts');

        if (fonts) {
            fonts
                .filter((fontFamily) => !startsWith(fontFamily, '.'))
                .filter(isMonospace)
                .sort((a, b) => a.localeCompare(b))
                .forEach((fontFamily) =>
                    fontFamilies.value.push({
                        group: 'System',
                        title: fontFamily,
                        name: fontFamily,
                        attributes: { style: { fontFamily: fontFamily } },
                    })
                );
        }
    });

    return { fontFamilies };
}
