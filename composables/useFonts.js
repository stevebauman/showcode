import { startsWith } from 'lodash';
import { invoke } from '@tauri-apps/api/tauri'
import { onMounted, ref } from '@nuxtjs/composition-api';

export default function () {
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
        const fonts = await invoke('get_system_fonts');

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
