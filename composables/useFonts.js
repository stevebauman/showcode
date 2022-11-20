import { startsWith } from 'lodash';
import { onMounted, ref } from 'vue';

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
            title: 'Mono Lisa',
            name: 'font-mono-lisa',
            attributes: { style: { fontFamily: 'MonoLisa' } },
        },
        {
            group: 'Built-In',
            title: 'JetBrains Mono',
            name: 'font-mono-jetbrains',
            attributes: { style: { fontFamily: 'JetbrainsMono' } },
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
