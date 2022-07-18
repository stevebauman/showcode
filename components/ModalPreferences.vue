<template>
    <Modal
        v-bind="$attrs"
        v-on="$listeners"
        size="sm"
        class="space-y-4"
        header="Preferences"
        @opened="loadAutoColorScheme"
    >
        <div class="overflow-y-scroll max-h-[50rem] rounded-lg">
            <div class="mt-4 space-y-4">
                <FormGroup>
                    <Label>Editor Position</Label>

                    <Select
                        dusk="select-orientation"
                        v-model="preferences.editorOrientation"
                        :options="['top', 'left', 'bottom', 'right']"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Language</Label>

                    <Select
                        :options="languages"
                        dusk="select-language"
                        v-model="preferences.editorLanguage"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Light Theme</Label>

                    <Select
                        :options="editorThemes"
                        dusk="select-editor-light-theme"
                        v-model="preferences.editorLightTheme"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Dark Theme</Label>

                    <Select
                        :options="editorThemes"
                        dusk="select-editor-dark-theme"
                        v-model="preferences.editorDarkTheme"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Tab Size</Label>

                    <Select
                        :options="[2, 4]"
                        dusk="select-tab-size"
                        v-model="preferences.editorTabSize"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Font Size</Label>

                    <Select
                        :options="[4, 6, 8, 10, 12, 14, 16, 18]"
                        dusk="select-font-size"
                        v-model="preferences.editorFontSize"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Strip Initial PHP Tag</Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-strip-php-tag"
                            v-model="preferences.stripIntialPhpTag"
                        />

                        <div class="ml-2 text-sm text-ui-gray-500">
                            ({{ preferences.stripIntialPhpTag ? 'Yes' : 'No' }})
                        </div>
                    </div>
                </FormGroup>

                <FormDivider />

                <FormGroup>
                    <Label>Preview Theme</Label>

                    <Select v-model="preferences.previewThemeName" :options="$shiki.themes()" />
                </FormGroup>

                <FormGroup>
                    <Label>Preview Font Size</Label>

                    <Select v-model="preferences.previewFontSize" :options="fontSizes" />
                </FormGroup>

                <FormGroup>
                    <Label>Preview Font Family</Label>

                    <Select
                        v-model="preferences.previewFontFamily"
                        :options="fontFamilies"
                        :group="$config.isDesktop ? `group` : null"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Preview Line Height</Label>

                    <Select v-model="preferences.previewLineHeight" :options="lineHeights" />
                </FormGroup>

                <FormDivider />

                <FormGroup>
                    <Label>Always Lock Fit To Window</Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-preview-lock-to-window"
                            v-model="preferences.previewLockToWindow"
                        />

                        <div class="ml-2 text-sm text-ui-gray-500">
                            ({{ preferences.previewLockToWindow ? 'Yes' : 'No' }})
                        </div>
                    </div>
                </FormGroup>

                <template v-if="preferences.previewLockToWindow">
                    <FormGroup>
                        <Label>Default Padding X</Label>

                        <Input
                            size="sm"
                            dusk="input-preview-lock-to-window-padding-x"
                            v-model="preferences.previewLockToWindowPaddingX"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Default Padding Y</Label>

                        <Input
                            size="sm"
                            dusk="input-preview-lock-to-window-padding-y"
                            v-model="preferences.previewLockToWindowPaddingY"
                        />
                    </FormGroup>
                </template>

                <FormDivider />

                <FormGroup>
                    <Label>
                        Export Pixel Ratio
                        <br />
                        <span class="text-xs font-normal text-ui-gray-500">
                            Higher means larger export
                        </span>
                    </Label>

                    <Select v-model="preferences.exportPixelRatio" :options="[1, 2, 3, 4, 5]" />
                </FormGroup>

                <FormDivider />

                <FormGroup>
                    <Label>Appearance</Label>

                    <div class="flex items-center justify-between w-full gap-4">
                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :active="colorMode === 'light' && !isAutoColorScheme"
                                @click.native="setColorMode('light')"
                                class="flex items-center justify-center w-full rounded-lg"
                            >
                                <SunIcon class="h-8" />
                            </Button>

                            <Label>Light</Label>
                        </div>

                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :active="colorMode === 'dark' && !isAutoColorScheme"
                                @click.native="setColorMode('dark')"
                                class="flex items-center justify-center w-full rounded-lg"
                            >
                                <MoonIcon class="h-8" />
                            </Button>

                            <Label>Dark</Label>
                        </div>

                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :active="isAutoColorScheme"
                                @click.native="setColorMode('auto')"
                                class="flex items-center justify-center w-full rounded-lg"
                            >
                                <SunriseIcon class="h-8" />
                            </Button>

                            <Label>Auto</Label>
                        </div>
                    </div>
                </FormGroup>

                <FormDivider />

                <div>
                    <Label> Initial Editor Value </Label>

                    <div class="overflow-hidden border rounded-xl border-ui-gray-800">
                        <Monaco
                            :height="200"
                            :tab-size="preferences.editorTabSize"
                            :language="preferences.editorLanguage"
                            v-model="preferences.editorInitialValue"
                        />
                    </div>
                </div>

                <FormDivider />

                <FormGroup>
                    <Label>Reset All</Label>

                    <div>
                        <Button
                            size="xs"
                            variant="secondary"
                            class="border border-ui-gray-500"
                            @click.native="preferences.reset()"
                        >
                            Reset
                        </Button>
                    </div>
                </FormGroup>
            </div>
        </div>
    </Modal>
</template>

<script>
import { orderBy } from 'lodash';
import { storeToRefs } from 'pinia';
import { SunIcon, MoonIcon, SunriseIcon } from 'vue-feather-icons';
import useFonts from '@/composables/useFonts';
import { lineHeights } from '@/composables/usePreview';
import useButtonClasses from '@/composables/useButtonClasses';
import useApplicationStore from '@/composables/useApplicationStore';
import { computed, useContext, ref, onMounted } from '@nuxtjs/composition-api';
import { default as usePreferencesStore, defaults } from '@/composables/usePreferencesStore';

export default {
    components: {
        SunIcon,
        MoonIcon,
        SunriseIcon,
    },

    setup() {
        const isAutoColorScheme = ref(null);

        const { $shiki } = useContext();

        const preferences = usePreferencesStore();

        const { classes: buttonClasses } = useButtonClasses();

        const { colorMode } = storeToRefs(useApplicationStore());

        const languages = computed(() => orderBy($shiki.languages()));

        const editorThemes = computed(() => {
            const themes = Object.keys(preferences.editorThemes).map((theme) => ({
                name: theme,
                title: preferences.editorThemes[theme],
            }));

            return orderBy(themes, 'title');
        });

        const setColorMode = (mode) => {
            isAutoColorScheme.value = mode === 'auto';

            colorMode.value = mode;
        };

        const loadAutoColorScheme = () => {
            isAutoColorScheme.value = window.localStorage.getItem('vueuse-color-scheme') === 'auto';
        };

        onMounted(loadAutoColorScheme);

        return {
            defaults,
            colorMode,
            languages,
            preferences,
            lineHeights,
            setColorMode,
            editorThemes,
            buttonClasses,
            isAutoColorScheme,
            loadAutoColorScheme,
            ...useFonts(),
        };
    },
};
</script>
