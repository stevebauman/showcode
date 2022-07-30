<template>
    <div class="relative bg-pattern bg-ui-gray-800">
        <Hotkeys :shortcuts="['S']" @triggered="copyToClipboard" />

        <ModalImageBackground
            v-model="showingBackgroundsModal"
            :blocks="blocks"
            :settings="settings"
            @saved="updateWithCustomBackground"
            @cancelled="showingBackgroundsModal = false"
        />

        <div class="absolute z-20 flex items-center justify-between w-full p-4">
            <a href="https://github.com/stevebauman/showcode" target="_blank">
                <Logo class="flex-shrink-0 w-12 h-12" />
            </a>

            <div class="flex flex-wrap items-center justify-center h-10 gap-2">
                <Button
                    size="sm"
                    type="button"
                    class="shadow"
                    dusk="button-copy"
                    variant="secondary"
                    @click.native="copyToClipboard"
                >
                    <CheckCircleIcon v-if="copied" class="w-4 h-4 text-green-400" />
                    <ClipboardIcon v-else class="w-4 h-4" />
                    <span class="hidden sm:inline">
                        {{ copied ? 'Copied!' : 'Copy Image' }}
                    </span>
                </Button>

                <Dropdown
                    size="sm"
                    variant="primary"
                    :items="fileTypes"
                    dusk="button-export"
                    class="inline-flex rounded-lg shadow"
                >
                    <ShareIcon class="w-4 h-4" />
                    <span class="hidden sm:inline"> Export Image </span>
                </Dropdown>

                <Button
                    v-if="!$config.isDesktop && $config.isDistributing"
                    size="sm"
                    href="/buy"
                    class="shadow"
                    target="_blank"
                    variant="primary"
                >
                    <ShoppingBagIcon class="w-4 h-4" />
                    <span class="hidden sm:inline"> Desktop App </span>
                </Button>
            </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center">
            <div ref="preview">
                <Canvas
                    ref="canvas"
                    dusk="canvas"
                    class="relative flex canvas"
                    :scale="settings.scale"
                    :width="settings.width"
                    :height="settings.height"
                    :position="settings.position"
                    :resizable="!lockWindowSize"
                    :aspect-ratio="settings.aspectRatio"
                    :background="settings.background"
                    :background-attributes="backgroundAttrs"
                    @update:width="setWidth($event)"
                    @update:height="setHeight($event)"
                >
                    <Window
                        ref="pane"
                        class="z-[1] absolute flex-shrink-0 exclude-from-panzoom"
                        :blocks="blocks"
                        :settings="settings"
                        :dusk="`window-${settings.themeName}`"
                        @update:title="settings.title = $event"
                    />
                </Canvas>
            </div>
        </div>

        <div class="absolute bottom-0 z-20 w-full">
            <div
                class="flex flex-row-reverse flex-wrap items-center justify-between gap-2 p-4 md:flex-row"
            >
                <div class="flex items-stretch flex-shrink-0 gap-2">
                    <div class="flex items-stretch overflow-hidden rounded-lg shadow group">
                        <Button
                            size="xs"
                            dusk="button-fit-to-window"
                            :rounded="false"
                            @click.native="resetWindowSize"
                        >
                            <MinimizeIcon class="w-4 h-4" />
                            <span class="hidden md:inline">Fit to Window</span>
                        </Button>

                        <ButtonLock
                            size="xs"
                            dusk="button-lock-fit-to-window"
                            :rounded="false"
                            :locked="lockWindowSize"
                            v-tooltip="
                                lockWindowSize ? 'Unlock Fit to Window' : 'Lock Fit to Window'
                            "
                            @click.native="lockWindowSize = !lockWindowSize"
                        />

                        <Popover title="Fitting Properties">
                            <template #trigger>
                                <Button
                                    v-if="lockWindowSize"
                                    size="xs"
                                    dusk="button-lock-fit-to-window-settings"
                                    :rounded="false"
                                >
                                    <SettingsIcon class="w-4 h-4" />
                                </Button>
                            </template>

                            <template #popover>
                                <div
                                    dusk="popover-fit-to-window"
                                    class="flex flex-col divide-y divide-ui-gray-800"
                                >
                                    <div class="grid grid-cols-2 gap-2 divide-x divide-ui-gray-800">
                                        <div
                                            class="flex items-center justify-between w-full gap-2 px-3 py-2"
                                        >
                                            <Label class="w-full text-center"> Padding X </Label>

                                            <Input
                                                size="sm"
                                                type="number"
                                                class="w-16 text-center"
                                                v-model="lockWindowPaddingX"
                                                dusk="input-fit-to-window-padding-x"
                                            />
                                        </div>

                                        <div
                                            class="flex items-center justify-between w-full gap-2 px-3 py-2"
                                        >
                                            <Label class="w-full text-center"> Padding Y </Label>

                                            <Input
                                                size="sm"
                                                type="number"
                                                class="w-16 text-center"
                                                v-model="lockWindowPaddingY"
                                                dusk="input-fit-to-window-padding-y"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Popover>
                    </div>

                    <Button size="xs" class="shadow" @click.native="resetViewport">
                        <RefreshCwIcon class="w-4 h-4" />
                        <span class="hidden md:inline">Reset Viewport</span>
                    </Button>
                </div>

                <div class="flex flex-col justify-center space-y-2">
                    <div class="justify-center hidden md:flex">
                        <div
                            class="flex items-center justify-center gap-2 rounded-lg shadow bg-ui-gray-700 py-0.5"
                        >
                            <div class="flex items-center">
                                <div class="px-2 text-xs font-semibold text-ui-gray-500">W</div>

                                <Input
                                    size="xs"
                                    type="number"
                                    min="1"
                                    max="5000"
                                    class="text-center appearance-none w-14"
                                    :value="settings.width"
                                    :disabled="lockWindowSize"
                                    @input="setWidth($event, true)"
                                />
                            </div>

                            <div><XIcon class="w-3 h-3 text-ui-gray-500" /></div>

                            <div class="flex items-center">
                                <Input
                                    size="xs"
                                    type="number"
                                    min="1"
                                    max="5000"
                                    class="text-center appearance-none w-14"
                                    :value="settings.height"
                                    :disabled="lockWindowSize"
                                    @input="setHeight($event)"
                                />

                                <div class="px-2 text-xs font-semibold text-ui-gray-500">H</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            class="justify-center flex-shrink-0 hidden divide-x rounded-lg shadow divide-ui-gray-800 md:flex"
                        >
                            <Button
                                v-for="([x, y], index) in aspectRatios"
                                size="xs"
                                :key="index"
                                :rounded="false"
                                :disabled="lockWindowSize"
                                :active="isEqual(settings.aspectRatio, [x, y])"
                                class="justify-center w-16"
                                :class="{ 'rounded-l-lg': index === 0 }"
                                @click.native="setAspectRatio(x, y)"
                            >
                                {{ x }}:{{ y }}
                            </Button>

                            <Button
                                size="xs"
                                :rounded="false"
                                :active="settings.aspectRatio === null"
                                class="justify-center rounded-r-lg"
                                @click.native="settings.aspectRatio = null"
                            >
                                Custom
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center h-full gap-2 px-2 py-1 rounded-lg shadow bg-ui-gray-700"
                >
                    <ZoomOutIcon class="w-4 h-4 text-ui-gray-400" />

                    <Range
                        max="2"
                        min="0.1"
                        step="0.01"
                        class="w-44"
                        :value="zoom"
                        @input="zoomTo($event)"
                    />

                    <ZoomInIcon class="w-4 h-4 text-ui-gray-400" />
                </div>
            </div>

            <ControlTabs
                @changed="controlTabChanged"
                :tabs="[
                    { name: 'code-preview', title: 'Preview' },
                    { name: 'themes', title: 'Themes' },
                    { name: 'backgrounds', title: 'Backgrounds' },
                ]"
            >
                <template #default="{ active }">
                    <div
                        v-if="active === 'backgrounds'"
                        dusk="control-backgrounds"
                        class="flex flex-col justify-start w-full gap-4"
                    >
                        <div
                            class="grid grid-flow-col grid-rows-3 gap-4 p-4 overflow-x-auto auto-cols-max scrollbar-hide"
                        >
                            <ButtonBackground
                                v-for="{ id, custom, ...attrs } in backgrounds"
                                v-bind="attrs"
                                :ref="`button-background-${id}`"
                                :dusk="`button-background-${id}`"
                                :key="id"
                                :custom="custom"
                                :active="settings.background === id"
                                @delete="deleteBackground(id)"
                                @click.native="settings.background = id"
                            />
                        </div>

                        <div class="mx-4 mb-4">
                            <ButtonPlaceholder
                                v-tooltip.bottom="{
                                    content: $config.isDesktop
                                        ? null
                                        : 'Download the desktop app to upload backgrounds.',
                                }"
                                @click.native="showingBackgroundsModal = $config.isDesktop"
                            >
                                <PlusCircleIcon class="w-4 h-4" /> Upload
                            </ButtonPlaceholder>
                        </div>
                    </div>

                    <div v-if="active === 'themes'" dusk="control-themes" class="w-full">
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
                                :background="backgroundAttrs"
                            />
                        </div>
                    </div>

                    <div v-if="active === 'code-preview'" dusk="control-preview">
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
                                    :options="fontSizes"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label> Font Family </Label>

                                <Select
                                    dusk="select-font-family"
                                    v-model="settings.fontFamily"
                                    :options="fontFamilies"
                                    :group="$config.isDesktop ? `group` : null"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label> Line Height </Label>

                                <Select
                                    dusk="select-line-height"
                                    v-model="settings.lineHeight"
                                    :options="lineHeights"
                                />
                            </div>

                            <div class="flex flex-col w-full space-y-1 lg:w-auto">
                                <Label> Position </Label>

                                <Select
                                    dusk="select-position"
                                    v-model="settings.position"
                                    :options="[
                                        { title: 'Center', name: 'center' },
                                        { title: 'Top', name: 'top' },
                                        { title: 'Bottom', name: 'bottom' },
                                        { title: 'Left', name: 'left' },
                                        { title: 'Right', name: 'right' },
                                    ]"
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
                                    <Label> Border </Label>

                                    <ToggleBorder
                                        dusk="toggle-border"
                                        v-model="settings.showBorder"
                                        :border-width="settings.borderWidth"
                                        :border-color="settings.borderColor"
                                        @reset="
                                            {
                                                settings.borderWidth = settingsDefaults.borderWidth;
                                                settings.borderColor = settingsDefaults.borderColor;
                                            }
                                        "
                                        @update:border-width="settings.borderWidth = $event"
                                        @update:border-color="settings.borderColor = $event"
                                    />
                                </div>

                                <div class="flex flex-col items-center justify-between space-y-1">
                                    <Label> Shadow </Label>

                                    <ToggleShadow
                                        dusk="toggle-shadow"
                                        v-model="settings.showShadow"
                                        :shadow-x="settings.shadowX"
                                        :shadow-y="settings.shadowY"
                                        :shadow-blur="settings.shadowBlur"
                                        :shadow-color="settings.shadowColor"
                                        :shadow-spread="settings.shadowSpread"
                                        @reset="
                                            {
                                                settings.shadowX = settingsDefaults.shadowX;
                                                settings.shadowY = settingsDefaults.shadowY;
                                                settings.shadowBlur = settingsDefaults.shadowBlur;
                                                settings.shadowColor = settingsDefaults.shadowColor;
                                                settings.shadowSpread =
                                                    settingsDefaults.shadowSpread;
                                            }
                                        "
                                        @update:shadow-x="settings.shadowX = $event"
                                        @update:shadow-y="settings.shadowY = $event"
                                        @update:shadow-blur="settings.shadowBlur = $event"
                                        @update:shadow-color="settings.shadowColor = $event"
                                        @update:shadow-spread="settings.shadowSpread = $event"
                                    />
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

                                <div class="flex items-center gap-1">
                                    <Range
                                        max="40"
                                        step="1"
                                        dusk="range-border-radius"
                                        v-model="settings.borderRadius"
                                        :disabled="!settings.borderRadiusLocked"
                                    />

                                    <ButtonLock
                                        size="none"
                                        :rounded="false"
                                        class="p-1 rounded-full"
                                        :locked="settings.borderRadiusLocked"
                                        @click.native="
                                            settings.borderRadiusLocked =
                                                !settings.borderRadiusLocked
                                        "
                                        v-tooltip="
                                            settings.borderRadiusLocked
                                                ? 'Unlock Sides'
                                                : 'Lock Sides'
                                        "
                                    />

                                    <PopoverSettings
                                        v-if="!settings.borderRadiusLocked"
                                        title="Border Radius Properties"
                                        tooltip="Configure Border Radius"
                                        @reset="
                                            settings.borderRadiusTopLeft =
                                                settingsDefaults.borderRadiusTopLeft;
                                            settings.borderRadiusTopRight =
                                                settingsDefaults.borderRadiusTopRight;
                                            settings.borderRadiusBottomLeft =
                                                settingsDefaults.borderRadiusBottomLeft;
                                            settings.borderRadiusBottomRight =
                                                settingsDefaults.borderRadiusBottomRight;
                                        "
                                    >
                                        <div class="flex flex-col divide-y divide-ui-gray-800">
                                            <div
                                                class="grid grid-cols-2 divide-x divide-ui-gray-800"
                                            >
                                                <div class="flex items-center justify-between p-2">
                                                    <Label>Top Left</Label>

                                                    <Input
                                                        size="sm"
                                                        type="number"
                                                        class="w-16 text-center"
                                                        v-model="settings.borderRadiusTopLeft"
                                                    />
                                                </div>

                                                <div class="flex items-center justify-between p-2">
                                                    <Label>Top Right</Label>

                                                    <Input
                                                        size="sm"
                                                        type="number"
                                                        class="w-16 text-center"
                                                        v-model="settings.borderRadiusTopRight"
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                class="grid grid-cols-2 divide-x divide-ui-gray-800"
                                            >
                                                <div
                                                    class="flex items-center justify-between p-2 space-x-2"
                                                >
                                                    <Label>Bottom Left</Label>

                                                    <Input
                                                        size="sm"
                                                        type="number"
                                                        class="w-16 text-center"
                                                        v-model="settings.borderRadiusBottomLeft"
                                                    />
                                                </div>

                                                <div
                                                    class="flex items-center justify-between p-2 space-x-2"
                                                >
                                                    <Label>Bottom Right</Label>

                                                    <Input
                                                        size="sm"
                                                        type="number"
                                                        class="w-16 text-center"
                                                        v-model="settings.borderRadiusBottomRight"
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
                                        ({{ Math.round(settings.themeOpacity * 100) }}%)
                                    </span>
                                </Label>

                                <Range
                                    max="1"
                                    step="0.01"
                                    dusk="range-theme-opacity"
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
                                    max="4"
                                    step="0.01"
                                    dusk="range-scale"
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

                                <div class="flex items-center gap-1">
                                    <Range
                                        max="60"
                                        step="1"
                                        class="w-full"
                                        dusk="range-padding"
                                        v-model="settings.padding"
                                        :disabled="!settings.paddingLocked"
                                    />

                                    <ButtonLock
                                        size="none"
                                        :rounded="false"
                                        class="p-1 rounded-full"
                                        :locked="settings.paddingLocked"
                                        @click.native="
                                            settings.paddingLocked = !settings.paddingLocked
                                        "
                                        v-tooltip="
                                            settings.borderRadiusLocked
                                                ? 'Unlock Sides'
                                                : 'Lock Sides'
                                        "
                                    />

                                    <PopoverSettings
                                        v-if="!settings.paddingLocked"
                                        title="Padding Properties"
                                        tooltip="Configure Padding"
                                        @reset="
                                            settings.paddingTop = settingsDefaults.paddingTop;
                                            settings.paddingBottom = settingsDefaults.paddingBottom;
                                            settings.paddingLeft = settingsDefaults.paddingLeft;
                                            settings.paddingRigh = settingsDefaults.paddingRight;
                                        "
                                    >
                                        <div class="flex flex-col divide-y divide-ui-gray-800">
                                            <div
                                                class="flex flex-col items-center justify-center gap-2 p-2"
                                            >
                                                <Label>Top</Label>

                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    class="w-16 text-center"
                                                    v-model="settings.paddingTop"
                                                />
                                            </div>

                                            <div
                                                class="flex justify-between divide-x divide-ui-gray-800"
                                            >
                                                <div class="flex items-center gap-2 p-4">
                                                    <Label>Left</Label>

                                                    <Input
                                                        size="sm"
                                                        type="number"
                                                        class="w-16 text-center"
                                                        v-model="settings.paddingLeft"
                                                    />
                                                </div>

                                                <div class="flex items-center gap-2 p-4">
                                                    <Input
                                                        size="sm"
                                                        type="number"
                                                        class="w-16 text-center"
                                                        v-model="settings.paddingRight"
                                                    />

                                                    <Label>Right</Label>
                                                </div>
                                            </div>

                                            <div
                                                class="flex flex-col items-center justify-center gap-2 p-2"
                                            >
                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    class="w-16 text-center"
                                                    v-model="settings.paddingBottom"
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
            </ControlTabs>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import download from 'downloadjs';
