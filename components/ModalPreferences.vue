<template>
    <Modal
        v-bind="$attrs"
       
        size="sm"
        class="space-y-4"
        header="Preferences"
        @opened="loadAutoColorScheme"
    >
        <div class="rounded-lg">
            <div class="mt-4 space-y-6">
                <FormDivider title="Code Editor" />

                <FormGroup>
                    <Label>Editor Position</Label>

                    <Select
                       
                        v-model="preferences.editorOrientation"
                        :options="['top', 'left', 'bottom', 'right']"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Language</Label>

                    <Select
                        :options="languages"
                       
                        v-model="preferences.editorLanguage"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Light Theme</Label>

                    <Select
                        :options="editorThemes"
                       
                        v-model="preferences.editorLightTheme"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Dark Theme</Label>

                    <Select
                        :options="editorThemes"
                       
                        v-model="preferences.editorDarkTheme"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Font Size</Label>

                    <Input
                        min="1"
                        size="sm"
                        type="number"
                       
                        v-model="preferences.editorFontSize"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Font Family</Label>

                    <Select
                       
                        v-model="preferences.editorFontFamily"
                        :options="fontFamilies"
                        :group="$config.isDesktop ? `group` : null"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Font Ligatures</Label>

                    <div class="flex items-center">
                        <Toggle
                           
                            v-model="preferences.editorFontLigatures"
                        />

                        <div class="ml-2 text-sm text-ui-gray-500">
                            ({{ preferences.editorFontLigatures ? 'Yes' : 'No' }})
                        </div>
                    </div>
                </FormGroup>

                <FormGroup>
                    <Label>Editor Line Height</Label>

                    <Input
                        min="1"
                        step="0.1"
                        size="sm"
                        type="number"
                       
                        v-model="preferences.editorLineHeight"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Default Editor Tab Size</Label>

                    <Select
                        :options="[2, 4]"
                       
                        v-model="preferences.editorTabSize"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Strip Initial PHP Tag</Label>

                    <div class="flex items-center">
                        <Toggle
                           
                            v-model="preferences.stripIntialPhpTag"
                        />

                        <div class="ml-2 text-sm text-ui-gray-500">
                            ({{ preferences.stripIntialPhpTag ? 'Yes' : 'No' }})
                        </div>
                    </div>
                </FormGroup>

                <FormDivider title="Code Preview" />

                <FormGroup>
                    <Label>Default Theme</Label>

                    <Select v-model="preferences.previewThemeName" :options="$shiki.themes()" />
                </FormGroup>

                <FormGroup>
                    <Label>Default Font Size</Label>

                    <Input min="1" size="sm" type="number" v-model="preferences.previewFontSize" />
                </FormGroup>

                <FormGroup>
                    <Label>Default Font Family</Label>

                    <Select
                        v-model="preferences.previewFontFamily"
                        :options="fontFamilies"
                        :group="$config.isDesktop ? `group` : null"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Default Line Height</Label>

                    <Input
                        min="0"
                        size="sm"
                        type="number"
                        v-model="preferences.previewLineHeight"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Focus Blur Strength</Label>

                    <Input size="sm" type="number" v-model="preferences.previewCodeBlurStrength" />
                </FormGroup>

                <FormGroup>
                    <Label>Always Lock Fit To Window</Label>

                    <div class="flex items-center">
                        <Toggle
                           
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
                           
                            v-model="preferences.previewLockToWindowPaddingX"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Default Padding Y</Label>

                        <Input
                            size="sm"
                           
                            v-model="preferences.previewLockToWindowPaddingY"
                        />
                    </FormGroup>
                </template>

                <FormGroup>
                    <Label>Show Social Badge</Label>

                    <div class="flex items-center">
                        <Toggle v-model="preferences.showSocialBadge" />

                        <div class="ml-2 text-sm text-ui-gray-500">
                            ({{ preferences.showSocialBadge ? 'Yes' : 'No' }})
                        </div>
                    </div>
                </FormGroup>

                <template v-if="preferences.showSocialBadge">
                    <FormGroup>
                        <Label>Social Type</Label>

                        <Select v-model="preferences.socialType" :options="socialTypes" />
                    </FormGroup>

                    <FormGroup>
                        <Label>Social Position</Label>

                        <Select v-model="preferences.socialPosition" :options="socialPositions" />
                    </FormGroup>

                    <FormGroup>
                        <Label>Social Username</Label>

                        <Input
                            size="sm"
                           
                            v-model="preferences.socialUsername"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Social Display Name</Label>

                        <Input
                            size="sm"
                           
                            v-model="preferences.socialDisplayName"
                        />
                    </FormGroup>
                </template>

                <FormDivider title="Export" />

                <FormGroup>
                    <Label>
                        Export Pixel Ratio
                        <br />
                        <span class="text-xs font-normal text-ui-gray-400">
                            Higher means larger export
                        </span>
                    </Label>

                    <Select v-model="preferences.exportPixelRatio" :options="[1, 2, 3, 4, 5]" />
                </FormGroup>

                <FormDivider title="Application" />

                <FormGroup>
                    <Label>Appearance</Label>

                    <div class="flex items-center justify-between w-full gap-4">
                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :active="colorMode === 'light' && !isAutoColorScheme"
                                @click="setColorMode('light')"
                                class="flex items-center justify-center w-full rounded-lg"
                            >
                                <SunIcon class="h-8" />
                            </Button>

                            <Label>Light</Label>
                        </div>

                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :active="colorMode === 'dark' && !isAutoColorScheme"
                                @click="setColorMode('dark')"
                                class="flex items-center justify-center w-full rounded-lg"
                            >
                                <MoonIcon class="h-8" />
                            </Button>

                            <Label>Dark</Label>
                        </div>

                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :active="isAutoColorScheme"
                                @click="setColorMode('auto')"
                                class="flex items-center justify-center w-full rounded-lg"
                            >
                                <SunriseIcon class="h-8" />
                            </Button>

                            <Label>Auto</Label>
                        </div>
                    </div>
                </FormGroup>

                <FormDivider title="Initial Editor Value" />

                <div class="overflow-hidden border rounded-xl border-ui-gray-800">
                    <Monaco
                        :height="200"
                        :tab-size="preferences.editorTabSize"
                        :language="preferences.editorLanguage"
                        v-model="preferences.editorInitialValue"
                    />
                </div>

                <FormDivider title="Danger Zone" />

                <FormGroup>
                    <Label>Reset All</Label>

                    <div>
                        <Button
                            size="xs"
                            variant="secondary"
                            class="border border-ui-gray-500"
                            @click="preferences.reset()"
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
import { SunIcon, MoonIcon, SunriseIcon } from 'lucide-vue-next';
import useFonts from '@/composables/useFonts';
import useSocials from '@/composables/useSocials';
import useButtonClasses from '@/composables/useButtonClasses';
import useApplicationStore from '@/composables/useApplicationStore';
import { computed, ref, onMounted } from 'vue';
import { default as usePreferencesStore, defaults } from '@/composables/usePreferencesStore';

