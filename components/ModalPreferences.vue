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

                    <Select v-model="preferences.editorOrientation">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="pos in ['top', 'left', 'bottom', 'right']" :key="pos" :value="pos">{{ pos }}</SelectItem>
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Editor Language</Label>

                    <Select v-model="preferences.editorLanguage">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</SelectItem>
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Editor Light Theme</Label>

                    <Select v-model="preferences.editorLightTheme">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="theme in editorThemes" :key="theme.name" :value="theme.name">{{ theme.title }}</SelectItem>
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Editor Dark Theme</Label>

                    <Select v-model="preferences.editorDarkTheme">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="theme in editorThemes" :key="theme.name" :value="theme.name">{{ theme.title }}</SelectItem>
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Editor Font Size</Label>

                    <Input
                        min="1"
                        type="number"
                       
                        v-model="preferences.editorFontSize"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Font Family</Label>

                    <Select v-model="preferences.editorFontFamily">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="font in fontFamilies" :key="font.name" :value="font.name">{{ font.title }}</SelectItem>
                        </SelectContent>
                    </Select>
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
                        type="number"
                       
                        v-model="preferences.editorLineHeight"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Default Editor Tab Size</Label>

                    <Select :model-value="String(preferences.editorTabSize)" @update:model-value="preferences.editorTabSize = Number($event)">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="size in [2, 4]" :key="size" :value="String(size)">{{ size }}</SelectItem>
                        </SelectContent>
                    </Select>
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

                    <Select v-model="preferences.previewThemeName">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="theme in $shiki.themes()" :key="theme" :value="theme">{{ theme }}</SelectItem>
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Default Font Size</Label>

                    <Input min="1" type="number" v-model="preferences.previewFontSize" />
                </FormGroup>

                <FormGroup>
                    <Label>Default Font Family</Label>

                    <Select v-model="preferences.previewFontFamily">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="font in fontFamilies" :key="font.name" :value="font.name">{{ font.title }}</SelectItem>
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Default Line Height</Label>

                    <Input
                        min="0"
                        type="number"
                        v-model="preferences.previewLineHeight"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Focus Blur Strength</Label>

                    <Input type="number" v-model="preferences.previewCodeBlurStrength" />
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
                           
                            v-model="preferences.previewLockToWindowPaddingX"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Default Padding Y</Label>

                        <Input
                           
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

                        <Select v-model="preferences.socialType">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="type in socialTypes" :key="type.name" :value="type.name">{{ type.title }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Social Position</Label>

                        <Select v-model="preferences.socialPosition">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="pos in socialPositions" :key="pos.name" :value="pos.name">{{ pos.title }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Social Username</Label>

                        <Input
                           
                            v-model="preferences.socialUsername"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Social Display Name</Label>

                        <Input
                           
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

                    <Select :model-value="String(preferences.exportPixelRatio)" @update:model-value="preferences.exportPixelRatio = Number($event)">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="ratio in [1, 2, 3, 4, 5]" :key="ratio" :value="String(ratio)">{{ ratio }}</SelectItem>
                        </SelectContent>
                    </Select>
                </FormGroup>

                <FormDivider title="Application" />

                <FormGroup>
                    <Label>Appearance</Label>

                    <div class="flex items-center justify-between w-full gap-4">
                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :variant="colorMode === 'light' && !isAutoColorScheme ? 'default' : 'secondary'"
                                @click="setColorMode('light')"
                                class="flex items-center justify-center w-full"
                            >
                                <SunIcon class="h-8" />
                            </Button>

                            <Label>Light</Label>
                        </div>

                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :variant="colorMode === 'dark' && !isAutoColorScheme ? 'default' : 'secondary'"
                                @click="setColorMode('dark')"
                                class="flex items-center justify-center w-full"
                            >
                                <MoonIcon class="h-8" />
                            </Button>

                            <Label>Dark</Label>
                        </div>

                        <div class="flex flex-col items-center w-full space-y-2">
                            <Button
                                :variant="isAutoColorScheme ? 'default' : 'secondary'"
                                @click="setColorMode('auto')"
                                class="flex items-center justify-center w-full"
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
                            size="sm"
                            variant="outline"
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

<script setup>
import { orderBy } from 'lodash';
import { storeToRefs } from 'pinia';
import { SunIcon, MoonIcon, SunriseIcon } from 'lucide-vue-next';
import useFonts from '@/composables/useFonts';
import useSocials from '@/composables/useSocials';
import useApplicationStore from '@/composables/useApplicationStore';
import { computed, ref, onMounted } from 'vue';
import { default as usePreferencesStore, defaults } from '@/composables/usePreferencesStore';

const { $shiki } = useNuxtApp();
const isAutoColorScheme = ref(null);
const preferences = usePreferencesStore();
const { types: socialTypes, positions: socialPositions } = useSocials();
const { colorMode } = storeToRefs(useApplicationStore());
const { fontFamilies } = useFonts();

const languages = computed(() => orderBy($shiki.languages()));

const editorThemes = computed(() => {
    const themes = Object.keys(preferences.editorThemes).map((theme) => {
        let title = preferences.editorThemes[theme];
        if ([defaults.editorLightTheme, defaults.editorDarkTheme].includes(theme)) {
            title += ' (Default)';
        }
        return { name: theme, title };
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
</script>
