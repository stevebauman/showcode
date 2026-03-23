import { computed, reactive, toRefs, watch } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import themes from 'monaco-themes/themes/themelist.json';
import { pick, defaults as applyDefaults } from 'lodash';

export const defaults = {
    editorTabSize: 4,
    editorFontSize: 14,
    editorLineHeight: 1.5,
    editorFontLigatures: false,
    editorFontFamily: 'font-mono-lisa',
    editorLanguage: 'php',
    editorOrientation: 'left',
    editorLightTheme: 'vs-light',
    editorDarkTheme: 'merbivore',
    editorInitialValue: '<?php\n\n',

    previewFontSize: 16,
    previewLineHeight: 20,
    previewCodeBlurStrength: 1,
    previewFontFamily: 'font-mono-lisa',
    previewThemeName: 'github-dark',

    previewLockToWindow: false,
    previewLockToWindowPaddingX: 0,
    previewLockToWindowPaddingY: 0,

    exportPixelRatio: 3,

    stripIntialPhpTag: true,

    showSocialBadge: false,
    socialType: 'x',
    socialUsername: 'username',
    socialDisplayName: 'Display Name',
    socialPosition: 'bottom-center',
};

function normalizePreferences(value) {
    return pick(applyDefaults(value ?? {}, defaults), Object.keys(defaults));
}

export default defineStore('preferences', () => {
    const storage = useLocalStorage('preferences', defaults);
    const state = reactive(normalizePreferences(storage.value));
    let syncingFromStorage = false;
    let syncingToStorage = false;

    watch(
        storage,
        (value) => {
            if (syncingToStorage) {
                syncingToStorage = false;

                return;
            }

            syncingFromStorage = true;
            Object.assign(state, normalizePreferences(value));
        },
        { deep: true }
    );

    watch(
        state,
        (value) => {
            if (syncingFromStorage) {
                syncingFromStorage = false;

                return;
            }

            syncingToStorage = true;
            storage.value = normalizePreferences(value);
        },
        { deep: true }
    );

    const editorThemes = computed(() => ({
        vs: 'Visual Studio',
        'vs-light': 'Visual Studio Light',
        'vs-dark': 'Visual Studio Dark',
        'hc-black': 'High Contrast Black',
        ...themes,
    }));

    function reset() {
        if (confirm('Reset all preferences?')) {
            Object.assign(state, defaults);
        }
    }

    return {
        ...toRefs(state),
        editorThemes,
        reset,
    };
});
