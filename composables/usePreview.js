import { cloneDeep, defaults as applyDefaults } from 'lodash';
import useAspectRatios from './useAspectRatios';
import { DEFAULT_BACKGROUND } from './useBackgrounds';
import usePreferencesStore from '../composables/usePreferencesStore';
import { reactive, watch, nextTick, toRefs } from '@nuxtjs/composition-api';

export const lineHeights = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];

export const fontSizes = [12, 14, 16, 18, 20];

export const fontFamilies = [
    { title: 'Default', name: 'font-mono' },
    { title: 'JetBrains Mono', name: 'font-mono-jetbrains' },
    { title: 'Mono Lisa', name: 'font-mono-lisa' },
];

export default function (props, context) {
    const { refs } = context;

    const { defaults } = toRefs(props);

    const preferences = usePreferencesStore();

    const { calculateAspectRatio } = useAspectRatios();

    const settings = reactive(
        applyDefaults(cloneDeep(defaults.value), {
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
            themeName: preferences.previewThemeName,
            themeBackground: '#fff',
            aspectRatio: null,
            borderRadius: 12,
            fontSize: preferences.previewFontSize,
            fontFamily: preferences.previewFontFamily,
            lineHeight: preferences.previewLineHeight,
            padding: 16,
            image: null,
            scale: 1.0,
        })
    );

    const updateDimensions = () => {
        nextTick(() => {
            setWidth(refs.window.actualWidth());
            setHeight(refs.window.actualHeight());
        });
    };

    const setWidth = (width, manual = false) => {
        if (width >= 0) {
            settings.width = Math.round(width);
        }

        if (manual) {
            settings.aspectRatio = null;
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
        setWidth,
        setHeight,
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
        setDefaultBackground,
    };
}
