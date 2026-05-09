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

        <template v-if="frameWindowDecorations.length">
            <span
                v-for="decoration in frameWindowDecorations"
                :key="decoration"
                class="frame-window-decoration"
                :class="decoration"
                aria-hidden="true"
            ></span>
        </template>

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

.frame-window-decoration {
    position: absolute;
    pointer-events: none;
}

.frame-grid-horizontal::before,
.frame-grid-horizontal::after {
    position: absolute;
    top: 0;
    left: -150px;
    width: calc(100% + 300px);
    height: 1px;
    background: var(--frame-grid-color, rgb(255 255 255 / 10%));
    content: '';
}

.frame-grid-horizontal::after {
    top: auto;
    bottom: 0;
}

.frame-grid-vertical::before,
.frame-grid-vertical::after {
    position: absolute;
    top: -150px;
    left: 0;
    width: 1px;
    height: calc(100% + 300px);
    background: var(--frame-grid-color, rgb(255 255 255 / 10%));
    content: '';
}

.frame-grid-vertical::after {
    right: 0;
    left: auto;
}

.frame-grid-horizontal,
.frame-grid-vertical {
    inset: 0;
    z-index: 0;
}

.frame-bracket-left,
.frame-bracket-right {
    z-index: 3;
    width: 25px;
    height: 25px;
}

.frame-bracket-left {
    top: -12px;
    left: -12px;
}

.frame-bracket-right {
    right: -12px;
    bottom: -12px;
}

