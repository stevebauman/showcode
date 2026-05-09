<template>
    <div
        ref="root"
        class="relative"
        data-frame-window
        :class="{
            'window-border': settings.showBorder,
            [`window-frame-${settings.frame}`]: settings.frame && settings.frame !== 'none',
            'origin-center': settings.position === 'center',
            'origin-top': settings.position === 'top',
            'origin-bottom': settings.position === 'bottom',
            'origin-left': settings.position === 'left',
            'origin-right': settings.position === 'right',
        }"
        :style="[windowStyle, frameWindowStyle]"
    >
        <Interact v-if="!preview" drag @dragmove="$emit('update:scale', $event.delta.y)">
            <ButtonResize
                data-hide
                :zoom-scale="Math.pow(settings.scale * zoom, -1)"
                class="invisible absolute bottom-0 left-1/2 -m-1.5 h-2.5 w-2.5 group-hover:visible"
            />
        </Interact>

        <div
            v-if="settings.showShine"
            class="absolute inset-0 overflow-hidden"
            :style="{
                borderTopLeftRadius: borderRadius,
                borderBottomLeftRadius: borderRadius,
            }"
        >
            <svg
                class="absolute inset-0"
                viewBox="0 0 100 172"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :style="{ width: shineWidth }"
            >
                <path d="M0 0H100L47 172H0V0Z" fill="url(#gradient)"></path>
                <defs>
                    <!--
                        x1 is the start of the gradient
                        y1 is the height of the gradient
                        x2 is the end of the gradient
                        y2 is the height of the gradient
                     -->
                    <linearGradient
                        id="gradient"
                        x1="50"
                        y1="0"
                        x2="50"
                        :y2="shineHeight"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="white" :stop-opacity="shineOpacity"></stop>
                        <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                    </linearGradient>
                </defs>
            </svg>
        </div>

        <div
            v-if="settings.showHeader"
            class="exclude-from-panzoom relative flex h-12 items-center p-4"
            :style="
                settings.showHeaderAccent
                    ? {
                          borderColor: borderColor,
                          borderTopLeftRadius: borderRadius,
                          borderTopRightRadius: borderRadius,
                          backgroundColor: backgroundAccentColor,
                      }
                    : {}
            "
        >
            <FauxMenu
                v-if="settings.showMenu"
                class="absolute"
                :theme-background="settings.themeBackground"
                :theme="settings.showColorMenu ? 'color' : settings.themeType"
            />

            <div
                v-if="settings.showTitle"
                @click="preview ? null : editTitle()"
                class="w-full px-2 text-center whitespace-nowrap text-gray-400"
                :class="{
                    'mx-14': settings.showMenu,
                    'cursor-text hover:rounded-lg hover:ring-3 hover:ring-violet-800 dark:hover:ring-violet-500':
                        !preview,
                }"
            >
                <input
                    v-if="editingTitle || title.length > 0"
                    type="text"
                    ref="titleInput"
                    v-model="title"
                    :readonly="preview"
                    :size="title.length || 1"
                    @blur="editingTitle = false"
                    @keyup.enter="$refs.titleInput.blur()"
                    :class="{ 'pointer-events-none cursor-pointer': preview }"
                    class="appearance-none border-0 bg-transparent p-0 text-center text-sm font-medium shadow-none focus:ring-0"
                />

                <span v-else class="text-sm font-medium">Untitled-1</span>
            </div>
        </div>

        <div
            :class="[
                {
                    flex: settings.landscape && blocks.length > 1,
                    'flex flex-col': !settings.landscape && blocks.length > 1,
                    'divide-x': settings.landscape && settings.showDividers,
                    'divide-y': !settings.landscape && settings.showDividers,
                },
            ]"
        >
            <div
                class="flex items-center overflow-hidden"
                v-for="({ lines, added, removed, focused }, index) in blocks"
                :key="index"
                :style="{
                    paddingTop: `${
                        settings.showHeader && settings.paddingLocked
                            ? padding('top') / 2
                            : padding('top')
                    }px`,
                    borderColor: borderColor,
                    paddingBottom: `${padding('bottom')}px`,
                }"
            >
                <Code
                    class="relative w-full"
                    v-bind="codeAttributes"
                    :lines="lines"
                    :added="added"
                    :removed="removed"
                    :focused="focused"
                    :theme-type="settings.themeType"
                    :show-line-numbers="settings.showLineNumbers"
                />
            </div>
        </div>

        <div
            v-if="settings.showSocialBadge"
            class="absolute flex h-fit w-full"
            :class="{
                'bottom-2': settings.socialPosition.includes('inside'),
                'mt-2': settings.socialPosition.includes('bottom'),

                'left-2': settings.socialPosition.includes('inside-left'),
                'right-2': settings.socialPosition.includes('inside-right'),

                'justify-start': settings.socialPosition.includes('left'),
                'justify-center': settings.socialPosition.includes('center'),
                'justify-end': settings.socialPosition.includes('right'),
            }"
        >
            <SocialBadge
                :type="settings.socialType"
                :username="settings.socialUsername"
                :display-name="settings.socialDisplayName"
                :style="{
                    color: fontColor,
                    borderColor: `rgba(${borderColorRgba})`,
                    backgroundColor: settings.themeBackground,
                    borderRadius: `${settings.socialBorderRadius}px`,
                    borderWidth: settings.showBorder ? borderWidth : 0,
                    boxShadow: settings.showBorder ? boxShadow : boxShadowWithAccent,
                }"
            />
        </div>
    </div>
