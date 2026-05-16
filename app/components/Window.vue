<template>
    <div
        ref="root"
        class="relative"
        data-scene-window
        :class="{
            'window-border': settings.showBorder,
            'window-header-hidden': !settings.showHeader,
            [`window-scene-${settings.scene}`]: settings.scene && settings.scene !== 'none',
            'origin-center': settings.position === 'center',
            'origin-top': settings.position === 'top',
            'origin-bottom': settings.position === 'bottom',
            'origin-left': settings.position === 'left',
            'origin-right': settings.position === 'right',
        }"
        :style="[windowStyle, sceneWindowStyle, titleColorStyle]"
    >
        <Interact
            v-if="!preview && settings.scene === 'none'"
            drag
            @dragmove="$emit('update:scale', $event.delta.y)"
        >
            <ButtonResize
                data-hide
                :zoom-scale="Math.pow(windowScale * zoom, -1)"
                class="invisible absolute bottom-0 left-1/2 -m-1.5 h-2.5 w-2.5 group-hover:visible"
            />
        </Interact>

        <template v-if="sceneWindowDecorations.length">
            <span
                v-for="decoration in sceneWindowDecorations"
                :key="decoration"
                class="scene-window-decoration"
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
                class="scene-menu absolute"
                :appearance="fauxMenuAppearance"
            />

            <div
                v-if="settings.showTitle"
                @click="preview ? null : editTitle()"
                class="window-title-field w-full text-center whitespace-nowrap text-gray-400"
                :class="{
                    'mx-14': settings.showMenu,
                    'is-editable': !preview,
                    'is-editing': editingTitle,
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
                    class="window-title-input appearance-none border-0 bg-transparent p-0 text-center text-sm font-medium shadow-none focus:ring-0"
                />

                <span v-else class="window-title-placeholder text-sm font-medium">Untitled-1</span>
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
                v-if="settings.scene === 'firecrawl'"
                class="scene-firecrawl-ascii"
                :style="{ fontSize: firecrawlAsciiFontSize }"
                v-text="firecrawlAscii"
            ></pre>

            <div
                class="flex items-center overflow-hidden"
                v-for="({ lines, added, removed, focused }, index) in blocks"
                :key="index"
                :style="{
                    paddingTop: `${
                        settings.showHeader && settings.paddingLocked && !sceneSelected
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

.window-title-field {
    display: flex;
    min-width: 0;
    height: 28px;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 7px;
    padding: 0 10px;
    color: var(--scene-title-color, rgb(156 163 175));
    transition:
        background-color 140ms ease,
        border-color 140ms ease,
        box-shadow 140ms ease,
        color 140ms ease;
}

.window-title-field.is-editable {
    cursor: text;
}

.window-title-field.is-editable:hover {
    border-color: var(
        --scene-title-hover-border,
        var(--scene-header-border, rgb(255 255 255 / 12%))
    );
    background: var(--scene-title-hover-background, rgb(255 255 255 / 5%));
    box-shadow: inset 0 1px 0 var(--scene-title-hover-highlight, rgb(255 255 255 / 5%));
}

.window-title-field.is-editing {
    border-color: var(--scene-title-edit-border, var(--scene-title-color, rgb(139 92 246)));
    background: var(--scene-title-edit-background, rgb(255 255 255 / 7%));
    box-shadow: 0 0 0 2px var(--scene-title-edit-ring, rgb(255 255 255 / 5%));
}

.window-title-input {
    max-width: 100%;
    color: inherit;
}

.window-title-placeholder {
    color: inherit;
}

.scene-window-decoration {
    position: absolute;
    pointer-events: none;
}

.scene-grid-horizontal::before,
.scene-grid-horizontal::after {
    position: absolute;
    top: 0;
    left: -150px;
    width: calc(100% + 300px);
    height: 1px;
    background: var(--scene-grid-color, rgb(255 255 255 / 10%));
    content: '';
}

.scene-grid-horizontal::after {
    top: auto;
    bottom: 0;
}

.scene-grid-horizontal::before,
.scene-grid-horizontal::after,
.scene-eleven-grid-horizontal-top,
.scene-eleven-grid-horizontal-center,
.scene-eleven-grid-horizontal-bottom,
.scene-firecrawl-line-top,
.scene-firecrawl-line-bottom {
    right: calc(-1 * var(--scene-gutter-right, 150px));
    left: calc(-1 * var(--scene-gutter-left, 150px));
    width: auto;
}

.scene-grid-vertical::before,
.scene-grid-vertical::after {
    position: absolute;
    top: calc(-1 * var(--scene-gutter-top, 150px));
    bottom: calc(-1 * var(--scene-gutter-bottom, 150px));
    left: 0;
    width: 1px;
    height: auto;
    background: var(--scene-grid-color, rgb(255 255 255 / 10%));
    content: '';
}

.scene-grid-vertical::after {
    right: 0;
    left: auto;
}

.scene-grid-horizontal,
.scene-grid-vertical {
    inset: 0;
    z-index: 0;
}

.scene-bracket-left,
.scene-bracket-right {
    z-index: 3;
    width: 25px;
    height: 25px;
}

.scene-bracket-left {
    top: -12px;
    left: -12px;
}

.scene-bracket-right {
    right: -12px;
    bottom: -12px;
}

.scene-bracket-left::before,
.scene-bracket-left::after,
.scene-bracket-right::before,
.scene-bracket-right::after {
    position: absolute;
    background: var(--scene-bracket-color, #515356);
    content: '';
}

.scene-bracket-left::before,
.scene-bracket-right::before {
    top: 12px;
    width: 100%;
    height: 1px;
}

.scene-bracket-left::after,
.scene-bracket-right::after {
    left: 12px;
    width: 1px;
    height: 100%;
}

.scene-ring {
    inset: var(--scene-ring-inset);
    z-index: 1;
    border: 1px solid transparent;
    border-radius: calc(var(--scene-radius, 10px) + var(--scene-ring-size));
    background: var(--scene-border-gradient) border-box;
    opacity: var(--scene-ring-opacity);
    -webkit-mask:
        linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
}

.scene-ring-1 {
    --scene-ring-inset: -1px;
    --scene-ring-size: 0px;
    --scene-ring-opacity: 1;
}

.scene-ring-2 {
    --scene-ring-inset: -6px;
    --scene-ring-size: 6px;
    --scene-ring-opacity: 0.5;
}

.scene-ring-3 {
    --scene-ring-inset: -11px;
    --scene-ring-size: 11px;
    --scene-ring-opacity: 0.3;
}

.scene-ring-4 {
    --scene-ring-inset: -16px;
    --scene-ring-size: 16px;
    --scene-ring-opacity: 0.1;
}

.scene-eleven-circle {
    z-index: 0;
    top: 50%;
    left: 50%;
    width: var(--scene-eleven-circle-size, 110%);
    height: var(--scene-eleven-circle-size, 110%);
    aspect-ratio: 1;
    border: 1px solid var(--scene-grid-color, #353535);
    border-radius: 999px;
    transform: translate(-50%, -50%);
}

.scene-eleven-grid-horizontal-top,
.scene-eleven-grid-horizontal-center,
.scene-eleven-grid-horizontal-bottom {
    position: absolute;
    height: 1px;
    background: var(--scene-grid-color, #353535);
    z-index: 0;
}

.scene-eleven-grid-horizontal-top {
    top: 0;
}

.scene-eleven-grid-horizontal-center {
    top: 50%;
    transform: translateY(-50%);
}

.scene-eleven-grid-horizontal-bottom {
    bottom: 0;
}

.scene-eleven-grid-vertical-left,
.scene-eleven-grid-vertical-center,
.scene-eleven-grid-vertical-right {
    position: absolute;
    top: calc(-1 * var(--scene-gutter-top, 150px));
    bottom: calc(-1 * var(--scene-gutter-bottom, 150px));
    width: 1px;
    height: auto;
    background: var(--scene-grid-color, #353535);
    z-index: 0;
}

.scene-eleven-grid-vertical-left {
    left: 0;
}

.scene-eleven-grid-vertical-center {
    left: 50%;
    transform: translateX(-50%);
}

.scene-eleven-grid-vertical-right {
    right: 0;
}

.scene-eleven-dot {
    z-index: 4;
    width: 3px;
    height: 3px;
    border-radius: 999px;
    background: var(--scene-dot-color, #fff);
}

.scene-eleven-dot-top-left {
    top: -1px;
    left: -1px;
}

.scene-eleven-dot-top-right {
    top: -1px;
    right: -1px;
}

.scene-eleven-dot-bottom-left {
    bottom: -1px;
    left: -1px;
}

.scene-eleven-dot-bottom-right {
    right: -1px;
    bottom: -1px;
}

.scene-eleven-corner-top-left,
.scene-eleven-corner-top-right,
.scene-eleven-corner-bottom-right,
.scene-eleven-corner-bottom-left {
    position: absolute;
    width: 1px;
    background: var(--scene-grid-color, #353535);
    z-index: 0;
}

.scene-eleven-corner-top-left {
    top: calc(-1 * var(--scene-corner-top-left-length, 200px));
    left: 0;
    height: var(--scene-corner-top-left-length, 200px);
    transform: rotate(-45deg);
    transform-origin: bottom right;
}

.scene-eleven-corner-top-right {
    top: calc(-1 * var(--scene-corner-top-right-length, 200px));
    right: 0;
    height: var(--scene-corner-top-right-length, 200px);
    transform: rotate(45deg);
    transform-origin: bottom left;
}

.scene-eleven-corner-bottom-right {
    right: 0;
    bottom: calc(-1 * var(--scene-corner-bottom-right-length, 200px));
    height: var(--scene-corner-bottom-right-length, 200px);
    transform: rotate(-45deg);
    transform-origin: top left;
}

.scene-eleven-corner-bottom-left {
    bottom: calc(-1 * var(--scene-corner-bottom-left-length, 200px));
    left: 0;
    height: var(--scene-corner-bottom-left-length, 200px);
    transform: rotate(45deg);
    transform-origin: top right;
}

.scene-tailwind-gradient {
    z-index: -1;
    top: calc(100% + 1.5rem);
    left: 20px;
    overflow: hidden;
    width: 100%;
    height: 32px;
    margin-top: -1px;
}

.scene-tailwind-gradient::before,
.scene-tailwind-gradient::after {
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

.scene-tailwind-gradient::before {
    filter: blur(4px);
}

.scene-tailwind-gradient::after {
    filter: blur(1px);
}

.scene-firecrawl-line-top,
.scene-firecrawl-line-bottom {
    z-index: 3;
    height: 1px;
    background: var(--scene-grid-color, #444);
}

.scene-firecrawl-line-top {
    top: 0;
}

.scene-firecrawl-line-bottom {
    bottom: 0;
}

.scene-firecrawl-line-left,
.scene-firecrawl-line-right {
    top: calc(-1 * var(--scene-gutter-top, 150px));
    bottom: calc(-1 * var(--scene-gutter-bottom, 150px));
    z-index: 3;
    width: 1px;
    background: var(--scene-grid-color, #444);
}

.scene-firecrawl-line-left {
    left: 0;
}

.scene-firecrawl-line-right {
    right: 0;
}

.scene-firecrawl-star {
    z-index: 4;
    width: 22px;
    height: 21px;
    background: var(--scene-grid-color, #444);
    clip-path: path(
        'M10.5 4C10.5 7.31371 7.81371 10 4.5 10H0.5V11H4.5C7.81371 11 10.5 13.6863 10.5 17V21H11.5V17C11.5 13.6863 14.1863 11 17.5 11H21.5V10H17.5C14.1863 10 11.5 7.31371 11.5 4V0H10.5V4Z'
    );
}

.scene-firecrawl-star-top-left {
    top: -10px;
    left: -10.5px;
}

.scene-firecrawl-star-top-right {
    top: -10px;
    right: -10.5px;
}

.scene-firecrawl-star-bottom-left {
    bottom: -10px;
    left: -10.5px;
}

.scene-firecrawl-star-bottom-right {
    right: -10.5px;
    bottom: -10px;
}

.scene-laravel-panel {
    inset: -16px;
    z-index: 0;
    border: 1px solid var(--scene-laravel-panel-border, rgb(255 45 32 / 18%));
    border-radius: 24px;
    background: var(
        --scene-laravel-panel-background,
        linear-gradient(135deg, rgb(255 45 32 / 7%), rgb(255 45 32 / 1%))
    );
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 4%);
    transform: rotate(-1.5deg);
}

.scene-clerk-panel {
    inset: -18px;
    z-index: 0;
    border: 1px solid var(--scene-clerk-panel-border, rgb(255 255 255 / 7%));
    border-radius: calc(var(--scene-radius, 8px) + 18px);
    background: var(
        --scene-clerk-panel-background,
        radial-gradient(circle at 50% 0, rgb(108 71 255 / 16%), transparent 54%),
        linear-gradient(180deg, rgb(255 255 255 / 7%), rgb(255 255 255 / 2%))
    );
    box-shadow:
        inset 0 1px 0 var(--scene-clerk-panel-highlight, rgb(255 255 255 / 8%)),
        0 24px 90px var(--scene-clerk-panel-shadow, rgb(0 0 0 / 26%));
}

.scene-openai-corner-top,
.scene-openai-corner-bottom {
    z-index: 0;
    width: 96px;
    height: 96px;
    border-color: var(--scene-openai-line-color, rgb(255 255 255 / 10%));
}

.scene-openai-corner-top {
    top: -34px;
    left: -34px;
    border-top: 1px solid var(--scene-openai-line-color, rgb(255 255 255 / 10%));
    border-left: 1px solid var(--scene-openai-line-color, rgb(255 255 255 / 10%));
    border-top-left-radius: 28px;
}

.scene-openai-corner-bottom {
    right: -34px;
    bottom: -34px;
    border-right: 1px solid var(--scene-openai-line-color, rgb(255 255 255 / 10%));
    border-bottom: 1px solid var(--scene-openai-line-color, rgb(255 255 255 / 10%));
    border-bottom-right-radius: 28px;
}

.scene-nuxt-glow-top,
.scene-nuxt-glow-bottom {
    z-index: 0;
    width: 220px;
    height: 160px;
    border-radius: 999px;
    filter: blur(38px);
}

.scene-nuxt-glow-top {
    top: -90px;
    left: -90px;
    background: rgb(0 220 130 / 30%);
}

.scene-nuxt-glow-bottom {
    right: -100px;
    bottom: -100px;
    background: rgb(54 228 218 / 24%);
}

.window-scene-browserbase,
.window-scene-clerk,
.window-scene-cloudflare,
.window-scene-elevenlabs,
.window-scene-firecrawl,
.window-scene-gemini,
.window-scene-laravel,
.window-scene-mintlify,
.window-scene-nuxt,
.window-scene-openai,
.window-scene-prisma,
.window-scene-resend,
.window-scene-supabase,
.window-scene-tailwind,
.window-scene-triggerdev,
.window-scene-vercel {
    overflow: visible;
}

.window-scene-supabase {
    isolation: isolate;
}

.window-scene-browserbase .exclude-from-panzoom,
.window-scene-cloudflare .exclude-from-panzoom,
.window-scene-elevenlabs .exclude-from-panzoom,
.window-scene-gemini .exclude-from-panzoom,
.window-scene-laravel .exclude-from-panzoom,
.window-scene-mintlify .exclude-from-panzoom,
.window-scene-openai .exclude-from-panzoom,
.window-scene-prisma .exclude-from-panzoom,
.window-scene-resend .exclude-from-panzoom,
.window-scene-supabase .exclude-from-panzoom,
.window-scene-tailwind .exclude-from-panzoom,
.window-scene-triggerdev .exclude-from-panzoom {
    position: relative;
    z-index: 2;
    height: var(--scene-header-height, 40px);
    padding: var(--scene-header-padding, 0 16px);
    border-top: var(--scene-header-border-top, 0);
    border-right: var(--scene-header-border-right, 0);
    border-bottom: 1px solid var(--scene-header-border, transparent);
    border-left: var(--scene-header-border-left, 0);
    border-top-left-radius: calc(var(--scene-radius, 8px) - 1px);
    border-top-right-radius: calc(var(--scene-radius, 8px) - 1px);
    background: var(--scene-header-background, transparent);
}

.window-scene-browserbase .scene-menu,
.window-scene-cloudflare .scene-menu,
.window-scene-gemini .scene-menu,
.window-scene-laravel .scene-menu,
.window-scene-mintlify .scene-menu,
.window-scene-openai .scene-menu,
.window-scene-prisma .scene-menu,
.window-scene-resend .scene-menu,
.window-scene-supabase .scene-menu,
.window-scene-tailwind .scene-menu,
.window-scene-triggerdev .scene-menu {
    left: var(--scene-header-menu-left, 16px);
}

.window-scene-browserbase input,
.window-scene-browserbase span,
.window-scene-clerk input,
.window-scene-clerk span,
.window-scene-cloudflare input,
.window-scene-cloudflare span,
.window-scene-elevenlabs input,
.window-scene-elevenlabs span,
.window-scene-firecrawl input,
.window-scene-firecrawl span,
.window-scene-gemini input,
.window-scene-gemini span,
.window-scene-laravel input,
.window-scene-laravel span,
.window-scene-mintlify input,
.window-scene-mintlify span,
.window-scene-nuxt input,
.window-scene-nuxt span,
.window-scene-openai input,
.window-scene-openai span,
.window-scene-prisma input,
.window-scene-prisma span,
.window-scene-resend input,
.window-scene-resend span,
.window-scene-stripe input,
.window-scene-stripe span,
.window-scene-supabase input,
.window-scene-supabase span,
.window-scene-tailwind input,
.window-scene-tailwind span,
.window-scene-triggerdev input,
.window-scene-triggerdev span,
.window-scene-vercel input,
.window-scene-vercel span {
    color: var(--scene-title-color, inherit);
}

.window-scene-triggerdev .exclude-from-panzoom {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.window-scene-triggerdev .scene-grid-horizontal::before,
.window-scene-triggerdev .scene-grid-horizontal::after {
    left: 50%;
    width: max(100%, 1200px);
    transform: translateX(-50%);
}

.window-scene-tailwind .scene-grid-horizontal::before {
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

.window-scene-tailwind .scene-grid-horizontal::after {
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

.window-scene-tailwind .scene-grid-vertical::before {
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

.window-scene-tailwind .scene-grid-vertical::after {
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

.window-scene-clerk .code-window-content,
.window-scene-elevenlabs .code-window-content,
.window-scene-firecrawl .code-window-content,
.window-scene-laravel .code-window-content,
.window-scene-nuxt .code-window-content,
.window-scene-openai .code-window-content,
.window-scene-supabase .code-window-content,
.window-scene-vercel .code-window-content {
    position: relative;
    z-index: 2;
}

.window-scene-supabase .code-window-content {
    overflow: hidden;
    border-bottom-right-radius: calc(var(--scene-radius, 6px) - 1px);
    border-bottom-left-radius: calc(var(--scene-radius, 6px) - 1px);
    background: var(--scene-supabase-window-background, #171717);
}

.window-scene-supabase.window-header-hidden .code-window-content {
    border-radius: calc(var(--scene-radius, 6px) - 1px);
}

.window-scene-elevenlabs::before {
    position: absolute;
    inset: 0;
    z-index: 5;
    border: 1px solid var(--scene-grid-color, #353535);
    border-radius: var(--scene-eleven-radius, 24px);
    content: '';
    pointer-events: none;
}

.window-scene-elevenlabs .exclude-from-panzoom {
    border-right: 1px solid var(--scene-grid-color, #353535);
    border-left: 1px solid var(--scene-grid-color, #353535);
}

.window-scene-elevenlabs .exclude-from-panzoom::before {
    position: absolute;
    top: 0;
    right: calc(-1 * var(--scene-gutter-right, 150px));
    left: calc(-1 * var(--scene-gutter-left, 150px));
    z-index: 3;
    height: 1px;
    background: var(--scene-grid-color, #353535);
    content: '';
    pointer-events: none;
}

.window-scene-elevenlabs .code-window-content {
    overflow: hidden;
    border-radius: var(--scene-eleven-radius, 24px);
    background: var(--scene-eleven-background, #111);
}

.scene-firecrawl-ascii {
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

.window-scene-firecrawl .code-window-content > div {
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
    sceneGutters: {
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

function rgbaColor(color) {
    if (!color) {
        return null;
    }

    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

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
    '--scene-padding': `${props.settings.padding}px`,
    '--scene-padding-x': `${Number(props.settings.lockWindowPaddingX ?? 0) / 2}px`,
    '--scene-padding-y': `${Number(props.settings.lockWindowPaddingY ?? 0) / 2}px`,
    '--window-border-width': borderWidth.value,
    '--window-border-color': borderColorRgba.value,
    '--window-backdrop-blur-sm': backdropBlur.value,
}));

const titleColorStyle = computed(() => ({
    '--scene-title-color': rgbaColor(props.settings.headerTitleColor),
}));

const windowScale = computed(() => {
    if (props.settings.scene && props.settings.scene !== 'none') {
        return 1;
    }

    return props.settings.scale;
});

const sceneSelected = computed(() => props.settings.scene && props.settings.scene !== 'none');

function sceneGutter(side) {
    if (props.sceneGutters) {
        return Math.max(0, Number(props.sceneGutters[side]) || 0);
    }

    if (side === 'left' || side === 'right') {
        return Math.max(0, Number(props.settings.lockWindowPaddingX ?? 0) / 2);
    }

    return Math.max(0, Number(props.settings.lockWindowPaddingY ?? 0) / 2);
}

const sceneGutterVars = computed(() => {
    const top = sceneGutter('top');
    const right = sceneGutter('right');
    const bottom = sceneGutter('bottom');
    const left = sceneGutter('left');

    return {
        '--scene-gutter-top': `${top}px`,
        '--scene-gutter-right': `${right}px`,
        '--scene-gutter-bottom': `${bottom}px`,
        '--scene-gutter-left': `${left}px`,
        '--scene-corner-top-left-length': `${Math.ceil(Math.hypot(top, left))}px`,
        '--scene-corner-top-right-length': `${Math.ceil(Math.hypot(top, right))}px`,
        '--scene-corner-bottom-right-length': `${Math.ceil(Math.hypot(bottom, right))}px`,
        '--scene-corner-bottom-left-length': `${Math.ceil(Math.hypot(bottom, left))}px`,
    };
});

const fauxMenuAppearance = computed(() => {
    const defaultAppearance = {
        theme: props.settings.showColorMenu ? 'color' : props.settings.themeType,
        themeBackground: props.settings.themeBackground,
    };

    if (props.settings.scene !== 'browserbase') {
        return defaultAppearance;
    }

    return {
        ...defaultAppearance,
        dots:
            props.settings.themeType === 'light'
                ? [
                      { backgroundColor: '#0a0a0a' },
                      {
                          backgroundColor: '#f4511e',
                          boxShadow: 'inset 0 0 0 2px rgb(255 250 243 / 92%)',
                      },
                      { backgroundColor: '#d6e34c' },
                  ]
                : [
                      { backgroundColor: '#fffaf3' },
                      {
                          backgroundColor: '#f4511e',
                          boxShadow: 'inset 0 0 0 2px rgb(255 250 243 / 92%)',
                      },
                      { backgroundColor: '#d6e34c' },
                  ],
    };
});

const sceneWindowStyle = computed(() => {
    const lightMode = props.settings.themeType === 'light';

    const styles = {
        browserbase: {
            backgroundColor: lightMode ? '#fffaf3' : '#101010',
            border: `2px solid ${lightMode ? '#0a0a0a' : 'rgba(255, 255, 255, 0.18)'}`,
            borderRadius: '6px',
            boxShadow: lightMode
                ? '10px 10px 0 rgb(244 81 30 / 28%)'
                : '10px 10px 0 rgb(244 81 30 / 35%)',
            '--scene-radius': '6px',
            '--scene-header-height': '38px',
            '--scene-header-padding': '0 16px',
            '--scene-header-background': lightMode ? '#f4511e' : '#f4511e',
            '--scene-header-border': lightMode ? '#0a0a0a' : 'rgba(255, 255, 255, 0.18)',
            '--scene-title-color': '#ffffff',
        },
        clerk: {
            padding: '3px',
            backgroundColor: lightMode ? '#f8f8f8' : '#111',
            border: lightMode ? '1px solid rgba(108, 71, 255, 0.14)' : 'none',
            borderRadius: '8px',
            '--scene-radius': '8px',
            '--scene-clerk-panel-background': lightMode
                ? [
                      'radial-gradient(circle at 50% 0, rgb(108 71 255 / 10%), transparent 54%)',
                      'linear-gradient(180deg, rgb(255 255 255 / 74%), rgb(255 255 255 / 26%))',
                  ].join(', ')
                : undefined,
            '--scene-clerk-panel-border': lightMode
                ? 'rgb(108 71 255 / 12%)'
                : 'rgb(255 255 255 / 7%)',
            '--scene-clerk-panel-highlight': lightMode
                ? 'rgb(255 255 255 / 80%)'
                : 'rgb(255 255 255 / 8%)',
            '--scene-clerk-panel-shadow': lightMode ? 'rgb(108 71 255 / 10%)' : 'rgb(0 0 0 / 26%)',
            '--scene-title-color': lightMode ? '#4f2ee8' : '#bab1ff',
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
            '--scene-radius': '1px',
            '--scene-grid-color': lightMode ? '#dfdfdf' : '#262626',
            '--scene-header-background': 'transparent',
            '--scene-header-border': 'transparent',
            '--scene-title-color': lightMode ? '#171717' : '#fafafa',
        },
        elevenlabs: {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--scene-eleven-background': lightMode ? '#fff' : '#111',
            '--scene-eleven-radius': '24px',
            '--scene-eleven-circle-size': elevenCircleDiameter.value
                ? `${elevenCircleDiameter.value}px`
                : undefined,
            '--scene-grid-color': lightMode ? '#e5e7eb' : '#353535',
            '--scene-dot-color': lightMode ? '#000' : '#fff',
            '--scene-header-background': lightMode ? '#fff' : '#111',
            '--scene-header-border': lightMode ? '#e5e7eb' : '#353535',
            '--scene-title-color': lightMode ? '#000' : '#fff',
        },
        firecrawl: {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--scene-grid-color': lightMode ? '#ededed' : '#444',
            '--scene-title-color': lightMode ? '#cc600b' : '#f97316',
        },
        gemini: {
            backgroundColor: lightMode ? 'rgba(255, 255, 255, 0.9)' : '#16181d',
            borderRadius: '26px',
            boxShadow: lightMode ? '0 24px 80px rgb(0 0 0 / 12%)' : '0 30px 100px rgb(0 0 0 / 45%)',
            '--scene-radius': '26px',
            '--scene-header-height': '44px',
            '--scene-header-padding': '0 18px',
            '--scene-header-background': lightMode
                ? 'rgba(255, 255, 255, 0.42)'
                : 'rgba(0, 0, 0, 0.2)',
            '--scene-title-color': lightMode ? '#545761' : '#d3d3d3',
        },
        laravel: {
            backgroundColor: lightMode ? '#fffaf9' : '#150f0f',
            border: `1px solid ${lightMode ? 'rgb(255 45 32 / 16%)' : 'rgb(255 255 255 / 8%)'}`,
            borderRadius: '12px',
            boxShadow: lightMode
                ? '0 22px 70px rgb(255 45 32 / 9%)'
                : '0 30px 90px rgb(0 0 0 / 45%), 0 0 60px rgb(255 45 32 / 7%)',
            '--scene-grid-color': lightMode ? 'rgb(255 45 32 / 18%)' : 'rgb(255 45 32 / 22%)',
            '--scene-radius': '12px',
            '--scene-header-height': '42px',
            '--scene-header-padding': '0 18px',
            '--scene-header-background': lightMode ? '#fffdfc' : '#1a1111',
            '--scene-header-border': lightMode ? 'rgb(255 45 32 / 10%)' : 'rgb(255 255 255 / 7%)',
            '--scene-laravel-panel-background': lightMode
                ? 'linear-gradient(135deg, rgb(255 45 32 / 5%), rgb(255 45 32 / 0%))'
                : 'linear-gradient(135deg, rgb(255 45 32 / 7%), rgb(255 45 32 / 1%))',
            '--scene-laravel-panel-border': lightMode
                ? 'rgb(255 45 32 / 14%)'
                : 'rgb(255 45 32 / 16%)',
            '--scene-title-color': lightMode ? '#b42318' : '#ff9b92',
        },
        mintlify: {
            backgroundColor: lightMode ? '#ffffff' : '#070a08',
            border: `1px solid ${lightMode ? 'rgb(13 147 115 / 12%)' : 'rgb(85 215 153 / 10%)'}`,
            borderRadius: '12px',
            boxShadow: lightMode
                ? '0 22px 70px rgb(13 147 115 / 10%)'
                : '0 24px 80px rgb(0 0 0 / 48%)',
            '--scene-radius': '12px',
            '--scene-header-background': lightMode ? '#ffffff' : '#010201',
            '--scene-header-border': lightMode ? 'rgb(13 147 115 / 10%)' : 'rgb(85 215 153 / 10%)',
            '--scene-title-color': lightMode ? '#0d9373' : '#d6ffeb',
        },
        nuxt: {
            backgroundColor: lightMode ? 'rgba(255, 255, 255, 0.76)' : '#0b0c11',
            borderRadius: '10px',
            '--scene-border-gradient': lightMode
                ? 'linear-gradient(140deg, #8bdfbd, #9ed7ff)'
                : 'linear-gradient(140deg, #00dc82, #36e4da)',
            '--scene-radius': '10px',
            '--scene-title-color': lightMode ? '#00815a' : '#00dc82',
        },
        openai: {
            backgroundColor: lightMode ? '#fbfbf7' : '#111111',
            border: `1px solid ${lightMode ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '18px',
            boxShadow: lightMode ? '0 24px 70px rgb(0 0 0 / 10%)' : '0 28px 90px rgb(0 0 0 / 46%)',
            '--scene-radius': '18px',
            '--scene-header-height': '42px',
            '--scene-header-background': lightMode ? 'rgba(251, 251, 247, 0.92)' : '#111',
            '--scene-header-border': lightMode
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.08)',
            '--scene-title-color': lightMode ? '#202123' : '#f5f5f0',
            '--scene-openai-line-color': lightMode ? 'rgb(0 0 0 / 10%)' : 'rgb(255 255 255 / 9%)',
        },
        prisma: {
            backgroundColor: lightMode ? 'hsl(193 72% 96% / 50%)' : 'hsl(223 41% 7% / 75%)',
            borderRadius: '10px',
            '--scene-border-gradient': lightMode
                ? 'linear-gradient(140deg, #6164cc, #31baaf)'
                : 'linear-gradient(140deg, #3e4083, #16544f)',
            '--scene-radius': '10px',
            '--scene-header-height': '40px',
            '--scene-header-background': lightMode
                ? 'hsl(192 72% 96% / 90%)'
                : 'rgba(0, 0, 0, 0.2)',
            '--scene-header-border': lightMode ? '#dfdfdf' : '#141818',
            '--scene-title-color': lightMode ? '#16a394' : '#31baaf',
        },
        resend: {
            backgroundColor: lightMode ? 'hsl(0 0% 100% / 72%)' : 'hsl(0 0% 0% / 88%)',
            border: `0.5px solid ${lightMode ? 'hsl(0 0% 24% / 13%)' : 'hsl(0 0% 24% / 35%)'}`,
            borderRadius: '8px',
            backdropFilter: 'blur(3px)',
            '--scene-header-height': '40px',
            '--scene-header-background': lightMode ? 'hsl(0 0% 100% / 10%)' : 'hsl(0 0% 0% / 90%)',
            '--scene-header-border': lightMode ? 'hsl(0 0% 24% / 13%)' : 'hsl(0 0% 24% / 35%)',
            '--scene-title-color': lightMode ? '#000' : '#fafafa',
        },
        stripe: {
            minWidth: '360px',
            backgroundColor: '#0c2e4e',
            border: '1px solid #0f395e',
            borderRadius: '8px',
            '--scene-title-color': '#ffffff',
            boxShadow: isSafari.value
                ? 'none'
                : [
                      'rgba(50, 50, 93, 0.25) 0 50px 100px -20px',
                      'rgba(0, 0, 0, 0.3) 0 30px 60px -30px',
                  ].join(', '),
        },
        supabase: {
            backgroundColor: lightMode ? '#fbfffd' : '#171717',
            border: `1px solid ${lightMode ? 'rgba(0, 0, 0, 0.12)' : '#2e2e2e'}`,
            borderRadius: '6px',
            boxShadow: lightMode ? '0 18px 60px rgb(0 0 0 / 8%)' : 'none',
            '--scene-radius': '6px',
            '--scene-header-height': '40px',
            '--scene-header-background': lightMode ? '#ffffff' : '#1f1f1f',
            '--scene-header-border': lightMode ? 'rgba(0, 0, 0, 0.1)' : '#2e2e2e',
            '--scene-title-color': lightMode ? '#171717' : '#fafafa',
            '--scene-supabase-grid-color': lightMode ? 'rgb(0 0 0 / 10%)' : 'rgb(62 207 142 / 18%)',
            '--scene-supabase-window-background': lightMode ? '#fbfffd' : '#171717',
        },
        tailwind: {
            backgroundColor: lightMode
                ? 'rgba(255, 255, 255, 0.75)'
                : 'color(display-p3 0.1176 0.1608 0.2314)',
            border: `1px solid ${lightMode ? 'rgb(15 23 42 / 10%)' : 'color(display-p3 0.8235 0.9451 1 / 0.25)'}`,
            borderRadius: '8px',
            boxShadow: lightMode ? '0 2px 4px rgb(0 0 0 / 6%)' : undefined,
            '--scene-grid-color': lightMode ? 'rgb(15 23 42 / 10%)' : 'rgb(255 255 255 / 10%)',
            '--scene-header-height': '34px',
            '--scene-header-padding': '0 12px',
            '--scene-header-border': lightMode ? 'rgb(0 0 0 / 10%)' : 'rgb(255 255 255 / 10%)',
            '--scene-title-color': lightMode ? '#555555' : '#ffffff',
        },
        triggerdev: {
            backgroundColor: lightMode ? '#f5f5f5' : '#121317',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--scene-radius': '8px',
            '--scene-grid-color': lightMode ? '#d9d7d7' : '#272a2e',
            '--scene-header-background': lightMode ? '#f8f8f8' : '#16181d',
            '--scene-header-border': lightMode ? '#e5e5e5' : 'transparent',
            '--scene-header-border-top': `1px solid ${lightMode ? '#d9d7d7' : '#272a2e'}`,
            '--scene-header-border-right': `1px solid ${lightMode ? '#d9d7d7' : '#272a2e'}`,
            '--scene-header-border-left': `1px solid ${lightMode ? '#d9d7d7' : '#272a2e'}`,
            '--scene-title-color': lightMode ? '#171717' : '#b5b8c0',
        },
        vercel: {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
            '--scene-grid-color': lightMode ? '#ebebeb' : '#1a1a1a',
            '--scene-bracket-color': lightMode ? '#a8a8a8' : '#515356',
            '--scene-title-color': lightMode ? '#000000' : '#ffffff',
        },
    };

    return {
        ...(props.settings.scene !== 'none'
            ? {
                  minWidth: '360px',
                  ...sceneGutterVars.value,
              }
            : {}),
        ...(styles[props.settings.scene] ?? {}),
    };
});

