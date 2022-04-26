import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { pick, defaults as applyDefaults } from 'lodash';

export const defaults = {
    editorTabSize: 4,
    editorLanguage: 'php',
    editorOrientation: 'left',
    editorInitialValue: '<?php\n\n',

    previewThemeName: 'github-light',
    previewFontSize: 16,
    previewFontFamily: 'font-mono',
    previewLineHeight: 20,

    exportPixelRatio: 3,

    stripIntialPhpTag: true,
};

export default defineStore('preferences', {
    state: () => {
        const state = useStorage('preferences', defaults);

        // Here we are enforcing the hydration of the default
        // preference values and also removing any keys
        // that may have been removed from an update.
        // prettier-ignore
        state.value = pick(
            applyDefaults(state.value, defaults), Object.keys(defaults)
        );

        return state;
    },

    actions: {
        reset() {
            if (confirm('Reset all preferences?')) {
                this.$state = defaults;
            }
        },
    },
});