</template>

<style scoped>
.window-border::before {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    pointer-events: none;
    border-radius: inherit;
    box-shadow-sm: 0 0 0 var(--window-border-width) rgba(var(--window-border-color));
    backdrop-filter: var(--window-backdrop-blur-sm);
    -webkit-backdrop-filter: var(--window-backdrop-blur-sm);
}
</style>

<script setup>
import chroma from 'chroma-js';
import useFonts from '@/composables/useFonts';
import { get, merge, cloneDeep, capitalize } from 'lodash';
import { ref, watch, nextTick, computed, onMounted } from 'vue';

const props = defineProps({
    zoom: {
        type: [Number, String],
        required: false,
        default: 1,
    },
    blocks: {
        type: Array,
        default: () => [],
    },
    preview: {
        type: Boolean,
        default: false,
    },
    settings: {
        type: Object,
        default: () => {},
    },
});

defineExpose({
    actualWidth: () => root.value.clientWidth,
    actualHeight: () => root.value.clientHeight,
});

const emit = defineEmits(['update:scale', 'update:title']);

const { fontFamilies } = useFonts();

const root = ref(null);
const titleInput = ref(null);
const editingTitle = ref(false);
const isSafari = ref(false);
const title = ref(String(props.settings.title || ''));

function editTitle() {
    editingTitle.value = true;

    nextTick(() => titleInput.value.focus());
}

const fontAttributes = computed(() => {
    const font = fontFamilies.value.find((font) => font.name === props.settings.fontFamily);

    return get(font, 'attributes', { class: 'font-mono' });
});

const fontColor = computed(() => {
    const color = chroma(props.settings.themeBackground);

    if (props.settings.themeType === 'light') {
        return color.darken(4).hex();
    }

    return color.brighten(4).hex();
});

const codeAttributes = computed(() => {
    return merge(cloneDeep(fontAttributes.value), {
        style: {
            paddingLeft: `${padding('left')}px`,
            paddingRight: `${padding('right')}px`,
        },
    });
});

const borderColor = computed(() => {
    return chroma(props.settings.themeBackground)
        .darken(props.settings.themeType === 'light' ? 1 : -3)
        .alpha(0.25)
        .hex();
});

const borderHighlight = computed(() => {
    return {
        dark: chroma(props.settings.themeBackground).brighten(3).alpha(0.5).hex(),
        light: chroma(props.settings.themeBackground).darken(2).alpha(1).hex(),
    }[props.settings.themeType];
});

const boxShadowAccent = computed(() => {
    if (props.settings.showBorder) {
        return;
    }

    return {
        dark: `0 0 0 1px ${borderHighlight.value},0 0 0 1.5px ${props.settings.themeBackground}`,
        light: `0 0 0 0.5px ${borderHighlight.value}`,
    }[props.settings.themeType];
});

