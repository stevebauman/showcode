import { debounce } from 'lodash';
import useAspectRatios from './useAspectRatios';
import { DEFAULT_BACKGROUND } from './useBackgrounds';
import { reactive, useContext, watch, nextTick, onMounted } from '@nuxtjs/composition-api';

export default function (props, context) {
    const { refs } = context;

    const { $memory } = useContext();

    const { calculateAspectRatio } = useAspectRatios();

    const settings = reactive({
        width: 400,
        height: 200,
        landscape: false,
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
        scale: 1.0,
    });

    const lineHeights = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];

    const fontSizes = [12, 14, 16, 18, 20];

    const fontFamilies = [
        { title: 'Default', name: 'font-mono' },
        { title: 'JetBrains Mono', name: 'font-mono-jetbrains' },
        { title: 'Mono Lisa', name: 'font-mono-lisa' },
    ];

    const restoreSettings = (merge) => {
        Object.assign(settings, merge);
    };

    const restoreSettingsFromStorage = async (tab) => {
        const record = await $memory.pages.get(tab.id);

        restoreSettings(settings, record.merge('settings', settings));
    };

    const syncSettingsInStorage = debounce(async function (tab) {
        await $memory.pages.sync(tab.id, (record) => record.set('settings', settings));
    }, 1000);

    const updateDimensions = () => {
        nextTick(() => {
            setWidth(refs.window.actualWidth());
            setHeight(refs.window.actualHeight());
        });
    };

    const setWidth = (width) => {
        if (width >= 0) {
            settings.width = Math.round(width);
        }
    };

    const setHeight = (height) => {
        if (height >= 0) {
            settings.height = Math.round(height);
        }
    };

    const resetWindowSize = () => {
        settings.aspectRatio = null;

        settings.width = 0;
        settings.height = 0;

        updateDimensions();
    };

    const setAspectRatio = (x, y) => {
        settings.aspectRatio = [x, y];

        applyAspectRatio();
    };

    const applyAspectRatio = () => {
        const [x, y] = settings.aspectRatio;

        setWidth(calculateAspectRatio([x, y], settings.height));
    };

    const resizeHeight = (event, side = -1) => {
        if (isNaN(event.offsetY)) {
            return;
        }

        const height =
            side < 0 ? settings.height - event.deltaY * 2 : settings.height + event.deltaY * 2;

        setHeight(height);
    };

    const resizeWidth = (event, side = -1) => {
        if (isNaN(event.offsetX)) {
            return;
        }

        settings.aspectRatio = null;

        const width =
            side < 0 ? settings.width - event.deltaX * 2 : settings.width + event.deltaX * 2;

        setWidth(width);
    };

    const resizeFromTop = (event) => resizeHeight(event, -1);
    const resizeFromBottom = (event) => resizeHeight(event, 1);
    const resizeFromLeft = (event) => resizeWidth(event, -1);
    const resizeFromRight = (event) => resizeWidth(event, 1);

    const setDefaultBackground = () => (settings.background = DEFAULT_BACKGROUND);

    watch(
        () => settings.showHeader,
        (enabled) => {
            settings.showTitle = enabled;
            settings.showMenu = enabled;
            settings.showColorMenu = enabled;
        }
    );

    onMounted(async () => {
        await restoreSettingsFromStorage(props.tab);

        watch(
            () => settings.height,
            () => {
                if (settings.aspectRatio) {
                    applyAspectRatio();
                }
            }
        );
    });

    return {
        settings,
        lineHeights,
        fontSizes,
        fontFamilies,
        resizeWidth,
        resizeHeight,
        resizeFromTop,
        resizeFromBottom,
        resizeFromLeft,
        resizeFromRight,
        resetWindowSize,
        setAspectRatio,
        applyAspectRatio,
        updateDimensions,
        syncSettingsInStorage,
        setDefaultBackground,
        restoreSettings,
        restoreSettingsFromStorage,
    };
}
