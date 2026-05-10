<template>
    <div
        class="showcode-frame-background"
        :class="[`showcode-frame-${frame}`, { 'theme-light': themeType === 'light' }]"
        :style="containerStyle"
        aria-hidden="true"
    >
        <template v-if="frame === 'stripe'">
            <div class="stripe-background">
                <div class="stripe-gridline-container">
                    <div
                        v-for="line in 5"
                        :key="`stripe-background-${line}`"
                        class="stripe-gridline"
                    ></div>
                </div>
            </div>

            <div class="stripe-band">
                <div class="stripe-gridline-container">
                    <div
                        v-for="line in 5"
                        :key="`stripe-band-${line}`"
                        class="stripe-gridline"
                    ></div>

                    <div class="stripe-set" :class="{ 'is-small': frameHeight < 240 }">
                        <div class="stripe-layer-1"></div>
                        <div class="stripe-layer-2"></div>
                        <div class="stripe-intersection"></div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="frame === 'browserbase'">
            <span
                v-for="position in browserbaseGridlines"
                :key="position"
                class="browserbase-gridline"
                :style="{ left: position }"
            ></span>
        </template>

        <template v-if="frame === 'tailwind'">
            <span class="tailwind-beams"></span>
        </template>

        <template v-if="frame === 'laravel'">
            <span class="laravel-glow laravel-glow-top"></span>
            <span class="laravel-glow laravel-glow-bottom"></span>
            <span class="laravel-grid"></span>
        </template>

        <template v-if="frame === 'triggerdev'">
            <span class="trigger-pattern trigger-pattern-top"></span>
            <span class="trigger-pattern trigger-pattern-bottom"></span>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    frame: { type: String, required: true },
    themeType: { type: String, default: 'dark' },
    windowWidth: { type: Number, default: 0 },
    frameHeight: { type: Number, required: true },
});

const browserbaseGridlines = ['5%', '20%', '35%', '50%', '65%', '80%', '95%'];

const containerStyle = computed(() => ({
    '--window-width': `${Math.max(props.windowWidth, 1)}px`,
}));
</script>

<style scoped>
.showcode-frame-background {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
}

.showcode-frame-browserbase {
    background: #080808;
}

.showcode-frame-browserbase.theme-light {
    background: hsl(21.572deg 35.722% 96.76%);
}

.browserbase-gridline {
    position: absolute;
    top: 0;
    height: 100%;
    border-left: 2px dashed rgb(255 255 255 / 10%);
}

.theme-light .browserbase-gridline {
    border-color: rgb(0 0 0 / 30%);
}

.showcode-frame-clerk {
    background:
        radial-gradient(circle at 16px 16px, rgb(255 255 255 / 7%) 1.5px, transparent 2px),
        linear-gradient(
            135deg,
            rgb(255 255 255 / 4%) 25%,
            transparent 25% 75%,
            rgb(255 255 255 / 4%) 75%
        ),
        #222;
    background-size:
        32px 32px,
        56px 56px,
        auto;
}

.showcode-frame-clerk.theme-light {
    background:
        radial-gradient(circle at 16px 16px, rgb(0 0 0 / 6%) 1.5px, transparent 2px),
        linear-gradient(135deg, rgb(0 0 0 / 3%) 25%, transparent 25% 75%, rgb(0 0 0 / 3%) 75%),
        #f9f9f9;
}

.showcode-frame-cloudflare {
    background: #0c0c0c;
}

.showcode-frame-cloudflare.theme-light {
    background: #f5f5f5;
}

.showcode-frame-elevenlabs {
    background: #111;
}

.showcode-frame-elevenlabs.theme-light {
    background: #fff;
}

.showcode-frame-firecrawl {
    background: #000;
}

.showcode-frame-firecrawl.theme-light {
    background: #fff;
}

