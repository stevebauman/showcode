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
        <Interact
            v-if="!preview && settings.frame === 'none'"
            drag
            @dragmove="$emit('update:scale', $event.delta.y)"
        >
            <ButtonResize
                data-hide
                :zoom-scale="Math.pow(windowScale * zoom, -1)"
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
                class="frame-menu absolute"
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
            ref="codeWindowContent"
            class="code-window-content"
            :class="[
                {
                    flex: settings.landscape && blocks.length > 1,
                    'flex flex-col': !settings.landscape && blocks.length > 1,
                    'divide-x': settings.landscape && settings.showDividers,
                    'divide-y': !settings.landscape && settings.showDividers,
                },
            ]"
        >
            <pre
                v-if="settings.frame === 'firecrawl'"
                class="frame-firecrawl-ascii"
                :style="{ fontSize: firecrawlAsciiFontSize }"
                v-text="firecrawlAscii"
            ></pre>

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

.frame-grid-horizontal::before,
.frame-grid-horizontal::after,
.frame-eleven-grid-horizontal-top,
.frame-eleven-grid-horizontal-center,
.frame-eleven-grid-horizontal-bottom,
.frame-firecrawl-line-top,
.frame-firecrawl-line-bottom {
    right: calc(-1 * var(--frame-gutter-right, 150px));
    left: calc(-1 * var(--frame-gutter-left, 150px));
    width: auto;
}

