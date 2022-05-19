<template>
    <Element>
        <Window
            ref="window"
            class="z-[1] absolute flex-shrink-0 exclude-from-panzoom"
            :blocks="blocks"
            :settings="settings"
            :dusk="`window-${settings.themeName}`"
            @update:title="(title) => (settings.title = title)"
        />

        <portal :to="element.id">
            <ControlTabs
                @changed="controlTabChanged"
                :tabs="[
                    { name: 'code-preview', title: 'Preview' },
                    { name: 'themes', title: 'Themes' },
                ]"
            >
                <template #default="{ active }">
                    <div v-show="active === 'themes'" dusk="control-themes" class="w-full">
                        <div
                            class="grid grid-flow-col grid-rows-2 gap-4 p-4 overflow-x-auto auto-cols-max scrollbar-hide"
                        >
                            <ButtonTheme
                                v-for="theme in $shiki.themes()"
                                @click.native="settings.themeName = theme"
                                :ref="`button-theme-${theme}`"
                                :dusk="`button-theme-${theme}`"
                                :key="theme"
                                :code="code"
                                :theme="theme"
                                :active="theme === settings.themeName"
                                :settings="settings"
                                :languages="languages"
                                :background="{}"
                            />
                        </div>
                    </div>

                    <div v-show="active === 'code-preview'" dusk="control-preview">
                        <ControlRow>
                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label> Theme </Label>

                                <Select
                                    dusk="select-theme"
                                    v-model="settings.themeName"
                                    :options="$shiki.themes()"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label> Font Size </Label>

                                <Select
                                    dusk="select-font-size"
                                    v-model="settings.fontSize"
                                    :options="[12, 14, 16, 18, 20]"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label> Font Family </Label>

                                <Select
                                    dusk="select-font-family"
                                    v-model="settings.fontFamily"
                                    :options="[
                                        { title: 'Default', name: 'font-mono' },
                                        { title: 'JetBrains Mono', name: 'font-mono-jetbrains' },
                                        { title: 'Mono Lisa', name: 'font-mono-lisa' },
                                    ]"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label> Line Height </Label>

                                <Select
                                    dusk="select-line-height"
                                    v-model="settings.lineHeight"
                                    :options="[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]"
                                />
                            </div>
                        </ControlRow>

                        <ControlRow>
                            <div class="flex flex-row gap-6">
                                <div class="flex flex-col items-center justify-between space-y-1">
                                    <Label> Header </Label>

                                    <div class="flex items-center">
                                        <Toggle
                                            dusk="toggle-header"
                                            v-model="settings.showHeader"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between space-y-1">
                                    <Label> Title </Label>

                                    <div class="flex items-center">
                                        <Toggle dusk="toggle-title" v-model="settings.showTitle" />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between space-y-1">
                                    <Label class="whitespace-nowrap"> Menu </Label>

                                    <div class="flex items-center">
                                        <Toggle
                                            dusk="toggle-color-menu"
                                            v-model="settings.showMenu"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between space-y-1">
                                    <Label class="whitespace-nowrap"> Menu Color </Label>

                                    <div class="flex items-center">
                                        <Toggle
                                            dusk="toggle-color-menu"
                                            v-model="settings.showColorMenu"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-row gap-6">
                                <div class="flex flex-col items-center justify-between space-y-1">
                                    <Label> Line Numbers </Label>

                                    <div class="flex items-center">
                                        <Toggle
                                            dusk="toggle-line-numbers"
                                            v-model="settings.showLineNumbers"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-between space-y-1">
                                    <Label> Shadow </Label>

                                    <div class="flex items-center">
                                        <Toggle
                                            dusk="toggle-shadow"
                                            v-model="settings.showShadow"
                                        />
                                    </div>
                                </div>

                                <div
                                    v-if="blocks.length > 1"
                                    class="flex flex-col items-center justify-between space-y-1"
                                >
                                    <Label>
                                        Orientation ({{ settings.landscape ? 'L' : 'P' }})
                                    </Label>

                                    <div class="flex items-center">
                                        <Toggle
                                            dusk="toggle-orientation"
                                            v-model="settings.landscape"
                                        />
                                    </div>
                                </div>
                            </div>
                        </ControlRow>

                        <ControlRow>
                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label
                                    dusk="label-border-radius"
                                    class="flex items-center space-x-2"
                                >
                                    <div>Border Radius</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ settings.borderRadius }} px)
                                    </span>
                                </Label>

                                <Range
                                    dusk="range-border-radius"
                                    max="20"
                                    step="1"
                                    v-model="settings.borderRadius"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label dusk="label-opacity" class="flex items-center space-x-2">
                                    <div>Opacity</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ Math.round(settings.themeOpacity * 100) }}%)
                                    </span>
                                </Label>

                                <Range
                                    dusk="range-theme-opacity"
                                    max="1"
                                    step="0.01"
                                    v-model="settings.themeOpacity"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label dusk="label-scale" class="flex items-center space-x-2">
                                    <div>Scale</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ Math.round(settings.scale * 100) }}%)
                                    </span>
                                </Label>

                                <Range
                                    dusk="range-scale"
                                    max="4"
                                    step="0.01"
                                    v-model="settings.scale"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label class="flex items-center space-x-2">
                                    <div>Window Padding</div>

                                    <span class="text-xs text-ui-gray-500">
                                        ({{ settings.padding }} px)
                                    </span>
                                </Label>

                                <Range
                                    dusk="range-padding"
                                    max="60"
                                    step="1"
                                    v-model="settings.padding"
                                />
                            </div>
                        </ControlRow>
                    </div>
                </template>
            </ControlTabs>
        </portal>
    </Element>
