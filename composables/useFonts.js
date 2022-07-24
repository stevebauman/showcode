import { startsWith } from 'lodash';
import { onMounted, ref, useContext } from '@nuxtjs/composition-api';

export default function () {
    const { $ipc } = useContext();

    const fontSizes = ref([6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 30]);

    const fontFamilies = ref([
        {
            group: 'Built-In',
            title: 'Default',
            name: 'font-mono',
            attributes: { class: 'font-mono' },
        },
        {
            group: 'Built-In',
            title: 'Mono Lisa',
            name: 'font-mono-lisa',
            attributes: { class: 'font-mono-lisa' },
        },
        {
            group: 'Built-In',
            title: 'JetBrains Mono',
            name: 'font-mono-jetbrains',
            attributes: { class: 'font-mono-jetbrains' },
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

    return { fontSizes, fontFamilies };
}