const sceneWindowDecorations = computed(() => {
    return (
        {
            clerk: ['scene-clerk-panel'],
            cloudflare: ['scene-grid-horizontal', 'scene-grid-vertical'],
            elevenlabs: [
                'scene-eleven-circle',
                'scene-eleven-grid-horizontal-top',
                'scene-eleven-grid-horizontal-center',
                'scene-eleven-grid-horizontal-bottom',
                'scene-eleven-grid-vertical-left',
                'scene-eleven-grid-vertical-center',
                'scene-eleven-grid-vertical-right',
                'scene-eleven-dot scene-eleven-dot-top-left',
                'scene-eleven-dot scene-eleven-dot-top-right',
                'scene-eleven-dot scene-eleven-dot-bottom-left',
                'scene-eleven-dot scene-eleven-dot-bottom-right',
                'scene-eleven-corner-top-left',
                'scene-eleven-corner-top-right',
                'scene-eleven-corner-bottom-right',
                'scene-eleven-corner-bottom-left',
            ],
            firecrawl: [
                'scene-firecrawl-line-top',
                'scene-firecrawl-line-bottom',
                'scene-firecrawl-line-left',
                'scene-firecrawl-line-right',
                'scene-firecrawl-star scene-firecrawl-star-top-left',
                'scene-firecrawl-star scene-firecrawl-star-top-right',
                'scene-firecrawl-star scene-firecrawl-star-bottom-left',
                'scene-firecrawl-star scene-firecrawl-star-bottom-right',
            ],
            laravel: ['scene-laravel-panel'],
            nuxt: [
                'scene-ring scene-ring-1',
                'scene-ring scene-ring-2',
                'scene-ring scene-ring-3',
                'scene-nuxt-glow-top',
                'scene-nuxt-glow-bottom',
            ],
            openai: ['scene-openai-corner-top', 'scene-openai-corner-bottom'],
            prisma: [
                'scene-ring scene-ring-1',
                'scene-ring scene-ring-2',
                'scene-ring scene-ring-3',
                'scene-ring scene-ring-4',
            ],
            tailwind: ['scene-grid-horizontal', 'scene-grid-vertical', 'scene-tailwind-gradient'],
            triggerdev: ['scene-grid-horizontal', 'scene-grid-vertical'],
            vercel: [
                'scene-grid-horizontal',
                'scene-grid-vertical',
                'scene-bracket-left',
                'scene-bracket-right',
            ],
        }[props.settings.scene] ?? []
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