.frame-bracket-left::before,
.frame-bracket-left::after,
.frame-bracket-right::before,
.frame-bracket-right::after {
    position: absolute;
    background: var(--frame-bracket-color, #515356);
    content: '';
}

.frame-bracket-left::before,
.frame-bracket-right::before {
    top: 12px;
    width: 100%;
    height: 1px;
}

.frame-bracket-left::after,
.frame-bracket-right::after {
    left: 12px;
    width: 1px;
    height: 100%;
}

.frame-ring {
    inset: var(--frame-ring-inset);
    z-index: 1;
    border: 1px solid transparent;
    border-radius: calc(var(--frame-radius, 10px) + var(--frame-ring-size));
    background: var(--frame-border-gradient) border-box;
    opacity: var(--frame-ring-opacity);
    -webkit-mask:
        linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
}

.frame-ring-1 {
    --frame-ring-inset: -1px;
    --frame-ring-size: 0px;
    --frame-ring-opacity: 1;
}

.frame-ring-2 {
    --frame-ring-inset: -6px;
    --frame-ring-size: 6px;
    --frame-ring-opacity: 0.5;
}

.frame-ring-3 {
    --frame-ring-inset: -11px;
    --frame-ring-size: 11px;
    --frame-ring-opacity: 0.3;
}

.frame-ring-4 {
    --frame-ring-inset: -16px;
    --frame-ring-size: 16px;
    --frame-ring-opacity: 0.1;
}

.frame-eleven-circle {
    z-index: 0;
    top: 50%;
    left: 50%;
    width: 145%;
    aspect-ratio: 1;
    border: 1px solid var(--frame-grid-color, #353535);
    border-radius: 999px;
    transform: translate(-50%, -50%);
}

.frame-eleven-grid-horizontal {
    inset: 0;
    z-index: 0;
}

.frame-eleven-grid-horizontal::before,
.frame-eleven-grid-horizontal::after {
    position: absolute;
    left: -150px;
    width: calc(100% + 300px);
    height: 1px;
    background: var(--frame-grid-color, #353535);
    content: '';
}

.frame-eleven-grid-horizontal::before {
    top: 50%;
}

.frame-eleven-grid-horizontal::after {
    bottom: 0;
}

.frame-eleven-grid-vertical {
    inset: 0;
    z-index: 0;
}

.frame-eleven-grid-vertical::before,
.frame-eleven-grid-vertical::after {
    position: absolute;
    top: -150px;
    width: 1px;
    height: calc(100% + 300px);
    background: var(--frame-grid-color, #353535);
    content: '';
}

.frame-eleven-grid-vertical::before {
    left: 50%;
}

.frame-eleven-grid-vertical::after {
    right: 0;
}

.frame-eleven-dot {
    z-index: 2;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: var(--frame-dot-color, #fff);
}

.frame-eleven-dot-top-left {
    top: -2px;
    left: -2px;
}

.frame-eleven-dot-top-right {
    top: -2px;
    right: -2px;
}

.frame-eleven-dot-bottom-left {
    bottom: -2px;
    left: -2px;
}

.frame-eleven-dot-bottom-right {
    right: -2px;
    bottom: -2px;
}

.frame-tailwind-gradient {
    z-index: -1;
    top: calc(100% + 1.5rem);
    left: 20px;
    width: clamp(14rem, 80%, 40rem);
    height: 2px;
    background: linear-gradient(
        90deg,
        rgb(14 165 233 / 0),
        #0ea5e9 32%,
        rgb(236 72 153 / 30%) 67%,
        rgb(236 72 153 / 0)
    );
    filter: blur(2px);
}

.frame-firecrawl-line-top,
.frame-firecrawl-line-bottom {
    right: calc(-1 * var(--frame-padding));
    left: calc(-1 * var(--frame-padding));
    z-index: 3;
    height: 1px;
    background: var(--frame-grid-color, #444);
}

.frame-firecrawl-line-top {
    top: calc(-1 * var(--frame-padding));
}

.frame-firecrawl-line-bottom {
    bottom: calc(-1 * var(--frame-padding));
}

.frame-firecrawl-line-left,
.frame-firecrawl-line-right {
    top: calc(-1 * var(--frame-padding));
    bottom: calc(-1 * var(--frame-padding));
    z-index: 3;
    width: 1px;
    background: var(--frame-grid-color, #444);
}

.frame-firecrawl-line-left {
    left: calc(-1 * var(--frame-padding));
}

.frame-firecrawl-line-right {
    right: calc(-1 * var(--frame-padding));
}

.frame-firecrawl-star {
    z-index: 4;
    width: 13px;
    height: 13px;
    color: var(--frame-grid-color, #444);
}

.frame-firecrawl-star::before,
.frame-firecrawl-star::after {
    position: absolute;
    background: currentColor;
    content: '';
}

.frame-firecrawl-star::before {
    top: 6px;
    left: 0;
    width: 100%;
    height: 1px;
}

.frame-firecrawl-star::after {
    top: 0;
    left: 6px;
    width: 1px;
    height: 100%;
}

.frame-firecrawl-star-top-left {
    top: calc(-1 * var(--frame-padding) - 6px);
    left: calc(-1 * var(--frame-padding) - 6px);
}

.frame-firecrawl-star-top-right {
    top: calc(-1 * var(--frame-padding) - 6px);
    right: calc(-1 * var(--frame-padding) - 6px);
}

.frame-firecrawl-star-bottom-left {
    bottom: calc(-1 * var(--frame-padding) - 6px);
    left: calc(-1 * var(--frame-padding) - 6px);
}

.frame-firecrawl-star-bottom-right {
    right: calc(-1 * var(--frame-padding) - 6px);
    bottom: calc(-1 * var(--frame-padding) - 6px);
}

.frame-nuxt-glow-top,
.frame-nuxt-glow-bottom {
    z-index: 0;
    width: 220px;
    height: 160px;
    border-radius: 999px;
    filter: blur(38px);
}

.frame-nuxt-glow-top {
    top: -90px;
    left: -90px;
    background: rgb(0 220 130 / 30%);
}

.frame-nuxt-glow-bottom {
    right: -100px;
    bottom: -100px;
    background: rgb(54 228 218 / 24%);
}

.window-frame-browserbase,
.window-frame-clerk,
.window-frame-cloudflare,
.window-frame-elevenlabs,
.window-frame-firecrawl,
.window-frame-gemini,
.window-frame-mintlify,
.window-frame-nuxt,
.window-frame-openai,
.window-frame-prisma,
.window-frame-resend,
.window-frame-supabase,
.window-frame-tailwind,
.window-frame-triggerdev,
.window-frame-vercel {
    overflow: visible;
}

.window-frame-browserbase .exclude-from-panzoom,
.window-frame-cloudflare .exclude-from-panzoom,
.window-frame-gemini .exclude-from-panzoom,
.window-frame-mintlify .exclude-from-panzoom,
.window-frame-prisma .exclude-from-panzoom,
.window-frame-resend .exclude-from-panzoom,
.window-frame-supabase .exclude-from-panzoom,
.window-frame-tailwind .exclude-from-panzoom,
.window-frame-triggerdev .exclude-from-panzoom {
    position: relative;
    z-index: 2;
    height: var(--frame-header-height, 40px);
    padding: 0 16px;
    border-bottom: 1px solid var(--frame-header-border, transparent);
    border-top-left-radius: calc(var(--frame-radius, 8px) - 1px);
    border-top-right-radius: calc(var(--frame-radius, 8px) - 1px);
    background: var(--frame-header-background, transparent);
}

.window-frame-browserbase .exclude-from-panzoom {
    --frame-header-height: 30px;
    padding-top: 10px;
}

.window-frame-browserbase input,
.window-frame-browserbase span,
.window-frame-cloudflare input,
.window-frame-cloudflare span,
.window-frame-gemini input,
.window-frame-gemini span,
.window-frame-mintlify input,
.window-frame-mintlify span,
.window-frame-prisma input,
.window-frame-prisma span,
.window-frame-resend input,
.window-frame-resend span,
.window-frame-supabase input,
.window-frame-supabase span,
.window-frame-triggerdev input,
.window-frame-triggerdev span {
    color: var(--frame-title-color, inherit);
}

.window-frame-tailwind .exclude-from-panzoom {
    height: 34px;
    padding: 0 12px;
}

.window-frame-clerk > div:not(.exclude-from-panzoom),
.window-frame-elevenlabs > div:not(.exclude-from-panzoom),
.window-frame-firecrawl > div:not(.exclude-from-panzoom),
.window-frame-nuxt > div:not(.exclude-from-panzoom),
.window-frame-openai > div:not(.exclude-from-panzoom),
.window-frame-vercel > div:not(.exclude-from-panzoom) {
    position: relative;
    z-index: 2;
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
    '--frame-padding': `${props.settings.padding}px`,
    '--window-border-width': borderWidth.value,
    '--window-border-color': borderColorRgba.value,
    '--window-backdrop-blur-sm': backdropBlur.value,
}));

const frameWindowStyle = computed(() => {
    const lightMode = props.settings.themeType === 'light';

    const styles = {
        browserbase: {
            backgroundColor: lightMode ? '#fff' : 'hsl(0 0% 6%)',
            border: `2px solid ${lightMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '0',
            '--frame-title-color': lightMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        },
        clerk: {
            padding: '3px',
            backgroundColor: lightMode ? '#f8f8f8' : '#111',
            borderRadius: '8px',
            boxShadow: lightMode
                ? 'rgba(0, 0, 0, 0.08) 0 16px 60px'
                : ['0 0 0 1px rgba(255, 255, 255, 0.05)', '0 24px 80px rgba(0, 0, 0, 0.6)'].join(
                      ', '
                  ),
        },
        cloudflare: {
            backgroundColor: lightMode ? '#f5f5f5' : '#0f0f0f',
            borderRadius: '0',
            '--frame-grid-color': lightMode ? '#dfdfdf' : '#262626',
            '--frame-header-background': lightMode ? '#f5f5f5' : '#0f0f0f',
            '--frame-header-border': lightMode ? '#dfdfdf' : '#262626',
            '--frame-title-color': lightMode ? '#171717' : '#fafafa',
        },
        elevenlabs: {
            backgroundColor: lightMode ? '#fff' : '#111',
            borderRadius: '24px',
            boxShadow: `inset 0 0 0 1px ${lightMode ? '#e5e7eb' : '#353535'}`,
            '--frame-grid-color': lightMode ? '#e5e7eb' : '#353535',
            '--frame-dot-color': lightMode ? '#000' : '#fff',
        },
        firecrawl: {
            backgroundColor: lightMode ? '#fff' : '#111827',
            borderRadius: '8px',
            '--frame-grid-color': lightMode ? '#ededed' : '#444',
        },
        gemini: {
            backgroundColor: lightMode ? 'rgba(255, 255, 255, 0.9)' : '#16181d',
            borderRadius: '26px',
            boxShadow: lightMode ? '0 24px 80px rgb(0 0 0 / 12%)' : '0 30px 100px rgb(0 0 0 / 45%)',
            '--frame-header-background': lightMode ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0, 0, 0, 0.2)',
            '--frame-title-color': lightMode ? '#1867d2' : '#5c9ec7',
        },
        mintlify: {
            backgroundColor: lightMode ? '#fff' : '#070a08',
            borderRadius: '12px',
            boxShadow: lightMode
                ? '0 24px 80px rgb(13 147 115 / 12%)'
                : '0 24px 80px rgb(0 0 0 / 55%)',
            '--frame-header-background': lightMode ? '#fff' : '#010201',
            '--frame-header-border': lightMode ? '#e5e7eb' : '#141818',
            '--frame-title-color': lightMode ? '#0d9373' : '#55d799',
        },
        nuxt: {
            backgroundColor: lightMode ? 'rgba(255, 255, 255, 0.76)' : '#0b0c11',
            borderRadius: '10px',
            '--frame-border-gradient': lightMode
                ? 'linear-gradient(140deg, #8bdfbd, #9ed7ff)'
                : 'linear-gradient(140deg, #00dc82, #36e4da)',
            '--frame-radius': '10px',
        },
        openai: {
            backgroundColor: lightMode ? '#fff' : '#232b41',
            border: `0.5px solid ${lightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '8px',
            boxShadow: lightMode ? '0 24px 60px rgb(0 0 0 / 8%)' : '0 24px 80px rgb(0 0 0 / 28%)',
        },
        prisma: {
            backgroundColor: lightMode ? 'hsl(193 72% 96% / 50%)' : 'hsl(223 41% 7% / 75%)',
            borderRadius: '10px',
            '--frame-border-gradient': lightMode
                ? 'linear-gradient(140deg, #6164cc, #31baaf)'
                : 'linear-gradient(140deg, #3e4083, #16544f)',
            '--frame-radius': '10px',
            '--frame-header-background': lightMode
                ? 'hsl(192 72% 96% / 90%)'
                : 'rgba(0, 0, 0, 0.2)',
            '--frame-header-border': lightMode ? '#dfdfdf' : '#141818',
            '--frame-title-color': lightMode ? '#16a394' : '#31baaf',
        },
        resend: {
            backgroundColor: lightMode ? 'hsl(0 0% 100% / 72%)' : 'hsl(0 0% 0% / 88%)',
            border: `0.5px solid ${lightMode ? 'hsl(0 0% 24% / 13%)' : 'hsl(0 0% 24% / 35%)'}`,
            borderRadius: '8px',
            backdropFilter: 'blur(3px)',
            '--frame-header-background': lightMode ? 'hsl(0 0% 100% / 10%)' : 'hsl(0 0% 0% / 90%)',
            '--frame-header-border': lightMode ? 'hsl(0 0% 24% / 13%)' : 'hsl(0 0% 24% / 35%)',
            '--frame-title-color': lightMode ? '#000' : '#fafafa',
        },
        stripe: {
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
        },
        supabase: {
            backgroundColor: lightMode ? '#f8f8f8' : '#171717',
            border: `1px solid ${lightMode ? '#dfdfdf' : '#292929'}`,
            borderRadius: '6px',
            '--frame-header-background': lightMode ? '#fcfcfc' : '#1f1f1f',
            '--frame-header-border': lightMode ? '#dfdfdf' : '#292929',
            '--frame-title-color': lightMode ? '#171717' : '#fafafa',
        },
        tailwind: {
            backgroundColor: lightMode
                ? 'rgba(255, 255, 255, 0.75)'
                : 'color(display-p3 0.1176 0.1608 0.2314)',
            border: `1px solid ${lightMode ? 'rgb(15 23 42 / 10%)' : 'color(display-p3 0.8235 0.9451 1 / 0.25)'}`,
            borderRadius: '8px',
            boxShadow: lightMode ? '0 2px 4px rgb(0 0 0 / 6%)' : undefined,
            '--frame-grid-color': lightMode ? 'rgb(15 23 42 / 10%)' : 'rgb(255 255 255 / 10%)',
            '--frame-header-border': lightMode ? 'rgb(0 0 0 / 10%)' : 'rgb(255 255 255 / 10%)',
        },
        triggerdev: {
            backgroundColor: lightMode ? '#f5f5f5' : '#121317',
            borderRadius: '8px',
            '--frame-grid-color': lightMode ? '#d9d7d7' : '#272a2e',
            '--frame-header-background': lightMode ? '#f8f8f8' : '#16181d',
            '--frame-header-border': lightMode ? '#e5e5e5' : 'transparent',
            '--frame-title-color': lightMode ? '#171717' : '#b5b8c0',
        },
        vercel: {
            backgroundColor: lightMode ? '#fff' : props.settings.themeBackground,
            borderRadius: '8px',
            '--frame-grid-color': lightMode ? '#ebebeb' : '#1a1a1a',
            '--frame-bracket-color': lightMode ? '#a8a8a8' : '#515356',
        },
    };

    return {
        ...(props.settings.frame !== 'none'
            ? {
                  minWidth: '360px',
                  minHeight: '100px',
              }
            : {}),
        ...(styles[props.settings.frame] ?? {}),
    };
});

const frameWindowDecorations = computed(() => {
    return (
        {
            cloudflare: ['frame-grid-horizontal', 'frame-grid-vertical'],
            elevenlabs: [
                'frame-eleven-circle',
                'frame-eleven-grid-horizontal',
                'frame-eleven-grid-vertical',
                'frame-eleven-dot frame-eleven-dot-top-left',
                'frame-eleven-dot frame-eleven-dot-top-right',
                'frame-eleven-dot frame-eleven-dot-bottom-left',
                'frame-eleven-dot frame-eleven-dot-bottom-right',
            ],
            firecrawl: [
                'frame-firecrawl-line-top',
                'frame-firecrawl-line-bottom',
                'frame-firecrawl-line-left',
                'frame-firecrawl-line-right',
                'frame-firecrawl-star frame-firecrawl-star-top-left',
                'frame-firecrawl-star frame-firecrawl-star-top-right',
                'frame-firecrawl-star frame-firecrawl-star-bottom-left',
                'frame-firecrawl-star frame-firecrawl-star-bottom-right',
            ],
            nuxt: [
                'frame-ring frame-ring-1',
                'frame-ring frame-ring-2',
                'frame-ring frame-ring-3',
                'frame-nuxt-glow-top',
                'frame-nuxt-glow-bottom',
            ],
            prisma: [
                'frame-ring frame-ring-1',
                'frame-ring frame-ring-2',
                'frame-ring frame-ring-3',
                'frame-ring frame-ring-4',
            ],
            tailwind: ['frame-grid-horizontal', 'frame-grid-vertical', 'frame-tailwind-gradient'],
            triggerdev: ['frame-grid-horizontal', 'frame-grid-vertical'],
            vercel: [
                'frame-grid-horizontal',
                'frame-grid-vertical',
                'frame-bracket-left',
                'frame-bracket-right',
            ],
        }[props.settings.frame] ?? []
    );
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