const backgroundAccentColor = computed(() => {
    return chroma(props.settings.themeBackground)
        .darken(props.settings.themeType === 'light' ? 1 : -3)
        .alpha(0.1)
        .hex();
});

const boxShadow = computed(() => {
    if (!props.settings.showShadow || !props.settings.shadowColor) {
        return;
    }

    const color = [
        props.settings.shadowColor.red,
        props.settings.shadowColor.green,
        props.settings.shadowColor.blue,
        props.settings.shadowColor.alpha,
    ].join(', ');

    const shadow = [
        props.settings.shadowX,
        props.settings.shadowY,
        props.settings.shadowBlur,
        props.settings.shadowSpread,
    ]
        .map((prop) => prop + 'px')
        .join(' ');

    return [shadow, `rgba(${color})`].join(' ');
});

const boxShadowWithAccent = computed(() => {
    return [boxShadow.value, boxShadowAccent.value].filter((value) => value).join(',');
});

const windowStyle = computed(() => ({
    borderRadius: borderRadius.value,
    boxShadow: boxShadowWithAccent.value,
    fontSize: `${props.settings.fontSize}px`,
    transform: `scale(${props.settings.scale})`,
    lineHeight: `${props.settings.lineHeight}px`,
    marginTop: `${props.settings.marginTop}px`,
    marginBottom: `${props.settings.marginBottom}px`,
    marginLeft: `${props.settings.marginLeft}px`,
    marginRight: `${props.settings.marginRight}px`,
    backgroundColor: props.settings.themeBackground,
    backdropFilter: backdropBlur.value,
    '--window-border-width': borderWidth.value,
    '--window-border-color': borderColorRgba.value,
    '--window-backdrop-blur-sm': backdropBlur.value,
}));

const frameWindowStyle = computed(() => {
    if (props.settings.frame !== 'stripe') {
        return {};
    }

    return {
        minWidth: '360px',
        backgroundColor: '#0c2e4e',
        boxShadow: isSafari.value
            ? 'none'
            : [
                  'rgba(50, 50, 93, 0.25) 0 50px 100px -20px',
                  'rgba(0, 0, 0, 0.3) 0 30px 60px -30px',
              ].join(', '),
        '--window-border-width': '1px',
        '--window-border-color': '15, 57, 94, 1',
    };
});

const borderWidth = computed(() => {
    return `${props.settings.borderWidth}px`;
});

const borderRadius = computed(() => {
    if (props.settings.borderRadiusLocked) {
        return `${props.settings.borderRadius}px`;
    }

    return [
        props.settings.borderRadiusTopLeft,
        props.settings.borderRadiusTopRight,
        props.settings.borderRadiusBottomRight,
        props.settings.borderRadiusBottomLeft,
    ]
        .map((radius) => radius + 'px')
        .join(' ');
});

const borderColorRgba = computed(() => {
    return [
        props.settings.borderColor.red,
        props.settings.borderColor.green,
        props.settings.borderColor.blue,
        props.settings.borderColor.alpha,
    ].join(', ');
});

const padding = (side) =>
    props.settings.paddingLocked
        ? props.settings.padding
        : get(props.settings, `padding${capitalize(side)}`);

const shineWidth = computed(() => `${props.settings.shineWidth}%`);
const shineHeight = computed(() => props.settings.shineHeight);
const shineOpacity = computed(() => props.settings.shineOpacity);

const backdropBlur = computed(() => {
    // Extract alpha from the themeBackground color (which already has opacity applied)
    const color = chroma(props.settings.themeBackground);
    const alpha = color.alpha();

    // Calculate blur-sm amount: more blur-sm as opacity decreases
    // When alpha is 1 (fully opaque), blur-sm is 0
    // When alpha is 0 (fully transparent), blur-sm is at maximum (20px)
    const maxBlur = 20;
    const blurAmount = (1 - alpha) * maxBlur;

    return blurAmount > 0 ? `blur-sm(${blurAmount}px)` : 'none';
});

watch(title, (title) => emit('update:title', title));

watch(
    () => props.settings.title,
    (newTitle) => (title.value = newTitle)
);

onMounted(() => {
    isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
});
</script>
