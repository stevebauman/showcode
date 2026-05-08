import { startsWith } from 'lodash';
import { onMounted, ref } from 'vue';

const BUILT_IN_FONTS = [
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
];

const fontFamilies = ref([...BUILT_IN_FONTS]);

let loadPromise = null;

function loadSystemFonts($ipc) {
    if (loadPromise) return loadPromise;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const isMonospace = (fontFamily) => {
        const escaped = fontFamily.replace(/"/g, '\\"');
        ctx.font = `16px "${escaped}"`;
        return Math.abs(ctx.measureText('i').width - ctx.measureText('W').width) < 0.5;
    };

    loadPromise = $ipc.invoke('get-system-fonts')?.then((fonts) => {
        if (!fonts) return;

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
    });

    return loadPromise;
}

export default function () {
    const { $ipc } = useNuxtApp();

    onMounted(() => loadSystemFonts($ipc));

    return { fontFamilies };
}
