import { startsWith } from 'lodash';
import { onMounted, ref, useContext } from '@nuxtjs/composition-api';

export default function () {
    const { $ipc } = useContext();

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
