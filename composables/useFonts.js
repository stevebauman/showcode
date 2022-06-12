import { onMounted, ref, useContext } from '@nuxtjs/composition-api';

export default function () {
    const { $ipc } = useContext();

    const fontSizes = ref([12, 14, 16, 18, 20]);

    const fontFamilies = ref([
        { title: 'Default', name: 'font-mono', attributes: { class: 'font-mono' } },
        {
            title: 'Mono Lisa',
            name: 'font-mono-lisa',
            attributes: { class: 'font-mono-lisa' },
        },
        {
            title: 'JetBrains Mono',
            name: 'font-mono-jetbrains',
            attributes: { class: 'font-mono-jetbrains' },
        },
    ]);

    onMounted(async () => {
        const fonts = await $ipc.invoke('get-system-fonts');

        fonts.forEach((fontFamily) =>
            fontFamilies.value.push({
                title: fontFamily,
                name: fontFamily,
                attributes: { style: { fontFamily: fontFamily } },
            })
        );
    });

    return { fontSizes, fontFamilies };
}
