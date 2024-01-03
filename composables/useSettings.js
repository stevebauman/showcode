import { reactive } from '@nuxtjs/composition-api';
import { cloneDeep, defaults as applyDefaults } from 'lodash';
import { DEFAULT_BACKGROUND } from '~/composables/useBackgrounds';
import usePreferencesStore from '~/composables/usePreferencesStore';

export default function (defaults = {}) {
    const preferences = usePreferencesStore();

    const settingsDefaults = {
        title: '',
        width: 500,
        height: 300,
        position: 'center',
        landscape: false,
        showHeader: true,
        showHeaderAccent: false,
        showTitle: true,
        showMenu: true,
        showDividers: true,
        showColorMenu: false,
        showLineNumbers: false,
        background: DEFAULT_BACKGROUND,

        themeType: 'dark',
        themeOpacity: 1.0,
        themeName: preferences.previewThemeName,
        themeBackground: '#fff',
        aspectRatio: null,

        lockWindowSize: preferences.previewLockToWindow,
        lockWindowPaddingX: preferences.previewLockToWindowPaddingX,
        lockWindowPaddingY: preferences.previewLockToWindowPaddingY,

        fontSize: preferences.previewFontSize,
        fontFamily: preferences.previewFontFamily,
        lineHeight: preferences.previewLineHeight,

        padding: 16,
        paddingLocked: true,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,

        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,

        image: null,
        scale: 1.0,

        showBorder: false,

        borderRadius: 12,
        borderRadiusLocked: true,
        borderRadiusTopLeft: 12,
        borderRadiusTopRight: 12,
        borderRadiusBottomLeft: 12,
        borderRadiusBottomRight: 12,
        borderWidth: 2,
        borderColor: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1,
        },

        showShadow: true,
        shadowX: 0,
        shadowY: 10,
        shadowBlur: 10,
        shadowSpread: -5,
        shadowColor: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0.3,
        },
    };

    const settings = reactive(applyDefaults(cloneDeep(defaults), settingsDefaults));

    return { settings, settingsDefaults };
}
