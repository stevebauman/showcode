<template>
    <div class="inspector-settings">
        <section class="inspector-section border-ui-line">
            <h3>Typography</h3>
            <div class="inspector-field">
                <Label :for="`${id}-themeName`">Theme</Label>

                <Select v-model="localSettings.themeName">
                    <SelectTrigger :id="`${id}-themeName`">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="theme in themes" :key="theme" :value="theme">
                            {{ theme }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="inspector-field">
                <Label :for="`${id}-fontSize`">Font Size</Label>

                <Input
                    :id="`${id}-fontSize`"
                    min="1"
                    class="w-20"
                    type="number"
                    v-model="localSettings.fontSize"
                />
            </div>

            <div class="inspector-field">
                <Label :for="`${id}-fontFamily`">Font Family</Label>

                <Select v-model="localSettings.fontFamily">
                    <SelectTrigger :id="`${id}-fontFamily`">
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

            <div class="inspector-field">
                <Label :for="`${id}-lineHeight`">Line Height</Label>

                <Input
                    :id="`${id}-lineHeight`"
                    min="0"
                    class="w-20"
                    type="number"
                    v-model="localSettings.lineHeight"
                />
            </div>
        </section>

        <section class="inspector-section inspector-toggles border-ui-line">
            <h3>Window</h3>
            <div class="inspector-field" :class="sceneLockedClasses">
                <Label :for="`${id}-position`">Position</Label>

                <div
                    :class="
                        cn(
                            'rounded-control inline-flex h-7 items-center gap-0.5 border border-zinc-200/80 bg-zinc-100/80 p-0.5 shadow-xs dark:border-white/5 dark:bg-white/5',
                            formControlGroupFocusClasses
                        )
                    "
                >
                    <ControlWindowPosition
                        :id="`${id}-position`"
                        v-model="localSettings.position"
                        :disabled="sceneSelected"
                    />

                    <PopoverSettings
                        title="Margin Properties"
                        tooltip="Configure Margin"
                        attached
                        @reset="
                            localSettings.marginTop = settingsDefaults.marginTop;
                            localSettings.marginBottom = settingsDefaults.marginBottom;
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
            <div class="contents">
                <div class="inspector-field">
                    <Label :for="`${id}-showHeader`">Header</Label>

                    <div class="flex items-center">
                        <ToggleHeader
                            :id="`${id}-showHeader`"
                            v-model="localSettings.showHeader"
                            :locked="sceneSelected"
                            :show-title="localSettings.showTitle"
                            :show-menu="localSettings.showMenu"
                            :show-color-menu="localSettings.showColorMenu"
                            :show-header-accent="localSettings.showHeaderAccent"
                            :title-color="localSettings.headerTitleColor"
                            @update:show-menu="localSettings.showMenu = $event"
                            @update:show-title="localSettings.showTitle = $event"
                            @update:show-color-menu="localSettings.showColorMenu = $event"
                            @update:show-header-accent="localSettings.showHeaderAccent = $event"
                            @update:title-color="localSettings.headerTitleColor = $event"
                        />
                    </div>
                </div>
            </div>

            <div class="contents">
                <div class="inspector-field">
                    <Label :for="`${id}-showLineNumbers`">Line Numbers</Label>

                    <div class="flex items-center">
                        <Toggle
                            :id="`${id}-showLineNumbers`"
                            v-model="localSettings.showLineNumbers"
                        />
                    </div>
                </div>

                <div class="inspector-field" :class="sceneLockedClasses">
                    <Label :for="`${id}-showBorder`">Border</Label>

                    <ToggleBorder
                        :id="`${id}-showBorder`"
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

                <div class="inspector-field" :class="sceneLockedClasses">
                    <Label :for="`${id}-showShadow`">Shadow</Label>

                    <ToggleShadow
                        :id="`${id}-showShadow`"
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

                <div class="inspector-field" :class="sceneLockedClasses">
                    <Label :for="`${id}-showShine`">Shine</Label>

                    <ToggleShine
                        :id="`${id}-showShine`"
                        v-model="localSettings.showShine"
                        :shine-width="localSettings.shineWidth"
                        :shine-height="localSettings.shineHeight"
                        :shine-opacity="localSettings.shineOpacity"
                        @update:shine-width="localSettings.shineWidth = $event"
                        @update:shine-height="localSettings.shineHeight = $event"
                        @update:shine-opacity="localSettings.shineOpacity = $event"
                    />
                </div>

                <div class="inspector-field">
                    <Label :for="`${id}-showSocialBadge`">Social Badge</Label>

                    <ToggleSocialBadge
                        :id="`${id}-showSocialBadge`"
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
                    <div class="inspector-field">
                        <Label :for="`${id}-showDividers`">Dividers</Label>

                        <div class="flex items-center">
                            <Toggle
                                :id="`${id}-showDividers`"
                                v-model="localSettings.showDividers"
                            />
                        </div>
                    </div>

                    <div class="inspector-field">
                        <Label :for="`${id}-landscape`">
                            Orientation ({{ localSettings.landscape ? 'L' : 'P' }})
                        </Label>

                        <div class="flex items-center">
                            <Toggle :id="`${id}-landscape`" v-model="localSettings.landscape" />
                        </div>
                    </div>
                </template>
            </div>
        </section>

        <section class="inspector-section inspector-sliders border-ui-line">
            <h3>Effects &amp; spacing</h3>
            <div class="inspector-field">
                <Label class="flex items-center space-x-2">
                    <div>Border Radius</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        {{ localSettings.borderRadius }} px
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="min-w-0 flex-1"
                        :max="40"
                        :step="1"
                        :model-value="[localSettings.borderRadius]"
                        @update:model-value="localSettings.borderRadius = $event[0]"
                        :disabled="sceneSelected || !localSettings.borderRadiusLocked"
                    />

                    <ButtonLock
                        variant="ghost"
                        class="h-auto rounded-full p-1"
                        :locked="localSettings.borderRadiusLocked"
                        :aria-label="
                            localSettings.borderRadiusLocked ? 'Unlock Corners' : 'Lock Corners'
                        "
                        @click="
                            localSettings.borderRadiusLocked = !localSettings.borderRadiusLocked
                        "
                        v-tooltip="
                            localSettings.borderRadiusLocked ? 'Unlock Corners' : 'Lock Corners'
                        "
                    />

                    <PopoverSettings
                        title="Border Radius Properties"
                        tooltip="Configure Border Radius"
                        @reset="
                            localSettings.borderRadius = settingsDefaults.borderRadius;
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
                        <InputCornerRadius
                            :values="cornerRadii"
                            :linked="localSettings.borderRadiusLocked"
                            @change="updateCornerRadius"
                            @update:linked="localSettings.borderRadiusLocked = $event"
                        />
                    </PopoverSettings>
                </div>
            </div>

            <div class="inspector-field" :class="sceneLockedClasses">
                <Label class="flex items-center space-x-2">
                    <div>Opacity</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        {{ Math.round(localSettings.themeOpacity * 100) }}%
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="min-w-0 flex-1"
                        :max="1"
                        :step="0.01"
                        :disabled="sceneSelected"
                        :model-value="[localSettings.themeOpacity]"
                        @update:model-value="localSettings.themeOpacity = $event[0]"
                    />

                    <div class="size-6 shrink-0" />
                </div>
            </div>

            <div class="inspector-field transition-opacity" :class="sceneLockedClasses">
                <Label class="flex items-center space-x-2">
                    <div>Scale</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        {{ Math.round(localSettings.scale * 100) }}%
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="min-w-0 flex-1"
                        :max="4"
                        :step="0.01"
                        :disabled="sceneSelected"
                        :model-value="[localSettings.scale]"
                        @update:model-value="localSettings.scale = $event[0]"
                    />

                    <div class="size-6 shrink-0" />
                </div>
            </div>

            <div class="inspector-field">
                <Label class="flex items-center space-x-2">
                    <div>Window Padding</div>

                    <span
                        class="text-xs whitespace-nowrap text-zinc-400 tabular-nums dark:text-zinc-500"
                    >
                        {{ localSettings.padding }} px
                    </span>
                </Label>

                <div class="flex items-center gap-1">
                    <Slider
                        class="min-w-0 flex-1"
                        :max="60"
                        :step="1"
                        :model-value="[localSettings.padding]"
                        @update:model-value="localSettings.padding = $event[0]"
                        :disabled="!localSettings.paddingLocked"
                    />

                    <ButtonLock
                        variant="ghost"
                        class="h-auto rounded-full p-1"
                        :locked="localSettings.paddingLocked"
                        :aria-label="
                            localSettings.paddingLocked ? 'Unlock Padding' : 'Lock Padding'
                        "
                        @click="localSettings.paddingLocked = !localSettings.paddingLocked"
                        v-tooltip="
                            localSettings.paddingLocked ? 'Unlock All Sides' : 'Lock All Sides'
                        "
                    />

                    <PopoverSettings
                        title="Padding Properties"
                        tooltip="Configure Padding"
                        @reset="
                            localSettings.padding = settingsDefaults.padding;
                            localSettings.paddingTop = settingsDefaults.paddingTop;
                            localSettings.paddingBottom = settingsDefaults.paddingBottom;
                            localSettings.paddingLeft = settingsDefaults.paddingLeft;
                            localSettings.paddingRight = settingsDefaults.paddingRight;
                        "
                    >
                        <InputMargin
                            inset
                            linkable
                            :linked="localSettings.paddingLocked"
                            :margin-top="
                                localSettings.paddingLocked
                                    ? localSettings.padding
                                    : localSettings.paddingTop
                            "
                            :margin-bottom="
                                localSettings.paddingLocked
                                    ? localSettings.padding
                                    : localSettings.paddingBottom
                            "
                            :margin-left="
                                localSettings.paddingLocked
                                    ? localSettings.padding
                                    : localSettings.paddingLeft
                            "
                            :margin-right="
                                localSettings.paddingLocked
                                    ? localSettings.padding
                                    : localSettings.paddingRight
                            "
                            @update:margin-top="updatePadding('paddingTop', $event)"
                            @update:margin-bottom="updatePadding('paddingBottom', $event)"
                            @update:margin-left="updatePadding('paddingLeft', $event)"
                            @update:margin-right="updatePadding('paddingRight', $event)"
                            @update:linked="localSettings.paddingLocked = $event"
                        />
                    </PopoverSettings>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import useFonts from '@/composables/useFonts';
import useSettings from '@/composables/useSettings';
import { cn, formControlGroupFocusClasses } from '@/lib/utils';
import { computed, reactive, unref, watch, useId } from 'vue';

const props = defineProps({
    blocks: { type: Array, required: true },
    themes: { type: Array, required: true },
    settings: { type: Object, required: true },
});

const emit = defineEmits(['update']);
const id = useId();

const { settingsDefaults } = useSettings();
const { fontFamilies } = useFonts();

const localSettings = reactive(unref(props.settings));
const sceneSelected = computed(() => localSettings.scene && localSettings.scene !== 'none');
const sceneLockedClasses = computed(() =>
    sceneSelected.value ? 'pointer-events-none select-none opacity-40 grayscale' : ''
);

const cornerRadii = computed(() => ({
    topLeft: localSettings.borderRadiusLocked
        ? localSettings.borderRadius
        : localSettings.borderRadiusTopLeft,
    topRight: localSettings.borderRadiusLocked
        ? localSettings.borderRadius
        : localSettings.borderRadiusTopRight,
    bottomLeft: localSettings.borderRadiusLocked
        ? localSettings.borderRadius
        : localSettings.borderRadiusBottomLeft,
    bottomRight: localSettings.borderRadiusLocked
        ? localSettings.borderRadius
        : localSettings.borderRadiusBottomRight,
}));

function updateCornerRadius(corner, value) {
    if (localSettings.borderRadiusLocked) {
        localSettings.borderRadius = value;
        localSettings.borderRadiusTopLeft = value;
        localSettings.borderRadiusTopRight = value;
        localSettings.borderRadiusBottomLeft = value;
        localSettings.borderRadiusBottomRight = value;
        return;
    }

    const property = `borderRadius${corner.charAt(0).toUpperCase()}${corner.slice(1)}`;
    localSettings[property] = value;
}

function updatePadding(side, value) {
    if (localSettings.paddingLocked) {
        localSettings.padding = value;
        localSettings.paddingTop = value;
        localSettings.paddingRight = value;
        localSettings.paddingBottom = value;
        localSettings.paddingLeft = value;
        return;
    }

    localSettings[side] = value;
}

watch(localSettings, (value) => emit('update', value), { deep: true });
</script>

<style scoped>
.inspector-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border-bottom-width: 1px;
}

.inspector-section:last-child {
    border-bottom: 0;
}

.inspector-section h3 {
    margin-bottom: 2px;
    font-size: 12px;
    font-weight: 500;
}

.inspector-field {
    min-height: 28px;
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.inspector-field > :last-child {
    width: 144px;
    flex-shrink: 0;
}

.inspector-toggles :deep(.ui-toggle) {
    min-width: 60px;
}

.inspector-field > :deep(label) {
    color: var(--ui-muted);
}

.inspector-toggles .inspector-field > :last-child {
    width: auto;
}

.inspector-sliders .inspector-field {
    min-height: 28px;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
}

.inspector-sliders .inspector-field > :last-child {
    width: 100%;
}

.inspector-sliders :deep(label) {
    justify-content: space-between;
}
</style>