export default {
    components: {
        SunIcon,
        MoonIcon,
        SunriseIcon,
    },

    setup() {
        const { $shiki } = useNuxtApp();

        const isAutoColorScheme = ref(null);

        const preferences = usePreferencesStore();

        const { classes: buttonClasses } = useButtonClasses();

        const { types: socialTypes, positions: socialPositions } = useSocials();

        const { colorMode } = storeToRefs(useApplicationStore());

        const languages = computed(() => orderBy($shiki.languages()));

        const editorThemes = computed(() => {
            const themes = Object.keys(preferences.editorThemes).map((theme) => {
                let title = preferences.editorThemes[theme];

                if ([defaults.editorLightTheme, defaults.editorDarkTheme].includes(theme)) {
                    title += ' (Default)';
                }

                return {
                    name: theme,
                    title: title,
                };
            });

            return orderBy(themes, 'title');
        });

        function setColorMode(mode) {
            isAutoColorScheme.value = mode === 'auto';

            colorMode.value = mode;
        }

        function loadAutoColorScheme() {
            isAutoColorScheme.value = window.localStorage.getItem('vueuse-color-scheme') === 'auto';
        }

        onMounted(loadAutoColorScheme);

        return {
            defaults,
            colorMode,
            languages,
            preferences,
            setColorMode,
            editorThemes,
            buttonClasses,
            socialTypes,
            socialPositions,
            isAutoColorScheme,
            loadAutoColorScheme,
            ...useFonts(),
        };
    },
};
</script>
