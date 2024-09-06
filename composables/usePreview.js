import useSettings from '@/composables/useSettings';
import useAspectRatios from '@/composables/useAspectRatios';
import { DEFAULT_BACKGROUND } from './useBackgrounds';
import { watch, nextTick, toRefs } from '@nuxtjs/composition-api';

export default function (props, context) {
    const { refs } = context;

    const { defaults } = toRefs(props);

    const { calculateAspectRatio } = useAspectRatios();

    const { settings, settingsDefaults } = useSettings(defaults.value);

    function updateDimensions() {
        nextTick(() => {
            setWidth(refs.pane.$el.clientWidth * settings.scale);
            setHeight(refs.pane.$el.clientHeight * settings.scale);
        });
    }

    function setWidth(width, force = false) {
        if (force) {
            settings.aspectRatio = null;
        }

        if (width >= 0) {
            settings.width = Math.round(width);
        }
    }

    function setHeight(height, force = false) {
        if (force) {
            settings.aspectRatio = null;
        }

        if (height >= 0) {
            settings.height = Math.round(height);
        }
    }

    function resetWindowSize() {
        settings.aspectRatio = null;

        settings.width = 0;
        settings.height = 0;
        settings.lockWindowSize = false;

        updateDimensions();
    }

    function setAspectRatio(x, y) {
        settings.aspectRatio = [x, y];

        applyAspectRatio();
    }

    function applyAspectRatio() {
        if (!settings.aspectRatio) {
            return;
        }

        const [x, y] = settings.aspectRatio;

        setWidth(calculateAspectRatio([x, y], settings.height));
    }

    function setDefaultBackground() {
        settings.background = DEFAULT_BACKGROUND;
    }

    watch(
        () => settings.showHeader,
        (enabled) => {
            settings.showMenu = enabled;
            settings.showTitle = enabled;
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
