<template>
    <div>
        <ControlRow>
            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Theme </Label>

                <Select v-model="localSettings.themeName" :options="themes" />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Font Size </Label>

                <Input
                    min="1"
                    size="sm"
                    class="w-full lg:w-16"
                    type="number"
                   
                    v-model="localSettings.fontSize"
                />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Font Family </Label>

                <Select
                   
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
                   
                    v-model="localSettings.lineHeight"
                />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label> Position </Label>

                <div class="flex items-center">
                    <Select
                        class="w-full lg:w-auto"
                       
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
                        <InputMargin
                            :margin-top="localSettings.marginTop"
                            :margin-bottom="localSettings.marginBottom"
                            :margin-left="localSettings.marginLeft"
                            :margin-right="localSettings.marginRight"
                            @update:margin-top="localSettings.marginTop = $event"
                            @update:margin-bottom="localSettings.marginBottom = $event"
                            @update:margin-left="localSettings.marginLeft = $event"
                            @update:margin-right="localSettings.marginRight = $event"
                        />
                    </PopoverSettings>
                </div>
            </div>
        </ControlRow>

        <ControlRow>
            <div class="flex flex-row gap-6">
                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Header </Label>

                    <div class="flex items-center">
                        <ToggleHeader
                           
                            v-model="localSettings.showHeader"
                            :show-title="localSettings.showTitle"
                            :show-menu="localSettings.showMenu"
                            :show-color-menu="localSettings.showColorMenu"
                            :show-header-accent="localSettings.showHeaderAccent"
                            @update:show-menu="localSettings.showMenu = $event"
                            @update:show-title="localSettings.showTitle = $event"
                            @update:show-color-menu="localSettings.showColorMenu = $event"
                            @update:show-header-accent="localSettings.showHeaderAccent = $event"
                        />
                    </div>
                </div>
            </div>

            <div class="flex flex-row gap-6">
                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Line Numbers </Label>

                    <div class="flex items-center">
                        <Toggle
                           
                            v-model="localSettings.showLineNumbers"
                        />
                    </div>
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Border </Label>

                    <ToggleBorder
                       
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

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Shine </Label>

                    <ToggleShine
                       
                        v-model="localSettings.showShine"
                        :shine-width="localSettings.shineWidth"
                        :shine-height="localSettings.shineHeight"
                        :shine-opacity="localSettings.shineOpacity"
                        @update:shine-width="localSettings.shineWidth = $event"
                        @update:shine-height="localSettings.shineHeight = $event"
                        @update:shine-opacity="localSettings.shineOpacity = $event"
                    />
                </div>

                <div class="flex flex-col items-center justify-between space-y-1">
                    <Label> Social Badge </Label>

                    <ToggleSocialBadge
                       
                        v-model="localSettings.showSocialBadge"
                        :social-type="localSettings.socialType"
                        :social-position="localSettings.socialPosition"
                        :social-username="localSettings.socialUsername"
                        :social-display-name="localSettings.socialDisplayName"
                        :social-border-radius="localSettings.socialBorderRadius"
                        @update:social-type="localSettings.socialType = $event"
                        @update:social-position="localSettings.socialPosition = $event"
                        @update:social-username="localSettings.socialUsername = $event"
                        @update:social-display-name="localSettings.socialDisplayName = $event"
                        @update:social-border-radius="
                            localSettings.socialBorderRadius = Number($event)
                        "
                    />
                </div>

                <template v-if="blocks.length > 1">
                    <div class="flex flex-col items-center justify-between space-y-1">
                        <Label> Dividers </Label>

                        <div class="flex items-center">
                            <Toggle v-model="localSettings.showDividers" />
                        </div>
                    </div>

                    <div class="flex flex-col items-center justify-between space-y-1">
                        <Label> Orientation ({{ localSettings.landscape ? 'L' : 'P' }}) </Label>

                        <div class="flex items-center">
                            <Toggle v-model="localSettings.landscape" />
                        </div>
                    </div>
                </template>
            </div>
        </ControlRow>

        <ControlRow>
            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label class="flex items-center space-x-2">
                    <div>Border Radius</div>

                    <span class="text-xs text-ui-gray-500">
                        ({{ localSettings.borderRadius }} px)
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Range
                        max="40"
                        step="1"
                       
                        v-model="localSettings.borderRadius"
                        :disabled="!localSettings.borderRadiusLocked"
                    />

                    <ButtonLock
                        size="none"
                        :rounded="false"
                        class="p-1 rounded-full"
                        :locked="localSettings.borderRadiusLocked"
                        @click="
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
                <Label class="flex items-center space-x-2">
                    <div>Opacity</div>

                    <span class="text-xs text-ui-gray-500">
                        ({{ Math.round(localSettings.themeOpacity * 100) }}%)
                    </span>
                </Label>

                <Range
                    max="1"
                    step="0.01"
                   
                    v-model="localSettings.themeOpacity"
                />
            </div>

            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                <Label class="flex items-center space-x-2">
                    <div>Scale</div>

                    <span class="text-xs text-ui-gray-500">
                        ({{ Math.round(localSettings.scale * 100) }}%)
                    </span>
                </Label>

                <Range max="4" step="0.01" v-model="localSettings.scale" />
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
                       
                        v-model="localSettings.padding"
                        :disabled="!localSettings.paddingLocked"
                    />

                    <ButtonLock
                        size="none"
                        :rounded="false"
                        class="p-1 rounded-full"
                        :locked="localSettings.paddingLocked"
                        @click="localSettings.paddingLocked = !localSettings.paddingLocked"
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
                        <InputMargin
                            :margin-top="localSettings.paddingTop"
                            :margin-bottom="localSettings.paddingBottom"
                            :margin-left="localSettings.paddingLeft"
                            :margin-right="localSettings.paddingRight"
                            @update:margin-top="localSettings.paddingTop = Number($event)"
                            @update:margin-bottom="localSettings.paddingBottom = Number($event)"
                            @update:margin-left="localSettings.paddingLeft = Number($event)"
                            @update:margin-right="localSettings.paddingRight = Number($event)"
                        />
                    </PopoverSettings>
                </div>
            </div>
        </ControlRow>
    </div>
</template>

<script>
import useFonts from '@/composables/useFonts';
import useSettings from '@/composables/useSettings';
import { reactive, unref, watch } from 'vue';

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
        const { settingsDefaults } = useSettings();

        const localSettings = reactive(unref(props.settings));

        watch(localSettings, (value) => emit('update', value), { deep: true });

        return { settingsDefaults, localSettings, ...useFonts() };
    },
};
</script>
