import { debounce } from 'lodash';
import { reactive, useContext, watch } from '@nuxtjs/composition-api';
import useAspectRatios from '../composables/useAspectRatios';

const DEFAULT_BACKGROUND = 'candy';
const DEFAULT_HEIGHT = 200;
const DEFAULT_WIDTH = 450;

export default function () {
    const { $memory } = useContext();

    const { calculateAspectRatio } = useAspectRatios();

    const settings = reactive({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        showHeader: true,
        showTitle: true,
        showShadow: true,
        showMenu: true,
        showColorMenu: false,
        showLineNumbers: false,
        background: DEFAULT_BACKGROUND,
        title: '',
        themeType: 'light',
        themeOpacity: 1.0,
        themeName: 'github-light',
        themeBackground: '#fff',
        aspectRatio: null,
        borderRadius: 12,
        fontSize: 16,
        fontFamily: 'font-mono',
        lineHeight: 20,
        padding: 16,
        image: null,
    });

    const lineHeights = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];

    const fontSizes = [12, 14, 16, 18, 20];

    const fontFamilies = [
        { title: 'Default', name: 'font-mono' },
        { title: 'JetBrains Mono', name: 'font-mono-jetbrains' },
        { title: 'Mono Lisa', name: 'font-mono-lisa' },
    ];

    const restoreSettingsFromStorage = async (tab) => {
        const record = await $memory.pages.get(tab.id);

        Object.assign(settings, record.merge('settings', settings));
    };

    const syncSettingsInStorage = debounce(async function (tab) {
        await $memory.pages.sync(tab.id, (record) => record.set('settings', settings));
    }, 1000);

    /**
     * Set the aspect ratio of the preview.
     *
     * @param {Number} x
     * @param {Number} y
     */
    const setAspectRatio = (x, y) => {
        settings.aspectRatio = [x, y];

        applyAspectRatio();
    };

    /**
     * Apply the current aspect ratio to the preview.
     */
    const applyAspectRatio = () => {
        const [x, y] = settings.aspectRatio;

        settings.width = calculateAspectRatio([x, y], settings.height);
    };

    watch(
        () => settings.height,
        () => {
            if (settings.aspectRatio) {
                applyAspectRatio();
            }
        }
    );

    return {
        settings,
        lineHeights,
        fontSizes,
        fontFamilies,
        setAspectRatio,
        applyAspectRatio,
        syncSettingsInStorage,
        restoreSettingsFromStorage,
    };
}