</template>

<script>
import Vue from 'vue';
import { debounce } from 'lodash';
import {
    computed,
    nextTick,
    onMounted,
    reactive,
    ref,
    toRefs,
    useContext,
    watch,
} from '@nuxtjs/composition-api';
import { DEFAULT_BACKGROUND } from '../../composables/useBackgrounds';
import usePreferencesStore from '../../composables/usePreferencesStore';
import useShiki from '../../composables/useShiki';

export default {
    inheritAttrs: false,

    props: {
        code: {
            type: Array,
            required: true,
        },
        languages: {
            type: Array,
            required: true,
        },
        element: {
            type: Object,
            required: true,
        },
    },

    setup(props) {
        const { $queue, $shiki } = useContext();

        const { buildCodeBlocks } = useShiki();

        const { code, languages } = toRefs(props);

        const preferences = usePreferencesStore();

        const blocks = ref([]);

        const settings = reactive({
            width: 400,
            height: 200,
            landscape: false,
            showHeader: true,
            showTitle: true,
            showShadow: true,
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
        });

        const { themeName, themeType, themeOpacity, themeBackground } = toRefs(settings);

        const generateTokens = () => {
            $queue.push(async () => {
                await buildCodeBlocks(
                    {
                        code: code.value,
                        languages: languages.value,
                        theme: themeName.value,
                        opacity: themeOpacity.value,
                    },
                    ({ blocks: code, themeType: type, themeBackground: bg }) => {
                        blocks.value = code;
                        themeType.value = type;
                        themeBackground.value = bg;
                    }
                );
            });
        };

        const scrollRefIntoView = (ref) => {
            const component = head(context.refs[ref] ?? []);

            if (!component) {
                return;
            }

            const el = component instanceof Vue ? component.$el : component;

            el.scrollIntoView({
                block: 'nearest',
                inline: 'center',
            });
        };

        const scrollSelectedThemeIntoView = () =>
            scrollRefIntoView(`button-theme-${themeName.value}`);

        const controlTabChanged = (tab) => {
            if (tab === 'themes') {
                return nextTick(scrollSelectedThemeIntoView);
            }
        };

        onMounted(() => {
            generateTokens();

            // Our code will change quickly. We will make
            // sure to debounce the token generation
            // so performance doesn't take a hit.
            watch(code, debounce(generateTokens, 500));

            watch([languages, themeName, themeOpacity], generateTokens);
        });

        return { blocks, settings, controlTabChanged };
    },
};
</script>
