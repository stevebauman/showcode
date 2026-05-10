<template>
    <div>
        <ControlRow>
            <div class="flex w-full flex-col space-y-1 lg:w-auto">
                <Label>Theme</Label>

                <Select v-model="localSettings.themeName">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="theme in themes" :key="theme" :value="theme">
                            {{ theme }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="flex w-full flex-col space-y-1 lg:w-auto">
                <Label>Font Size</Label>

                <Input
                    min="1"
                    class="w-full lg:w-16"
                    type="number"
                    v-model="localSettings.fontSize"
                />
            </div>

            <div class="flex w-full flex-col space-y-1 lg:w-auto">
                <Label>Font Family</Label>

                <Select v-model="localSettings.fontFamily">
                    <SelectTrigger>
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
            </div>

            <div class="flex w-full flex-col space-y-1 lg:w-auto">
                <Label>Line Height</Label>

                <Input
                    min="0"
                    class="w-full lg:w-16"
                    type="number"
                    v-model="localSettings.lineHeight"
                />
            </div>

            <div class="flex w-full flex-col space-y-1 lg:w-auto" :class="frameLockedClasses">
                <Label>Position</Label>

                <div class="flex items-center">
                    <Select v-model="localSettings.position">
                        <SelectTrigger class="w-full lg:w-auto">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                    </Select>

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
                <div
                    class="flex flex-col items-center justify-between space-y-1"
                    :class="frameLockedClasses"
                >
                    <Label>Header</Label>

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
                    <Label>Line Numbers</Label>

                    <div class="flex items-center">
                        <Toggle v-model="localSettings.showLineNumbers" />
                    </div>
                </div>

                <div
                    class="flex flex-col items-center justify-between space-y-1"
                    :class="frameLockedClasses"
                >
                    <Label>Border</Label>

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

                <div
                    class="flex flex-col items-center justify-between space-y-1"
                    :class="frameLockedClasses"
                >
                    <Label>Shadow</Label>

                    <ToggleShadow
                        v-model="localSettings.showShadow"
                        :shadow-x="localSettings.shadowX"
                        :shadow-y="localSettings.shadowY"
                        :shadow-blur-sm="localSettings.shadowBlur"
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
                        @update:shadow-blur-sm="localSettings.shadowBlur = $event"
                        @update:shadow-color="localSettings.shadowColor = $event"
                        @update:shadow-spread="localSettings.shadowSpread = $event"
                    />
                </div>

                <div
                    class="flex flex-col items-center justify-between space-y-1"
                    :class="frameLockedClasses"
                >
                    <Label>Shine</Label>

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
                    <Label>Social Badge</Label>

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
                        <Label>Dividers</Label>

                        <div class="flex items-center">
                            <Toggle v-model="localSettings.showDividers" />
                        </div>
                    </div>

                    <div class="flex flex-col items-center justify-between space-y-1">
                        <Label>Orientation ({{ localSettings.landscape ? 'L' : 'P' }})</Label>

                        <div class="flex items-center">
                            <Toggle v-model="localSettings.landscape" />
                        </div>
                    </div>
                </template>
            </div>
        </ControlRow>

        <div
            class="flex w-full flex-col items-center justify-center gap-4 p-4 lg:flex-row lg:items-end"
        >
            <div class="flex w-full flex-col space-y-1 lg:w-auto" :class="frameLockedClasses">
                <Label class="flex items-center space-x-2">
                    <div>Border Radius</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        ({{ localSettings.borderRadius }} px)
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="w-40"
                        :max="40"
                        :step="1"
                        :model-value="[localSettings.borderRadius]"
                        @update:model-value="localSettings.borderRadius = $event[0]"
                        :disabled="frameSelected || !localSettings.borderRadiusLocked"
                    />

                    <ButtonLock
                        variant="ghost"
                        class="h-auto rounded-full p-1"
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
                        <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                            <div
                                class="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800"
                            >
                                <div class="flex items-center justify-between p-2">
                                    <Label>Top Left</Label>

                                    <Input
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.borderRadiusTopLeft"
                                    />
                                </div>

                                <div class="flex items-center justify-between p-2">
                                    <Label>Top Right</Label>

                                    <Input
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.borderRadiusTopRight"
                                    />
                                </div>
                            </div>

                            <div
                                class="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800"
                            >
                                <div class="flex items-center justify-between space-x-2 p-2">
                                    <Label>Bottom Left</Label>

                                    <Input
                                        type="number"
                                        class="w-16 text-center"
                                        v-model="localSettings.borderRadiusBottomLeft"
                                    />
                                </div>

                                <div class="flex items-center justify-between space-x-2 p-2">
                                    <Label>Bottom Right</Label>

                                    <Input
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

            <div class="flex w-full flex-col space-y-1 lg:w-auto" :class="frameLockedClasses">
                <Label class="flex items-center space-x-2">
                    <div>Opacity</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        ({{ Math.round(localSettings.themeOpacity * 100) }}%)
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="w-40"
                        :max="1"
                        :step="0.01"
                        :disabled="frameSelected"
                        :model-value="[localSettings.themeOpacity]"
                        @update:model-value="localSettings.themeOpacity = $event[0]"
                    />

                    <div class="size-6 shrink-0" />
                </div>
            </div>

            <div
                class="flex w-full flex-col space-y-1 transition-opacity lg:w-auto"
                :class="frameLockedClasses"
            >
                <Label class="flex items-center space-x-2">
                    <div>Scale</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        ({{ Math.round(localSettings.scale * 100) }}%)
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="w-40"
                        :max="4"
                        :step="0.01"
                        :disabled="frameSelected"
                        :model-value="[localSettings.scale]"
                        @update:model-value="localSettings.scale = $event[0]"
                    />

                    <div class="size-6 shrink-0" />
                </div>
            </div>

            <div class="flex w-full flex-col space-y-1 lg:w-auto" :class="frameLockedClasses">
                <Label class="flex items-center space-x-2">
                    <div>Window Padding</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        ({{ localSettings.padding }} px)
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="w-40"
                        :max="60"
                        :step="1"
                        :model-value="[localSettings.padding]"
                        @update:model-value="localSettings.padding = $event[0]"
                        :disabled="frameSelected || !localSettings.paddingLocked"
                    />

                    <ButtonLock
                        variant="ghost"
                        class="h-auto rounded-full p-1"
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
        </div>
    </div>
</template>

<script setup>
import useFonts from '@/composables/useFonts';
import useSettings from '@/composables/useSettings';
import { computed, reactive, unref, watch } from 'vue';

const props = defineProps({
    blocks: { type: Array, required: true },
    themes: { type: Array, required: true },
    settings: { type: Object, required: true },
});

const emit = defineEmits(['update']);

const { settingsDefaults } = useSettings();
const { fontFamilies } = useFonts();

const localSettings = reactive(unref(props.settings));
const frameSelected = computed(() => localSettings.frame && localSettings.frame !== 'none');
const frameLockedClasses = computed(() =>
    frameSelected.value ? 'pointer-events-none select-none opacity-40 grayscale' : ''
);

watch(localSettings, (value) => emit('update', value), { deep: true });
</script>
