import { cloneDeep, defaults as applyDefaults } from 'lodash';
import useAspectRatios from './useAspectRatios';
import { DEFAULT_BACKGROUND } from './useBackgrounds';
import usePreferencesStore from '@/composables/usePreferencesStore';
import { reactive, watch, nextTick, toRefs } from '@nuxtjs/composition-api';

export const lineHeights = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];

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

            showShadow: true,
            shadowX: 0,
            shadowY: 10,
            shadowBlur: 10,
            shadowSpread: -5,
            shadowColor: {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0.08,
            },
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

    const setDefaultBackground = () => (settings.background = DEFAULT_BACKGROUND);

    watch(
        () => settings.showHeader,
        (enabled) => {
            settings.showTitle = enabled;
            settings.showMenu = enabled;
            settings.showColorMenu = enabled;
        }
    );

    return {
        settings,
        lineHeights,
        setWidth,
        setHeight,
        resetWindowSize,
        setAspectRatio,
        applyAspectRatio,
        updateDimensions,
        setDefaultBackground,
    };
}
