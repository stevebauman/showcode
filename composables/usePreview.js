import useAspectRatios from './useAspectRatios';
import useSettings from '~/composables/useSettings';
import { DEFAULT_BACKGROUND } from './useBackgrounds';
import { watch, nextTick, toRefs } from '@nuxtjs/composition-api';

export default function (props, context) {
    const { refs } = context;

    const { defaults } = toRefs(props);

    const { calculateAspectRatio } = useAspectRatios();

    const { settings, settingsDefaults } = useSettings(defaults.value);

    const updateDimensions = () => {
        nextTick(() => {
            setWidth(refs.pane.actualWidth() * settings.scale);
            setHeight(refs.pane.actualHeight() * settings.scale);
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
            settings.showMenu = enabled;
            settings.showTitle = enabled;
            settings.showColorMenu = enabled;
            settings.showHeaderAccent = enabled;
        }
    );

    watch(
        () => settings.padding,
        (value) => {
            settings.paddingTop = value;
            settings.paddingBottom = value;
            settings.paddingLeft = value;
            settings.paddingRight = value;
        }
    );

    watch(
        () => settings.paddingLocked,
        () => {
            settings.paddingTop = settings.padding;
            settings.paddingBottom = settings.padding;
            settings.paddingLeft = settings.padding;
            settings.paddingRight = settings.padding;
        }
    );

    return {
        settings,
        settingsDefaults,
        setWidth,
        setHeight,
        resetWindowSize,
        setAspectRatio,
        applyAspectRatio,
        updateDimensions,
        setDefaultBackground,
    };
}
