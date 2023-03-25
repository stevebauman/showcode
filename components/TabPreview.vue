<template>
    <div dusk="control-preview">
        <ControlRow>
            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Theme </Label>

                <Select dusk="select-theme" v-model="localSettings.themeName" :options="themes" />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Font Size </Label>

                <Input
                    min="1"
                    size="sm"
                    class="w-full lg:w-16"
                    type="number"
                    dusk="input-font-size"
                    v-model="localSettings.fontSize"
                />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Font Family </Label>

                <Select
                    dusk="select-font-family"
                    v-model="localSettings.fontFamily"
                    :options="fontFamilies"
                    :group="$config.isDesktop ? `group` : null"
                />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Line Height </Label>

                <Input
                    min="0"
                    size="sm"
                    class="w-full lg:w-16"
                    type="number"
                    dusk="input-line-height"
                    v-model="localSettings.lineHeight"
                />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Position </Label>

                <div class="flex items-center">
                    <Select
                        class="w-full lg:w-auto"
                        dusk="select-position"
                        v-model="localSettings.position"
                        :options="[
                            { title: 'Center', name: 'center' },
                            { title: 'Top', name: 'top' },
                            { title: 'Bottom', name: 'bottom' },
                            { title: 'Left', name: 'left' },
                            { title: 'Right', name: 'right' },
                        ]"
                    />

                    <PopoverSettings
                        title="Margin Properties"
                        tooltip="Configure Margin"
                        class="mx-1"
                        @reset="
                            localSettings.marginTop = settingsDefaults.marginTop;
                            localSettings.marginBottom = settingsDefaults.marginTop;
                            localSettings.marginLeft = settingsDefaults.marginLeft;
                            localSettings.marginRight = settingsDefaults.marginRight;
                        "
                    >
                        <div class="flex flex-col divide-y divide-ui-gray-800">
                            <div class="flex flex-col items-center justify-center gap-2 p-2">
                                <Label>Top</Label>

                                <Input
                                    size="sm"
                                    type="number"
                                    class="w-16 text-center"
                                    v-model="localSettings.marginTop"
                                />
                            </div>

                            <div class="flex justify-between divide-x divide-ui-gray-800">
                                <div class="flex items-center gap-2 p-4">
                                    <Label>Left</Label>

                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.marginLeft"
                                    />
                                </div>

                                <div class="flex items-center gap-2 p-4">
                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.marginRight"
                                    />

                                    <Label>Right</Label>
                                </div>
                            </div>

                            <div class="flex flex-col items-center justify-center gap-2 p-2">
                                <Input
                                    size="sm"
                                    type="number"
                                    class="w-16 text-center"
                                    v-model="localSettings.marginBottom"
                                />

                                <Label>Bottom</Label>
                            </div>
                        </div>
                    </PopoverSettings>
                </div>
            </div>
        </ControlRow>

        <ControlRow>
            <div class="flex flex-row gap-6">
                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Header </Label>

                    <div class="flex items-center">
                        <Toggle dusk="toggle-header" v-model="localSettings.showHeader" />
                    </div>
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Accent </Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-header-accent"
                            v-model="localSettings.showHeaderAccent"
                        />
                    </div>
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Title </Label>

                    <div class="flex items-center">
                        <Toggle dusk="toggle-title" v-model="localSettings.showTitle" />
                    </div>
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label class="whitespace-nowrap"> Menu </Label>

                    <div class="flex items-center">
                        <Toggle dusk="toggle-color-menu" v-model="localSettings.showMenu" />
                    </div>
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label class="whitespace-nowrap"> Menu Color </Label>

                    <div class="flex items-center">
                        <Toggle dusk="toggle-color-menu" v-model="localSettings.showColorMenu" />
                    </div>
                </div>
            </div>

            <div class="flex flex-row gap-6">
                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Line Numbers </Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-line-numbers"
                            v-model="localSettings.showLineNumbers"
                        />
                    </div>
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Border </Label>

                    <ToggleBorder
                        dusk="toggle-border"
                        v-model="localSettings.showBorder"
                        :border-width="localSettings.borderWidth"
                        :border-color="localSettings.borderColor"
                        @reset="
                            localSettings.borderWidth = settingsDefaults.borderWidth;
                            localSettings.borderColor = settingsDefaults.borderColor;
                        "
                        @update:border-width="localSettings.borderWidth = $event"
                        @update:border-color="localSettings.borderColor = $event"
                    />
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Shadow </Label>

                    <ToggleShadow
                        dusk="toggle-shadow"
                        v-model="localSettings.showShadow"
                        :shadow-x="localSettings.shadowX"
                        :shadow-y="localSettings.shadowY"
                        :shadow-blur="localSettings.shadowBlur"
                        :shadow-color="localSettings.shadowColor"
                        :shadow-spread="localSettings.shadowSpread"
                        @reset="
                            localSettings.shadowX = settingsDefaults.shadowX;
                            localSettings.shadowY = settingsDefaults.shadowY;
                            localSettings.shadowBlur = settingsDefaults.shadowBlur;
                            localSettings.shadowColor = settingsDefaults.shadowColor;
                            localSettings.shadowSpread = settingsDefaults.shadowSpread;
                        "
                        @update:shadow-x="localSettings.shadowX = $event"
                        @update:shadow-y="localSettings.shadowY = $event"
                        @update:shadow-blur="localSettings.shadowBlur = $event"
                        @update:shadow-color="localSettings.shadowColor = $event"
                        @update:shadow-spread="localSettings.shadowSpread = $event"
                    />
                </div>

                <template v-if="blocks.length > 1">
                    <div class="flex flex-col items-center justify-between space-y-1">
                        <Label>Dividers</Label>

                        <div class="flex items-center">
                            <Toggle dusk="toggle-dividers" v-model="localSettings.showDividers" />
                        </div>
                    </div>

                    <div class="flex flex-col items-center justify-between space-y-1">
                        <Label> Orientation ({{ localSettings.landscape ? 'L' : 'P' }}) </Label>

                        <div class="flex items-center">
                            <Toggle dusk="toggle-orientation" v-model="localSettings.landscape" />
                        </div>
                    </div>
                </template>
            </div>
        </ControlRow>

        <ControlRow>
            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label dusk="label-border-radius" class="flex items-center space-x-2">
                    <div>Border Radius</div>

                    <span class="text-xs text-ui-gray-500">
                        ({{ localSettings.borderRadius }} px)
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Range
                        max="40"
                        step="1"
                        dusk="range-border-radius"
                        v-model="localSettings.borderRadius"
                        :disabled="!localSettings.borderRadiusLocked"
                    />

                    <ButtonLock
                        size="none"
                        :rounded="false"
                        class="p-1 rounded-full"
                        :locked="localSettings.borderRadiusLocked"
                        @click.native="
                            localSettings.borderRadiusLocked = !localSettings.borderRadiusLocked
                        "
                        v-tooltip="
                            localSettings.borderRadiusLocked ? 'Unlock Corners' : 'Lock Corners'
                        "
                    />

                    <PopoverSettings
                        v-if="!localSettings.borderRadiusLocked"
                        title="Border Radius Properties"
                        tooltip="Configure Border Radius"
                        @reset="
                            localSettings.borderRadiusTopLeft =
                                settingsDefaults.borderRadiusTopLeft;
                            localSettings.borderRadiusTopRight =
                                settingsDefaults.borderRadiusTopRight;
                            localSettings.borderRadiusBottomLeft =
                                settingsDefaults.borderRadiusBottomLeft;
                            localSettings.borderRadiusBottomRight =
                                settingsDefaults.borderRadiusBottomRight;
                        "
                    >
                        <div class="flex flex-col divide-y divide-ui-gray-800">
                            <div class="grid grid-cols-2 divide-x divide-ui-gray-800">
                                <div class="flex items-center justify-between p-2">
                                    <Label>Top Left</Label>

                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.borderRadiusTopLeft"
                                    />
                                </div>

                                <div class="flex items-center justify-between p-2">
                                    <Label>Top Right</Label>

                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.borderRadiusTopRight"
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 divide-x divide-ui-gray-800">
                                <div class="flex items-center justify-between p-2 space-x-2">
                                    <Label>Bottom Left</Label>

                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.borderRadiusBottomLeft"
                                    />
                                </div>

                                <div class="flex items-center justify-between p-2 space-x-2">
                                    <Label>Bottom Right</Label>

                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.borderRadiusBottomRight"
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverSettings>
                </div>
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label dusk="label-opacity" class="flex items-center space-x-2">
                    <div>Opacity</div>

                    <span class="text-xs text-ui-gray-500">
                        ({{ Math.round(localSettings.themeOpacity * 100) }}%)
                    </span>
                </Label>

                <Range
                    max="1"
                    step="0.01"
                    dusk="range-theme-opacity"
                    v-model="localSettings.themeOpacity"
                />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label dusk="label-scale" class="flex items-center space-x-2">
                    <div>Scale</div>

                    <span class="text-xs text-ui-gray-500">
                        ({{ Math.round(localSettings.scale * 100) }}%)
                    </span>
                </Label>

                <Range max="4" step="0.01" dusk="range-scale" v-model="localSettings.scale" />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label class="flex items-center space-x-2">
                    <div>Window Padding</div>

                    <span class="text-xs text-ui-gray-500"> ({{ localSettings.padding }} px) </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Range
                        max="60"
                        step="1"
                        class="w-full"
                        dusk="range-padding"
                        v-model="localSettings.padding"
                        :disabled="!localSettings.paddingLocked"
                    />

                    <ButtonLock
                        size="none"
                        :rounded="false"
                        class="p-1 rounded-full"
                        :locked="localSettings.paddingLocked"
                        @click.native="localSettings.paddingLocked = !localSettings.paddingLocked"
                        v-tooltip="
                            localSettings.paddingLocked ? 'Unlock All Sides' : 'Lock All Sides'
                        "
                    />

                    <PopoverSettings
                        v-if="!localSettings.paddingLocked"
                        title="Padding Properties"
                        tooltip="Configure Padding"
                        @reset="
                            localSettings.paddingTop = settingsDefaults.paddingTop;
                            localSettings.paddingBottom = settingsDefaults.paddingBottom;
                            localSettings.paddingLeft = settingsDefaults.paddingLeft;
                            localSettings.paddingRigh = settingsDefaults.paddingRight;
                        "
                    >
                        <div class="flex flex-col divide-y divide-ui-gray-800">
                            <div class="flex flex-col items-center justify-center gap-2 p-2">
                                <Label>Top</Label>

                                <Input
                                    size="sm"
                                    type="number"
                                    class="w-16 text-center"
                                    v-model="localSettings.paddingTop"
                                />
                            </div>

                            <div class="flex justify-between divide-x divide-ui-gray-800">
                                <div class="flex items-center gap-2 p-4">
                                    <Label>Left</Label>

                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.paddingLeft"
                                    />
                                </div>

                                <div class="flex items-center gap-2 p-4">
                                    <Input
                                        size="sm"
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.paddingRight"
                                    />

                                    <Label>Right</Label>
                                </div>
                            </div>

                            <div class="flex flex-col items-center justify-center gap-2 p-2">
                                <Input
                                    size="sm"
                                    type="number"
                                    class="w-16 text-center"
                                    v-model="localSettings.paddingBottom"
                                />

                                <Label>Bottom</Label>
                            </div>
                        </div>
                    </PopoverSettings>
                </div>
            </div>
        </ControlRow>
    </div>
</template>

<script>
import useFonts from '@/composables/useFonts';
import { reactive, unref, watch } from '@nuxtjs/composition-api';

export default {
    props: {
        blocks: {
            type: Array,
            required: true,
        },
        themes: {
            type: Array,
            required: true,
        },
        settings: {
            type: Object,
            required: true,
        },
    },

    setup(props, { emit }) {
        const localSettings = reactive(unref(props.settings));

        watch(localSettings, () => emit('update', localSettings), { deep: true });

        return { localSettings, ...useFonts() };
    },
};
</script>
