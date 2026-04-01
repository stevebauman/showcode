<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="max-h-[85vh] max-w-3xl gap-0 overflow-hidden p-0">
            <Tabs v-model="activeTab" orientation="vertical" class="flex h-[600px]">
                <!-- Sidebar -->
                <div
                    class="flex w-48 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                    <DialogHeader class="px-2 pb-3 pt-1">
                        <DialogTitle class="text-sm font-semibold">Settings</DialogTitle>
                    </DialogHeader>

                    <TabsList class="flex h-auto flex-col items-stretch gap-0.5 bg-transparent p-0">
                        <TabsTrigger
                            v-for="tab in tabs"
                            :key="tab.value"
                            :value="tab.value"
                            class="justify-start gap-2 rounded-md px-2 py-1.5 text-xs font-medium data-[state=active]:bg-zinc-200 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-800"
                        >
                            <component :is="tab.icon" class="h-3.5 w-3.5" />
                            {{ tab.label }}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-hidden">
                    <ScrollArea class="h-full">
                        <div class="p-5">
                            <!-- Editor -->
                            <TabsContent value="editor" class="mt-0 space-y-4">
                                <SettingsSection title="Language & Position">
                                    <SettingsRow label="Default Language">
                                        <Select v-model="preferences.editorLanguage">
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="lang in languages"
                                                    :key="lang"
                                                    :value="lang"
                                                >
                                                    {{ lang }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>

                                    <SettingsRow label="Panel Position">
                                        <Select v-model="preferences.editorOrientation">
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="pos in [
                                                        'top',
                                                        'left',
                                                        'bottom',
                                                        'right',
                                                    ]"
                                                    :key="pos"
                                                    :value="pos"
                                                >
                                                    {{ pos }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>

                                    <SettingsRow label="Tab Size">
                                        <Select
                                            :model-value="String(preferences.editorTabSize)"
                                            @update:model-value="
                                                preferences.editorTabSize = Number($event)
                                            "
                                        >
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="s in [2, 4]"
                                                    :key="s"
                                                    :value="String(s)"
                                                >
                                                    {{ s }} spaces
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>
                                </SettingsSection>

                                <SettingsSection title="Themes">
                                    <SettingsRow label="Light Theme">
                                        <Select v-model="preferences.editorLightTheme">
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="theme in editorThemes"
                                                    :key="theme.name"
                                                    :value="theme.name"
                                                >
                                                    {{ theme.title }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>

                                    <SettingsRow label="Dark Theme">
                                        <Select v-model="preferences.editorDarkTheme">
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="theme in editorThemes"
                                                    :key="theme.name"
                                                    :value="theme.name"
                                                >
                                                    {{ theme.title }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>
                                </SettingsSection>

                                <SettingsSection title="Font">
                                    <SettingsRow label="Family">
                                        <Select v-model="preferences.editorFontFamily">
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="font in fontFamilies"
                                                    :key="font.name"
                                                    :value="font.name"
                                                >
                                                    {{ font.title }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>

                                    <SettingsRow label="Size">
                                        <Input
                                            min="1"
                                            type="number"
                                            v-model="preferences.editorFontSize"
                                            class="w-20"
                                        />
                                    </SettingsRow>

                                    <SettingsRow label="Line Height">
                                        <Input
                                            min="1"
                                            step="0.1"
                                            type="number"
                                            v-model="preferences.editorLineHeight"
                                            class="w-20"
                                        />
                                    </SettingsRow>

                                    <SettingsRow label="Ligatures">
                                        <Toggle v-model="preferences.editorFontLigatures" />
                                    </SettingsRow>
                                </SettingsSection>

                                <SettingsSection title="Behavior">
                                    <SettingsRow
                                        label="Strip Initial PHP Tag"
                                        description="Remove opening <?php tag from preview"
                                    >
                                        <Toggle v-model="preferences.stripIntialPhpTag" />
                                    </SettingsRow>
                                    <SettingsRow
                                        label="VIM Key Bindings"
                                        description="Enable VIM mode in code editor"
                                    >
                                        <Toggle v-model="preferences.editorVimMode" />
                                    </SettingsRow>
                                </SettingsSection>

                                <SettingsSection title="Initial Editor Value">
                                    <div
                                        class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
                                    >
                                        <Monaco
                                            :height="150"
                                            :tab-size="preferences.editorTabSize"
                                            :language="preferences.editorLanguage"
                                            v-model="preferences.editorInitialValue"
                                        />
                                    </div>
                                </SettingsSection>
                            </TabsContent>

                            <!-- Preview -->
                            <TabsContent value="preview" class="mt-0 space-y-4">
                                <SettingsSection title="Theme">
                                    <SettingsRow label="Default Theme">
                                        <Select v-model="preferences.previewThemeName">
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="theme in $shiki.themes()"
                                                    :key="theme"
                                                    :value="theme"
                                                >
                                                    {{ theme }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>
                                </SettingsSection>

                                <SettingsSection title="Font">
                                    <SettingsRow label="Family">
                                        <Select v-model="preferences.previewFontFamily">
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="font in fontFamilies"
                                                    :key="font.name"
                                                    :value="font.name"
                                                >
                                                    {{ font.title }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>

                                    <SettingsRow label="Size">
                                        <Input
                                            min="1"
                                            type="number"
                                            v-model="preferences.previewFontSize"
                                            class="w-20"
                                        />
                                    </SettingsRow>

                                    <SettingsRow label="Line Height">
                                        <Input
                                            min="0"
                                            type="number"
                                            v-model="preferences.previewLineHeight"
                                            class="w-20"
                                        />
                                    </SettingsRow>
                                </SettingsSection>

                                <SettingsSection title="Focus">
                                    <SettingsRow label="Blur Strength">
                                        <Input
                                            type="number"
                                            v-model="preferences.previewCodeBlurStrength"
                                            class="w-20"
                                        />
                                    </SettingsRow>
                                </SettingsSection>

                                <SettingsSection title="Fit to Window">
                                    <SettingsRow label="Always Lock">
                                        <Toggle v-model="preferences.previewLockToWindow" />
                                    </SettingsRow>

                                    <template v-if="preferences.previewLockToWindow">
                                        <SettingsRow label="Padding X">
                                            <Input
                                                v-model="preferences.previewLockToWindowPaddingX"
                                                class="w-20"
                                            />
                                        </SettingsRow>

                                        <SettingsRow label="Padding Y">
                                            <Input
                                                v-model="preferences.previewLockToWindowPaddingY"
                                                class="w-20"
                                            />
                                        </SettingsRow>
                                    </template>
                                </SettingsSection>
                            </TabsContent>

                            <!-- Social -->
                            <TabsContent value="social" class="mt-0 space-y-4">
                                <SettingsSection title="Social Badge">
                                    <SettingsRow label="Show Badge">
                                        <Toggle v-model="preferences.showSocialBadge" />
                                    </SettingsRow>

                                    <template v-if="preferences.showSocialBadge">
                                        <SettingsRow label="Platform">
                                            <Select v-model="preferences.socialType">
                                                <SelectTrigger class="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        v-for="type in socialTypes"
                                                        :key="type.name"
                                                        :value="type.name"
                                                    >
                                                        {{ type.title }}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </SettingsRow>

                                        <SettingsRow label="Position">
                                            <Select v-model="preferences.socialPosition">
                                                <SelectTrigger class="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        v-for="pos in socialPositions"
                                                        :key="pos.name"
                                                        :value="pos.name"
                                                    >
                                                        {{ pos.title }}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </SettingsRow>

                                        <SettingsRow label="Username">
                                            <Input
                                                v-model="preferences.socialUsername"
                                                class="w-40"
                                            />
                                        </SettingsRow>

                                        <SettingsRow label="Display Name">
                                            <Input
                                                v-model="preferences.socialDisplayName"
                                                class="w-40"
                                            />
                                        </SettingsRow>
                                    </template>
                                </SettingsSection>
                            </TabsContent>

                            <!-- Export -->
                            <TabsContent value="export" class="mt-0 space-y-4">
                                <SettingsSection title="Image Export">
                                    <SettingsRow
                                        label="Pixel Ratio"
                                        description="Higher values produce larger, sharper images"
                                    >
                                        <Select
                                            :model-value="String(preferences.exportPixelRatio)"
                                            @update:model-value="
                                                preferences.exportPixelRatio = Number($event)
                                            "
                                        >
                                            <SelectTrigger class="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="ratio in [1, 2, 3, 4, 5]"
                                                    :key="ratio"
                                                    :value="String(ratio)"
                                                >
                                                    {{ ratio }}x
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingsRow>
                                </SettingsSection>
                            </TabsContent>

                            <!-- Appearance -->
                            <TabsContent value="appearance" class="mt-0 space-y-4">
                                <h3
                                    class="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400"
                                >
                                    Theme
                                </h3>

                                <div class="flex items-center justify-center gap-3">
                                    <button
                                        v-for="mode in [
                                            { value: 'light', label: 'Light', icon: SunIcon },
                                            { value: 'dark', label: 'Dark', icon: MoonIcon },
                                            { value: 'auto', label: 'Auto', icon: SunriseIcon },
                                        ]"
                                        :key="mode.value"
                                        @click="setColorMode(mode.value)"
                                        class="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all"
                                        :class="
                                            (
                                                mode.value === 'auto'
                                                    ? isAutoColorScheme
                                                    : colorMode === mode.value && !isAutoColorScheme
                                            )
                                                ? 'border-zinc-900 bg-zinc-100 text-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                                                : 'border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-700 dark:hover:text-zinc-400'
                                        "
                                    >
                                        <component :is="mode.icon" class="h-6 w-6" />
                                        <span class="text-xs font-medium">{{ mode.label }}</span>
                                    </button>
                                </div>

                                <SettingsSection title="Danger Zone">
                                    <SettingsRow
                                        label="Reset All Preferences"
                                        description="This will restore all settings to their defaults"
                                    >
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            @click="preferences.reset()"
                                        >
                                            Reset
                                        </Button>
                                    </SettingsRow>
                                </SettingsSection>
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </div>
            </Tabs>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { orderBy } from 'lodash';
import { storeToRefs } from 'pinia';
import {
    CodeIcon,
    EyeIcon,
    ShareIcon,
    DownloadIcon,
    PaletteIcon,
    SunIcon,
    MoonIcon,
    SunriseIcon,
} from 'lucide-vue-next';
import useFonts from '@/composables/useFonts';
import useSocials from '@/composables/useSocials';
import useApplicationStore, { colorMode } from '@/composables/useApplicationStore';
import { computed, ref, onMounted } from 'vue';
import { default as usePreferencesStore, defaults } from '@/composables/usePreferencesStore';

defineProps({
    modelValue: { type: [Boolean, Object], default: false },
});

defineEmits(['update:modelValue']);

const { $shiki } = useNuxtApp();
const activeTab = ref('editor');
const isAutoColorScheme = ref(null);
const preferences = usePreferencesStore();
const { types: socialTypes, positions: socialPositions } = useSocials();

const { fontFamilies } = useFonts();

const languages = computed(() => orderBy($shiki.languages()));

const tabs = [
    { value: 'editor', label: 'Editor', icon: CodeIcon },
    { value: 'preview', label: 'Preview', icon: EyeIcon },
    { value: 'social', label: 'Social', icon: ShareIcon },
    { value: 'export', label: 'Export', icon: DownloadIcon },
    { value: 'appearance', label: 'Appearance', icon: PaletteIcon },
];

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