.showcode-frame-gemini {
    background:
        radial-gradient(circle at 17% 24%, rgb(255 255 255 / 65%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 80% 30%, rgb(128 178 255 / 60%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 45% 78%, rgb(255 255 255 / 45%) 0 1px, transparent 1.5px), #0e1016;
    background-size:
        140px 140px,
        190px 190px,
        230px 230px,
        auto;
}

.showcode-frame-gemini.theme-light {
    background:
        radial-gradient(circle at 18% 22%, rgb(24 103 210 / 16%), transparent 26%),
        radial-gradient(circle at 76% 28%, rgb(147 112 219 / 14%), transparent 24%),
        radial-gradient(circle at 62% 78%, rgb(236 72 153 / 8%), transparent 28%),
        radial-gradient(circle at 17% 24%, rgb(24 103 210 / 20%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 80% 30%, rgb(92 158 199 / 18%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 42% 72%, rgb(147 112 219 / 14%) 0 1px, transparent 1.5px),
        linear-gradient(135deg, #fbfdff 0%, #eef6ff 100%);
    background-size:
        auto,
        auto,
        auto,
        140px 140px,
        190px 190px,
        230px 230px,
        auto;
}

.showcode-frame-mintlify {
    background:
        radial-gradient(circle at 82% 16%, rgb(85 215 153 / 14%), transparent 34%),
        radial-gradient(circle at 75% 4%, rgb(255 255 255 / 8%) 1px, transparent 1.5px), #121212;
    background-size:
        auto,
        18px 18px,
        auto;
}

.showcode-frame-mintlify.theme-light {
    background:
        radial-gradient(circle at 82% 16%, rgb(13 147 115 / 12%), transparent 34%),
        radial-gradient(circle at 75% 4%, rgb(13 147 115 / 10%) 1px, transparent 1.5px), #f6fbf9;
    background-size:
        auto,
        18px 18px,
        auto;
}

.showcode-frame-nuxt {
    background:
        radial-gradient(circle at 22% 18%, rgb(0 220 130 / 22%), transparent 26%),
        radial-gradient(circle at 76% 82%, rgb(54 228 218 / 16%), transparent 28%),
        radial-gradient(circle at 40% 32%, rgb(255 255 255 / 22%) 0 1px, transparent 1.5px), #0b0c11;
    background-size:
        auto,
        auto,
        96px 96px,
        auto;
}

.showcode-frame-nuxt.theme-light {
    background:
        radial-gradient(circle at 25% 18%, rgb(0 220 130 / 14%), transparent 30%),
        linear-gradient(135deg, #f8faf9, #f0f9f4);
}

.showcode-frame-laravel {
    background:
        radial-gradient(circle at 16% 18%, rgb(255 45 32 / 28%), transparent 30%),
        radial-gradient(circle at 76% 80%, rgb(255 116 97 / 18%), transparent 28%),
        linear-gradient(135deg, #1a0d0d 0%, #090606 100%);
}

.showcode-frame-laravel.theme-light {
    background:
        radial-gradient(circle at 14% 18%, rgb(255 45 32 / 16%), transparent 28%),
        radial-gradient(circle at 82% 76%, rgb(255 45 32 / 10%), transparent 28%),
        linear-gradient(135deg, #fff8f7 0%, #fff 100%);
}

.laravel-glow {
    position: absolute;
    border-radius: 999px;
    background: #ff2d20;
    filter: blur(58px);
}

.laravel-glow-top {
    top: -96px;
    left: 12%;
    width: 280px;
    height: 220px;
    opacity: 0.28;
}

.laravel-glow-bottom {
    right: 8%;
    bottom: -120px;
    width: 360px;
    height: 260px;
    opacity: 0.18;
}

.theme-light .laravel-glow-top {
    opacity: 0.18;
}

.theme-light .laravel-glow-bottom {
    opacity: 0.12;
}

.laravel-grid {
    position: absolute;
    inset: 0;
    opacity: 0.35;
    background-image:
        linear-gradient(90deg, rgb(255 255 255 / 6%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 6%) 1px, transparent 1px);
    background-size: 44px 44px;
    -webkit-mask-image: radial-gradient(circle at 50% 45%, black 0 28%, transparent 72%);
    mask-image: radial-gradient(circle at 50% 45%, black 0 28%, transparent 72%);
}

.theme-light .laravel-grid {
    opacity: 0.55;
    background-image:
        linear-gradient(90deg, rgb(255 45 32 / 9%) 1px, transparent 1px),
        linear-gradient(rgb(255 45 32 / 9%) 1px, transparent 1px);
}

.showcode-frame-openai {
    background:
        radial-gradient(circle at 20% 12%, rgb(125 137 166 / 18%), transparent 32%),
        linear-gradient(135deg, #121a29, #182033);
}

.showcode-frame-openai.theme-light {
    background: linear-gradient(135deg, #f1f0f4, #f8f8fd);
}

.showcode-frame-prisma {
    background: linear-gradient(140deg, #0c1d26 0%, #0a0c17 100%);
}

.showcode-frame-prisma.theme-light {
    background: linear-gradient(140deg, #e8e8ff 0%, #e7fefc 100%);
}

.showcode-frame-resend {
    background:
        linear-gradient(rgb(0 0 0 / 12%), rgb(0 0 0 / 12%)),
        url('/frames/resend-backround.jpg') center / cover no-repeat,
        #050505;
}

.showcode-frame-resend.theme-light {
    background:
        linear-gradient(rgb(255 255 255 / 16%), rgb(255 255 255 / 16%)),
        url('/frames/resend-backround.jpg') center / cover no-repeat,
        #f7f7f7;
}

.showcode-frame-stripe {
    background: #0a2540;
}

.stripe-background {
    position: absolute;
    inset: 0;
}

.stripe-gridline-container {
    position: relative;
    width: var(--window-width);
    height: 100%;
    margin: 0 auto;
}

.stripe-gridline {
    position: absolute;
    z-index: 1;
    width: 1px;
    height: 100%;
    border-left: 1px dashed rgb(255 255 255 / 10%);
    pointer-events: none;
}

.stripe-gridline:nth-child(1) {
    left: 0;
    border-style: solid;
}

.stripe-gridline:nth-child(2) {
    left: 25%;
}

.stripe-gridline:nth-child(3) {
    left: 50%;
}

.stripe-gridline:nth-child(4) {
    left: 75%;
}

.stripe-gridline:nth-child(5) {
    left: calc(100% - 1px);
    border-style: solid;
}

.stripe-band {
    position: absolute;
    z-index: 0;
    top: 60%;
    left: 0;
    width: 100%;
    height: 40%;
    background: hsl(213.69deg 52% 97.828%);
    transform: skewY(-6deg);
    transform-origin: 100% 0;
}

.stripe-band .stripe-gridline {
    border-color: rgb(66 71 112 / 15%);
}

.stripe-set {
    position: absolute;
    z-index: 1;
    bottom: 65px;
    left: calc(var(--window-width) * 0.75 - 50px);
    width: 500px;
    height: 50px;
    transform-origin: 100% 0;
}

.stripe-set.is-small {
    top: -49px;
    bottom: auto;
}

.stripe-layer-1,
.stripe-layer-2,
.stripe-intersection {
    position: absolute;
    width: 100%;
}

.stripe-layer-1 {
    height: 100%;
    background: rgb(17 239 227);
}

.stripe-layer-2 {
    height: 32px;
    background: rgb(153 102 255);
    transform: translate(50px, 50px);
}

.stripe-intersection {
    height: 18px;
    background: hsl(221.1deg 99.822% 44.876%);
    transform: translate(50px, 32px);
}

.showcode-frame-supabase {
    background: #121212;
}

.showcode-frame-supabase.theme-light {
    background: #fcfcfc;
}

.showcode-frame-tailwind {
    background: #0f172a;
}

.showcode-frame-tailwind.theme-light {
    background: #fff;
}

.tailwind-beams {
    position: absolute;
    top: -210px;
    left: 50%;
    width: 1120px;
    height: 500px;
    background:
        conic-gradient(
            from 225deg at 50% 0%,
            transparent 0 22deg,
            rgb(56 189 248 / 35%) 22deg 24deg,
            transparent 24deg 42deg,
            rgb(236 72 153 / 28%) 42deg 44deg,
            transparent 44deg
        ),
        radial-gradient(ellipse at 50% 0%, rgb(56 189 248 / 20%), transparent 42%);
    transform: translateX(calc(-50% - 180px));
}

.theme-light .tailwind-beams {
    top: -120px;
    width: 980px;
    height: 620px;
    background:
        radial-gradient(circle at 28% 24%, rgb(14 165 233 / 22%), transparent 28%),
        radial-gradient(circle at 62% 34%, rgb(236 72 153 / 16%), transparent 26%),
        radial-gradient(circle at 48% 72%, rgb(168 85 247 / 14%), transparent 30%),
        radial-gradient(ellipse at 50% 48%, rgb(56 189 248 / 12%), transparent 62%);
    opacity: 1;
    filter: blur(18px);
    transform: translateX(-50%);
}

.showcode-frame-triggerdev {
    background: #121317;
}

.showcode-frame-triggerdev.theme-light {
    background: #fafafa;
}

.trigger-pattern {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        135deg,
        rgb(255 255 255 / 5%) 0 1px,
        transparent 1px 8px
    );
    pointer-events: none;
    -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        rgb(0 0 0 / 45%) 24%,
        rgb(0 0 0 / 45%) 76%,
        transparent 100%
    );
    mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        rgb(0 0 0 / 45%) 24%,
        rgb(0 0 0 / 45%) 76%,
        transparent 100%
    );
}

.theme-light .trigger-pattern {
    opacity: 0.1;
    background-image: repeating-linear-gradient(
        135deg,
        rgb(0 0 0 / 45%) 0 1px,
        transparent 1px 8px
    );
}

.trigger-pattern-top {
    top: 0;
    background-position: right top;
}

.trigger-pattern-bottom {
    bottom: 0;
    background-position: right bottom;
}

.showcode-frame-vercel {
    background: #000;
}

.showcode-frame-vercel.theme-light {
    background: #fff;
}
</style>