.frame-grid-vertical::before,
.frame-grid-vertical::after {
    position: absolute;
    top: calc(-1 * var(--frame-gutter-top, 150px));
    bottom: calc(-1 * var(--frame-gutter-bottom, 150px));
    left: 0;
    width: 1px;
    height: auto;
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
    width: var(--frame-eleven-circle-size, 110%);
    height: var(--frame-eleven-circle-size, 110%);
    aspect-ratio: 1;
    border: 1px solid var(--frame-grid-color, #353535);
    border-radius: 999px;
    transform: translate(-50%, -50%);
}

.frame-eleven-grid-horizontal-top,
.frame-eleven-grid-horizontal-center,
.frame-eleven-grid-horizontal-bottom {
    position: absolute;
    height: 1px;
    background: var(--frame-grid-color, #353535);
    z-index: 0;
}

.frame-eleven-grid-horizontal-top {
    top: 0;
}

.frame-eleven-grid-horizontal-center {
    top: 50%;
    transform: translateY(-50%);
}

.frame-eleven-grid-horizontal-bottom {
    bottom: 0;
}

.frame-eleven-grid-vertical-left,
.frame-eleven-grid-vertical-center,
.frame-eleven-grid-vertical-right {
    position: absolute;
    top: calc(-1 * var(--frame-gutter-top, 150px));
    bottom: calc(-1 * var(--frame-gutter-bottom, 150px));
    width: 1px;
    height: auto;
    background: var(--frame-grid-color, #353535);
    z-index: 0;
}

.frame-eleven-grid-vertical-left {
    left: 0;
}

.frame-eleven-grid-vertical-center {
    left: 50%;
    transform: translateX(-50%);
}

.frame-eleven-grid-vertical-right {
    right: 0;
}

.frame-eleven-dot {
    z-index: 4;
    width: 3px;
    height: 3px;
    border-radius: 999px;
    background: var(--frame-dot-color, #fff);
}

.frame-eleven-dot-top-left {
    top: -1px;
    left: -1px;
}

.frame-eleven-dot-top-right {
    top: -1px;
    right: -1px;
}

.frame-eleven-dot-bottom-left {
    bottom: -1px;
    left: -1px;
}

.frame-eleven-dot-bottom-right {
    right: -1px;
    bottom: -1px;
}

.frame-eleven-corner-top-left,
.frame-eleven-corner-top-right,
.frame-eleven-corner-bottom-right,
.frame-eleven-corner-bottom-left {
    position: absolute;
    width: 1px;
    background: var(--frame-grid-color, #353535);
    z-index: 0;
}

.frame-eleven-corner-top-left {
    top: calc(-1 * var(--frame-corner-top-left-length, 200px));
    left: 0;
    height: var(--frame-corner-top-left-length, 200px);
    transform: rotate(-45deg);
    transform-origin: bottom right;
}

.frame-eleven-corner-top-right {
    top: calc(-1 * var(--frame-corner-top-right-length, 200px));
    right: 0;
    height: var(--frame-corner-top-right-length, 200px);
    transform: rotate(45deg);
    transform-origin: bottom left;
}

.frame-eleven-corner-bottom-right {
    right: 0;
    bottom: calc(-1 * var(--frame-corner-bottom-right-length, 200px));
    height: var(--frame-corner-bottom-right-length, 200px);
    transform: rotate(-45deg);
    transform-origin: top left;
}

.frame-eleven-corner-bottom-left {
    bottom: calc(-1 * var(--frame-corner-bottom-left-length, 200px));
    left: 0;
    height: var(--frame-corner-bottom-left-length, 200px);
    transform: rotate(45deg);
    transform-origin: top right;
}

.frame-tailwind-gradient {
    z-index: -1;
    top: calc(100% + 1.5rem);
    left: 20px;
    overflow: hidden;
    width: 100%;
    height: 32px;
    margin-top: -1px;
}

.frame-tailwind-gradient::before,
.frame-tailwind-gradient::after {
    position: absolute;
    top: -1px;
    left: 0;
    width: clamp(14rem, 80%, 40rem);
    height: 2px;
    background: linear-gradient(
        90deg,
        rgb(14 165 233 / 0),
        #0ea5e9 32%,
        rgb(236 72 153 / 30%) 67%,
        rgb(236 72 153 / 0)
    );
    content: '';
}

.frame-tailwind-gradient::before {
    filter: blur(4px);
}

.frame-tailwind-gradient::after {
    filter: blur(1px);
}

.frame-firecrawl-line-top,
.frame-firecrawl-line-bottom {
    z-index: 3;
    height: 1px;
    background: var(--frame-grid-color, #444);
}

.frame-firecrawl-line-top {
    top: 0;
}

.frame-firecrawl-line-bottom {
    bottom: 0;
}

.frame-firecrawl-line-left,
.frame-firecrawl-line-right {
    top: calc(-1 * var(--frame-gutter-top, 150px));
    bottom: calc(-1 * var(--frame-gutter-bottom, 150px));
    z-index: 3;
    width: 1px;
    background: var(--frame-grid-color, #444);
}

.frame-firecrawl-line-left {
    left: 0;
}

.frame-firecrawl-line-right {
    right: 0;
}

.frame-firecrawl-star {
    z-index: 4;
    width: 22px;
    height: 21px;
    background: var(--frame-grid-color, #444);
    clip-path: path(
        'M10.5 4C10.5 7.31371 7.81371 10 4.5 10H0.5V11H4.5C7.81371 11 10.5 13.6863 10.5 17V21H11.5V17C11.5 13.6863 14.1863 11 17.5 11H21.5V10H17.5C14.1863 10 11.5 7.31371 11.5 4V0H10.5V4Z'
    );
}

.frame-firecrawl-star-top-left {
    top: -10px;
    left: -10.5px;
}

.frame-firecrawl-star-top-right {
    top: -10px;
    right: -10.5px;
}

.frame-firecrawl-star-bottom-left {
    bottom: -10px;
    left: -10.5px;
}

.frame-firecrawl-star-bottom-right {
    right: -10.5px;
    bottom: -10px;
}

.frame-laravel-line-top,
.frame-laravel-line-bottom {
    right: calc(-1 * min(var(--frame-gutter-right, 150px), 96px));
    left: calc(-1 * min(var(--frame-gutter-left, 150px), 96px));
    z-index: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--frame-grid-color), transparent);
}

.frame-laravel-line-top {
    top: -24px;
}

.frame-laravel-line-bottom {
    bottom: -24px;
}

.frame-laravel-panel {
    inset: -18px;
    z-index: 0;
    border: 1px solid var(--frame-laravel-panel-border, rgb(255 45 32 / 18%));
    border-radius: 28px;
    background: var(
        --frame-laravel-panel-background,
        linear-gradient(135deg, rgb(255 45 32 / 12%), rgb(255 45 32 / 2%))
    );
    transform: rotate(-3deg);
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
.window-frame-laravel,
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
.window-frame-elevenlabs .exclude-from-panzoom,
.window-frame-gemini .exclude-from-panzoom,
.window-frame-laravel .exclude-from-panzoom,
.window-frame-mintlify .exclude-from-panzoom,
.window-frame-prisma .exclude-from-panzoom,
.window-frame-resend .exclude-from-panzoom,
.window-frame-supabase .exclude-from-panzoom,
.window-frame-tailwind .exclude-from-panzoom,
.window-frame-triggerdev .exclude-from-panzoom {
    position: relative;
    z-index: 2;
    height: var(--frame-header-height, 40px);
    padding: var(--frame-header-padding, 0 16px);
    border-top: var(--frame-header-border-top, 0);
    border-right: var(--frame-header-border-right, 0);
    border-bottom: 1px solid var(--frame-header-border, transparent);
    border-left: var(--frame-header-border-left, 0);
    border-top-left-radius: calc(var(--frame-radius, 8px) - 1px);
    border-top-right-radius: calc(var(--frame-radius, 8px) - 1px);
    background: var(--frame-header-background, transparent);
}

.window-frame-browserbase .frame-menu,
.window-frame-cloudflare .frame-menu,
.window-frame-gemini .frame-menu,
.window-frame-laravel .frame-menu,
.window-frame-mintlify .frame-menu,
.window-frame-prisma .frame-menu,
.window-frame-resend .frame-menu,
.window-frame-supabase .frame-menu,
.window-frame-tailwind .frame-menu,
.window-frame-triggerdev .frame-menu {
    left: var(--frame-header-menu-left, 16px);
}

.window-frame-browserbase input,
.window-frame-browserbase span,
.window-frame-cloudflare input,
.window-frame-cloudflare span,
.window-frame-elevenlabs input,
.window-frame-elevenlabs span,
.window-frame-gemini input,
.window-frame-gemini span,
.window-frame-laravel input,
.window-frame-laravel span,
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

.window-frame-triggerdev .exclude-from-panzoom {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.window-frame-triggerdev .frame-grid-horizontal::before,
.window-frame-triggerdev .frame-grid-horizontal::after {
    left: 50%;
    width: max(100%, 1200px);
    transform: translateX(-50%);
}

.window-frame-tailwind .frame-grid-horizontal::before {
    top: -1.5rem;
    -webkit-mask-image: linear-gradient(
        to left,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
    mask-image: linear-gradient(
        to left,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
}

.window-frame-tailwind .frame-grid-horizontal::after {
    bottom: -1.5rem;
    -webkit-mask-image: linear-gradient(
        to left,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
    mask-image: linear-gradient(
        to left,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
}

.window-frame-tailwind .frame-grid-vertical::before {
    left: -1.5rem;
    -webkit-mask-image: linear-gradient(
        to top,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
    mask-image: linear-gradient(
        to top,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
}

.window-frame-tailwind .frame-grid-vertical::after {
    right: -1.5rem;
    -webkit-mask-image: linear-gradient(
        to top,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
    mask-image: linear-gradient(
        to top,
        transparent,
        white 4rem,
        white calc(100% - 4rem),
        transparent
    );
}

.window-frame-clerk .code-window-content,
.window-frame-elevenlabs .code-window-content,
.window-frame-firecrawl .code-window-content,
.window-frame-laravel .code-window-content,
.window-frame-nuxt .code-window-content,
.window-frame-openai .code-window-content,
.window-frame-vercel .code-window-content {
    position: relative;
    z-index: 2;
}

.window-frame-elevenlabs::before {
    position: absolute;
    inset: 0;
    z-index: 5;
    border: 1px solid var(--frame-grid-color, #353535);
    border-radius: var(--frame-eleven-radius, 24px);
    content: '';
    pointer-events: none;
}

.window-frame-elevenlabs .code-window-content {
    overflow: hidden;
    border-radius: var(--frame-eleven-radius, 24px);
    background: var(--frame-eleven-background, #111);
}

.frame-firecrawl-ascii {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    width: max-content;
    max-width: 100%;
    overflow: hidden;
    margin: 0;
    color: #f97316;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    line-height: 1;
    text-align: center;
    white-space: pre;
    pointer-events: none;
    transform: translateX(-50%);
    -webkit-mask-image: linear-gradient(
        to bottom,
        rgb(0 0 0 / 10%) 0%,
        rgb(0 0 0 / 50%) 50%,
        rgb(0 0 0 / 90%) 100%
    );
    mask-image: linear-gradient(
        to bottom,
        rgb(0 0 0 / 10%) 0%,
        rgb(0 0 0 / 50%) 50%,
        rgb(0 0 0 / 90%) 100%
    );
}

.window-frame-firecrawl .code-window-content > div {
    position: relative;
    z-index: 2;
}
</style>

<script setup>
import chroma from 'chroma-js';
import useFonts from '@/composables/useFonts';
import { get, merge, cloneDeep, capitalize } from 'lodash';
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';

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
    frameGutters: {
        type: Object,
        default: null,
    },
});

defineExpose({
    actualWidth: () => root.value.clientWidth,
    actualHeight: () => root.value.clientHeight,
});

const emit = defineEmits(['update:scale', 'update:title']);

const { fontFamilies } = useFonts();

const root = ref(null);
const codeWindowContent = ref(null);
const titleInput = ref(null);
const editingTitle = ref(false);
const isSafari = ref(false);
const title = ref(String(props.settings.title || ''));
const elevenCircleDiameter = ref(0);
const firecrawlAsciiFontSize = ref('10px');

let elevenCircleResizeObserver = null;
let elevenCircleAnimationFrame = null;
let firecrawlAsciiResizeObserver = null;
let firecrawlAsciiAnimationFrame = null;

const firecrawlAscii = `                                   .. ..-
                                   :          .
                              ..        .   ..-
                            .        .._  ..-...:.              ..       .
                  .      .  .-.    ...     .-.-.._.-   ..        .-..     .      .
               ...._. . .-.....-:....      ..-::.::._=:.  ....       ...  .-      ....
             .....-._.._.:.....-.+:....-..    .....-:+++++++=:..-.---..    ...:.-..      ....
           .._.-._.-.:_.:-.  ...+..+:._-....:-._:+++++===+:_:+:....      -..+++++.:..  .-._-..      .
        .........--::+:._-:-.._..-.+:.-_::++_.:+:+========+=+:+:--..  .   _-_.:+===+-. ._..+:.-........  .
       ....-..---_-++====+:_:=:..+:.:+=+-..._++++======X==========++::.:+-..  .:+====X==+=++++++-.-......
     .......-:+:_:+:++=XX=X======++++++=X===::+++:++==XXXXXX===+==++===+=+=========XXX===++++=+:_---...-..-.`;

const firecrawlAsciiLongestLine = Math.max(
    ...firecrawlAscii.split('\n').map((line) => line.length)
);

function editTitle() {
    editingTitle.value = true;

    nextTick(() => titleInput.value.focus());
}

function scheduleElevenCircleSizeUpdate() {
    if (elevenCircleAnimationFrame) {
        cancelAnimationFrame(elevenCircleAnimationFrame);
    }

    elevenCircleAnimationFrame = requestAnimationFrame(updateElevenCircleSize);
}

function updateElevenCircleSize() {
    elevenCircleAnimationFrame = null;

    if (!root.value) {
        return;
    }

    const width = root.value.offsetWidth;
    const height = root.value.offsetHeight;

    elevenCircleDiameter.value = width && height ? Math.ceil(Math.hypot(width, height)) : 0;
}

function scheduleFirecrawlAsciiSizeUpdate() {
    if (firecrawlAsciiAnimationFrame) {
        cancelAnimationFrame(firecrawlAsciiAnimationFrame);
    }

    firecrawlAsciiAnimationFrame = requestAnimationFrame(updateFirecrawlAsciiSize);
}

function updateFirecrawlAsciiSize() {
    firecrawlAsciiAnimationFrame = null;

    const width = codeWindowContent.value?.clientWidth ?? 0;

    if (!width) {
        firecrawlAsciiFontSize.value = '10px';
        return;
    }

    const monospaceCharRatio = 0.62;
    const fontSize = Math.min(
        10,
        Math.max(3, width / firecrawlAsciiLongestLine / monospaceCharRatio)
    );

    firecrawlAsciiFontSize.value = `${fontSize}px`;
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
    transform: `scale(${windowScale.value})`,
    lineHeight: `${props.settings.lineHeight}px`,
    marginTop: `${props.settings.marginTop}px`,
    marginBottom: `${props.settings.marginBottom}px`,
    marginLeft: `${props.settings.marginLeft}px`,
    marginRight: `${props.settings.marginRight}px`,
    backgroundColor: props.settings.themeBackground,
    backdropFilter: backdropBlur.value,
    '--frame-padding': `${props.settings.padding}px`,
    '--frame-padding-x': `${Number(props.settings.lockWindowPaddingX ?? 0) / 2}px`,
    '--frame-padding-y': `${Number(props.settings.lockWindowPaddingY ?? 0) / 2}px`,
    '--window-border-width': borderWidth.value,
    '--window-border-color': borderColorRgba.value,
    '--window-backdrop-blur-sm': backdropBlur.value,
}));

const windowScale = computed(() => {
    if (props.settings.frame && props.settings.frame !== 'none') {
        return 1;
    }

    return props.settings.scale;
});

function frameGutter(side) {
    if (props.frameGutters) {
        return Math.max(0, Number(props.frameGutters[side]) || 0);
    }

    if (side === 'left' || side === 'right') {
        return Math.max(0, Number(props.settings.lockWindowPaddingX ?? 0) / 2);
    }

    return Math.max(0, Number(props.settings.lockWindowPaddingY ?? 0) / 2);
}

const frameGutterVars = computed(() => {
    const top = frameGutter('top');
    const right = frameGutter('right');
    const bottom = frameGutter('bottom');
    const left = frameGutter('left');

    return {
        '--frame-gutter-top': `${top}px`,
        '--frame-gutter-right': `${right}px`,
        '--frame-gutter-bottom': `${bottom}px`,
        '--frame-gutter-left': `${left}px`,
        '--frame-corner-top-left-length': `${Math.ceil(Math.hypot(top, left))}px`,
        '--frame-corner-top-right-length': `${Math.ceil(Math.hypot(top, right))}px`,
        '--frame-corner-bottom-right-length': `${Math.ceil(Math.hypot(bottom, right))}px`,
        '--frame-corner-bottom-left-length': `${Math.ceil(Math.hypot(bottom, left))}px`,
    };
});

const frameWindowStyle = computed(() => {
    const lightMode = props.settings.themeType === 'light';

    const styles = {
        browserbase: {
            backgroundColor: lightMode ? '#fff' : 'hsl(0 0% 6%)',
            border: `2px solid ${lightMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '0',
            '--frame-header-height': '30px',
            '--frame-header-padding': '10px 16px 0',
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
            backgroundColor: lightMode ? '#fff' : '#0c0c0c',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--frame-radius': '1px',
            '--frame-grid-color': lightMode ? '#dfdfdf' : '#262626',
            '--frame-header-background': 'transparent',
            '--frame-header-border': 'transparent',
            '--frame-title-color': lightMode ? '#171717' : '#fafafa',
        },
        elevenlabs: {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--frame-eleven-background': lightMode ? '#fff' : '#111',
            '--frame-eleven-radius': '24px',
            '--frame-eleven-circle-size': elevenCircleDiameter.value
                ? `${elevenCircleDiameter.value}px`
                : undefined,
            '--frame-grid-color': lightMode ? '#e5e7eb' : '#353535',
            '--frame-dot-color': lightMode ? '#000' : '#fff',
            '--frame-header-background': lightMode ? '#fff' : '#111',
            '--frame-header-border': lightMode ? '#e5e7eb' : '#353535',
            '--frame-title-color': lightMode ? '#000' : '#fff',
        },
        firecrawl: {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--frame-grid-color': lightMode ? '#ededed' : '#444',
        },
        gemini: {
            backgroundColor: lightMode ? 'rgba(255, 255, 255, 0.9)' : '#16181d',
            borderRadius: '26px',
            boxShadow: lightMode ? '0 24px 80px rgb(0 0 0 / 12%)' : '0 30px 100px rgb(0 0 0 / 45%)',
            '--frame-radius': '26px',
            '--frame-header-height': '44px',
            '--frame-header-padding': '0 18px',
            '--frame-header-background': lightMode
                ? 'rgba(255, 255, 255, 0.42)'
                : 'rgba(0, 0, 0, 0.2)',
            '--frame-title-color': lightMode ? '#1867d2' : '#5c9ec7',
        },
        laravel: {
            backgroundColor: lightMode ? '#fff7f6' : '#160f0f',
            border: `1px solid ${lightMode ? 'rgb(255 45 32 / 18%)' : 'rgb(255 255 255 / 9%)'}`,
            borderRadius: '12px',
            boxShadow: lightMode
                ? '0 24px 80px rgb(255 45 32 / 12%)'
                : '0 30px 90px rgb(0 0 0 / 45%), 0 0 80px rgb(255 45 32 / 10%)',
            '--frame-grid-color': lightMode ? 'rgb(255 45 32 / 22%)' : 'rgb(255 45 32 / 30%)',
            '--frame-header-height': '42px',
            '--frame-header-padding': '0 18px',
            '--frame-header-background': lightMode ? '#fffafa' : '#1d1212',
            '--frame-header-border': lightMode ? 'rgb(255 45 32 / 12%)' : 'rgb(255 255 255 / 8%)',
            '--frame-laravel-panel-background': lightMode
                ? 'linear-gradient(135deg, rgb(255 45 32 / 8%), rgb(255 45 32 / 0%))'
                : 'linear-gradient(135deg, rgb(255 45 32 / 12%), rgb(255 45 32 / 2%))',
            '--frame-laravel-panel-border': 'rgb(255 45 32 / 18%)',
            '--frame-title-color': lightMode ? '#b42318' : '#ff9b92',
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
            '--frame-header-height': '40px',
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
            '--frame-header-height': '40px',
            '--frame-header-background': lightMode ? 'hsl(0 0% 100% / 10%)' : 'hsl(0 0% 0% / 90%)',
            '--frame-header-border': lightMode ? 'hsl(0 0% 24% / 13%)' : 'hsl(0 0% 24% / 35%)',
            '--frame-title-color': lightMode ? '#000' : '#fafafa',
        },
        stripe: {
            minWidth: '360px',
            backgroundColor: '#0c2e4e',
            border: '1px solid #0f395e',
            borderRadius: '8px',
            boxShadow: isSafari.value
                ? 'none'
                : [
                      'rgba(50, 50, 93, 0.25) 0 50px 100px -20px',
                      'rgba(0, 0, 0, 0.3) 0 30px 60px -30px',
                  ].join(', '),
        },
        supabase: {
            backgroundColor: lightMode ? '#f8f8f8' : '#171717',
            border: `1px solid ${lightMode ? '#dfdfdf' : '#292929'}`,
            borderRadius: '6px',
            '--frame-header-height': '40px',
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
            '--frame-header-height': '34px',
            '--frame-header-padding': '0 12px',
            '--frame-header-border': lightMode ? 'rgb(0 0 0 / 10%)' : 'rgb(255 255 255 / 10%)',
        },
        triggerdev: {
            backgroundColor: lightMode ? '#f5f5f5' : '#121317',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--frame-radius': '8px',
            '--frame-grid-color': lightMode ? '#d9d7d7' : '#272a2e',
            '--frame-header-background': lightMode ? '#f8f8f8' : '#16181d',
            '--frame-header-border': lightMode ? '#e5e5e5' : 'transparent',
            '--frame-header-border-top': `1px solid ${lightMode ? '#d9d7d7' : '#272a2e'}`,
            '--frame-header-border-right': `1px solid ${lightMode ? '#d9d7d7' : '#272a2e'}`,
            '--frame-header-border-left': `1px solid ${lightMode ? '#d9d7d7' : '#272a2e'}`,
            '--frame-title-color': lightMode ? '#171717' : '#b5b8c0',
        },
        vercel: {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--frame-grid-color': lightMode ? '#ebebeb' : '#1a1a1a',
            '--frame-bracket-color': lightMode ? '#a8a8a8' : '#515356',
        },
    };

    return {
        ...(props.settings.frame !== 'none'
            ? {
                  minWidth: '360px',
                  minHeight: '100px',
                  ...frameGutterVars.value,
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
                'frame-eleven-grid-horizontal-top',
                'frame-eleven-grid-horizontal-center',
                'frame-eleven-grid-horizontal-bottom',
                'frame-eleven-grid-vertical-left',
                'frame-eleven-grid-vertical-center',
                'frame-eleven-grid-vertical-right',
                'frame-eleven-dot frame-eleven-dot-top-left',
                'frame-eleven-dot frame-eleven-dot-top-right',
                'frame-eleven-dot frame-eleven-dot-bottom-left',
                'frame-eleven-dot frame-eleven-dot-bottom-right',
                'frame-eleven-corner-top-left',
                'frame-eleven-corner-top-right',
                'frame-eleven-corner-bottom-right',
                'frame-eleven-corner-bottom-left',
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
            laravel: ['frame-laravel-panel', 'frame-laravel-line-top', 'frame-laravel-line-bottom'],
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
    elevenCircleResizeObserver = new ResizeObserver(scheduleElevenCircleSizeUpdate);
    firecrawlAsciiResizeObserver = new ResizeObserver(scheduleFirecrawlAsciiSizeUpdate);

    if (root.value) {
        elevenCircleResizeObserver.observe(root.value);
    }

    if (codeWindowContent.value) {
        firecrawlAsciiResizeObserver.observe(codeWindowContent.value);
    }

    nextTick(scheduleElevenCircleSizeUpdate);
    nextTick(scheduleFirecrawlAsciiSizeUpdate);
});

onBeforeUnmount(() => {
    if (elevenCircleAnimationFrame) {
        cancelAnimationFrame(elevenCircleAnimationFrame);
    }

    if (firecrawlAsciiAnimationFrame) {
        cancelAnimationFrame(firecrawlAsciiAnimationFrame);
    }

    elevenCircleResizeObserver?.disconnect();
    firecrawlAsciiResizeObserver?.disconnect();
});
</script>