import { detect } from 'detect-browser';
import * as htmlToImage from 'html-to-image';
import { head, debounce, isEqual } from 'lodash';
import {
    XIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ShareIcon,
    EyeOffIcon,
    SettingsIcon,
    MinimizeIcon,
    ClipboardIcon,
    RefreshCwIcon,
    PlusCircleIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
    ExternalLinkIcon,
} from 'vue-feather-icons';
import useShiki from '@/composables/useShiki';
import useFonts from '@/composables/useFonts';
import usePanZoom from '@/composables/usePanZoom';
import usePreview from '@/composables/usePreview';
import useClipboard from '@/composables/useClipboard';
import useBackgrounds from '@/composables/useBackgrounds';
import useAspectRatios from '@/composables/useAspectRatios';
import {
    ref,
    watch,
    toRefs,
    nextTick,
    computed,
    onMounted,
    useContext,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';
import usePreferencesStore from '@/composables/usePreferencesStore';

export default {
    props: {
        name: {
            type: String,
            required: false,
        },
        code: {
            type: Array,
            required: true,
        },
        defaults: {
            type: Object,
            required: true,
        },
        languages: {
            type: Array,
            required: true,
        },
    },

    components: {
        XIcon,
        ShareIcon,
        ZoomInIcon,
        ZoomOutIcon,
        EyeOffIcon,
        SettingsIcon,
        MinimizeIcon,
        RefreshCwIcon,
        ClipboardIcon,
        PlusCircleIcon,
        ShoppingBagIcon,
        CheckCircleIcon,
        ExternalLinkIcon,
    },

    setup(props, context) {
        const preview = ref(null);
        const canvas = ref(null);
        const blocks = ref([]);
        const pane = ref(null);
        const exportAs = ref('png');
        const resizing = ref(false);
        const backgroundButtons = ref([]);
        const showingBackgroundsModal = ref(false);

        const { $bus, $queue } = useContext();

        const { buildCodeBlocks } = useShiki();

        const { copy, copied } = useClipboard();

        const preferences = usePreferencesStore();

        const { zoom, zoomTo, createPanZoom, resetViewport } = usePanZoom({
            startY: -150,
            cursor: 'grab',
            excludeClass: 'exclude-from-panzoom',
        });

        const { backgrounds, getBackgroundAttrs, deleteCustomBackground } = useBackgrounds();

        const { name, code, languages } = toRefs(props);

        const {
            settings,
            setWidth,
            setHeight,
            settingsDefaults,
            setDefaultBackground,
            ...restOfPreview
        } = usePreview(props, context);

        const {
            title,
            image,
            scale,
            padding,
            landscape,
            showTitle,
            showHeader,
            background,
            themeName,
            themeType,
            themeOpacity,
            themeBackground,
            lockWindowSize,
            lockWindowPaddingX,
            lockWindowPaddingY,
        } = toRefs(settings);

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

        const generateImageFromPreview = (method, pixelRatio = 3) => {
            const filter = (node) => !(node.dataset && node.dataset.hasOwnProperty('hide'));

            if (!canvas.value?.$el) {
                return;
            }

            return htmlToImage[method](canvas.value.$el, {
                filter,
                pixelRatio,
            });
        };

        const generateTemplateImage = async () => {
            try {
                const jpg = await generateImageFromPreview('toJpeg', 1);

                image.value = jpg;
            } catch (e) {
                console.error('Unable to generate template image.');
            }
        };

        const scrollSelectedThemeIntoView = () =>
            scrollRefIntoView(`button-theme-${themeName.value}`);

        const scrollSelectedBackgroundIntoView = () =>
            scrollRefIntoView(`button-background-${background.value}`);

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

        const controlTabChanged = (tab) => {
            if (tab === 'backgrounds') {
                return nextTick(scrollSelectedBackgroundIntoView);
            }

            if (tab === 'themes') {
                return nextTick(scrollSelectedThemeIntoView);
            }
        };

        const saveAs = (method) => {
            const extension = {
                toPng: 'png',
                toJpeg: 'jpg',
                toSvg: 'svg',
            }[method];

            generateImageFromPreview(method, preferences.exportPixelRatio).then((dataUrl) => {
                const filename = name.value || title.value || 'Untitled-1';

                download(dataUrl, `${filename}.${extension}`);
            });
        };

        const copyToClipboard = () => {
            const browser = detect();

            const promise = generateImageFromPreview('toBlob', preferences.exportPixelRatio);

            switch (browser && browser.name) {
                case 'safari':
                    return copy(promise);
                case 'firefox':
                    return typeof ClipboardItem !== 'undefined'
                        ? promise.then(copy)
                        : $bus.$emit(
                              'alert',
                              'danger',
                              'In order to copy images to the clipboard, Showcode.app needs access to the ClipboardItem web API, which is not accessible in Firefox. Please use the "Export" button instead.'
                          );
                default:
                    return promise.then(copy);
            }
        };

        const updateWithCustomBackground = (id) => {
            background.value = id;
            showingBackgroundsModal.value = false;

            nextTick(() => {
                generateTemplateImage();
                scrollSelectedBackgroundIntoView();
            });
        };

        const deleteBackground = (id) => {
            if (!confirm('Delete this background?')) {
                return;
            }

            setDefaultBackground();

            deleteCustomBackground(id);

            nextTick(scrollSelectedBackgroundIntoView);
        };

        const fileTypes = computed(() => [
            {
                name: 'png',
                title: 'PNG',
                click: () => saveAs('toPng'),
            },
            {
                name: 'jpg',
                title: 'JPEG',
                click: () => saveAs('toJpeg'),
            },
            {
                name: 'svg',
                title: 'HTML',
                click: () => saveAs('toSvg'),
            },
        ]);

        const backgroundAttrs = computed(() => getBackgroundAttrs(background.value));

        let templateGenerationDebounce = null;

        watch(settings, (values) => context.emit('update:settings', values));

        onMounted(() => {
            nextTick(() => createPanZoom(preview));

            generateTokens();
            generateTemplateImage();

            // Our code will change quickly. We will make
            // sure to debounce the token generation
            // so performance doesn't take a hit.
            watch(code, debounce(generateTokens, 500));

            watch([languages, themeName, themeOpacity], generateTokens);

            watch(
                [
                    scale,
                    blocks,
                    padding,
                    landscape,
                    showTitle,
                    showHeader,
                    lockWindowSize,
                    lockWindowPaddingX,
                    lockWindowPaddingY,
                ],
                () => {
                    if (lockWindowSize.value) {
                        nextTick(() => {
                            setWidth(
                                (pane.value.actualWidth() + Number(lockWindowPaddingX.value)) *
                                    scale.value
                            );
                            setHeight(
                                (pane.value.actualHeight() + Number(lockWindowPaddingY.value)) *
                                    scale.value
                            );
                        });
                    }
                }
            );

            watch(
                () => [settings, code],
                (templateGenerationDebounce = debounce(generateTemplateImage, 5000)),
                { deep: true }
            );
        });

        onBeforeUnmount(() => templateGenerationDebounce?.cancel());

        return {
            pane,
            zoom,
            isEqual,
            canvas,
            preview,
            settings,
            settingsDefaults,
            fileTypes,
            copied,
            copyToClipboard,
            blocks,
            zoomTo,
            exportAs,
            resizing,
            setWidth,
            setHeight,
            backgrounds,
            resetViewport,
            backgroundAttrs,
            deleteBackground,
            backgroundButtons,
            controlTabChanged,
            lockWindowSize,
            lockWindowPaddingX,
            lockWindowPaddingY,
            showingBackgroundsModal,
            updateWithCustomBackground,
            ...useFonts(),
            ...restOfPreview,
            ...useAspectRatios(),
        };
    },
};
</script>
