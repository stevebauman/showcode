<template>
    <ScrollArea orientation="horizontal" force-vertical-scroll class="w-full">
        <div class="grid w-max auto-cols-[8rem] grid-flow-col grid-rows-2 gap-4 px-4 py-4">
            <button
                v-for="scene in scenes"
                :key="scene.id"
                type="button"
                class="flex w-32 flex-col items-center gap-2 rounded-xl p-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                :class="
                    activeScene === scene.id
                        ? 'bg-zinc-200/80 text-zinc-950 ring-[3px] ring-violet-500 dark:bg-zinc-700/80 dark:text-zinc-50 dark:ring-violet-400'
                        : ''
                "
                @click="$emit('select', scene.id)"
            >
                <span
                    class="scene-preview relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
                    :class="[
                        `scene-preview-${scene.id}`,
                        { 'is-checker': scene.preview.background === 'checker' },
                    ]"
                    :style="previewStyle(scene)"
                >
                    <span class="scene-preview-accent"></span>
                    <span
                        class="scene-preview-window"
                        :style="{ background: scene.preview.window }"
                    >
                        <span class="scene-preview-titlebar">
                            <span class="scene-preview-dot"></span>
                            <span class="scene-preview-dot"></span>
                            <span class="scene-preview-dot"></span>
                        </span>
                        <span class="scene-preview-content">
                            <span class="scene-preview-line is-short"></span>
                            <span class="scene-preview-line"></span>
                            <span class="scene-preview-line is-medium"></span>
                            <span class="scene-preview-line is-tiny"></span>
                        </span>
                    </span>
                </span>

                <span class="max-w-full truncate">{{ scene.title }}</span>
            </button>
        </div>
    </ScrollArea>
</template>

<script setup>
defineProps({
    scenes: { type: Array, required: true },
    activeScene: { type: String, required: true },
});

defineEmits(['select']);

function previewStyle(scene) {
    if (scene.preview.background === 'checker') {
        return {
            '--scene-preview-accent': scene.preview.accent,
        };
    }

    return {
        background: scene.preview.background,
        '--scene-preview-accent': scene.preview.accent,
    };
}
</script>

<style scoped>
.scene-preview.is-checker {
    background-color: #f4f4f5;
    background-position:
        0 0,
        0 8px,
        8px -8px,
        -8px 0;
    background-size: 16px 16px;
    background-image:
        linear-gradient(45deg, rgb(161 161 170 / 35%) 25%, transparent 0),
        linear-gradient(-45deg, rgb(161 161 170 / 35%) 25%, transparent 0),
        linear-gradient(45deg, transparent 75%, rgb(161 161 170 / 35%) 0),
        linear-gradient(-45deg, transparent 75%, rgb(161 161 170 / 35%) 0);
}

.scene-preview-window {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    display: flex;
    width: 74%;
    height: 48%;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 16%);
    border-radius: 5px;
    box-shadow: 0 12px 22px rgb(0 0 0 / 24%);
    transform: translate(-50%, -50%);
}

.scene-preview-titlebar {
    display: flex;
    height: 10px;
    flex: none;
    align-items: center;
    gap: 3px;
    padding: 0 5px;
    background: rgb(0 0 0 / 18%);
}

.scene-preview-dot {
    width: 3px;
    height: 3px;
    border-radius: 999px;
    background: rgb(255 255 255 / 35%);
}

.scene-preview-content {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    padding: 5px 7px;
}

.scene-preview-line {
    display: block;
    width: 72%;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--scene-preview-accent), rgb(255 255 255 / 54%));
    opacity: 0.9;
}

.scene-preview-line.is-short {
    width: 48%;
}

.scene-preview-line.is-medium {
    width: 60%;
}

.scene-preview-line.is-tiny {
    width: 32%;
}

.scene-preview-accent {
    position: absolute;
    z-index: 1;
    background: var(--scene-preview-accent);
}

.scene-preview-browserbase::before {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(circle at 1px 1px, rgb(10 10 10 / 18%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 3px 4px, rgb(244 81 30 / 16%) 0 1px, transparent 1.5px),
        linear-gradient(90deg, rgb(0 0 0 / 11%) 1px, transparent 1px),
        linear-gradient(rgb(0 0 0 / 11%) 1px, transparent 1px);
    background-size:
        5px 5px,
        8px 8px,
        28px 24px,
        28px 24px;
    content: '';
    opacity: 0.82;
}

.scene-preview-browserbase::after {
    position: absolute;
    right: -5px;
    bottom: -2px;
    left: -5px;
    height: 28px;
    background:
        radial-gradient(circle at 1px 1px, #f4511e 0 1.2px, transparent 1.6px),
        radial-gradient(circle at 4px 3px, #d8e94d 0 1.2px, transparent 1.6px),
        radial-gradient(circle at 3px 5px, #050505 0 1.2px, transparent 1.6px),
        radial-gradient(circle at 5px 6px, #ffffff 0 1px, transparent 1.3px);
    background-size:
        7px 7px,
        9px 9px,
        6px 6px,
        10px 10px;
    clip-path: polygon(
        0% 72%,
        9% 50%,
        18% 68%,
        30% 22%,
        43% 62%,
        55% 43%,
        66% 70%,
        78% 24%,
        100% 54%,
        100% 100%,
        0% 100%
    );
    content: '';
    image-rendering: pixelated;
}

.scene-preview-browserbase .scene-preview-window {
    width: 70%;
    height: 46%;
    border: 2px solid #0a0a0a;
    border-radius: 4px;
    background: #fffaf3;
    box-shadow: 5px 5px 0 rgb(244 81 30 / 30%);
}

.scene-preview-browserbase .scene-preview-titlebar {
    background: #f4511e;
}

.scene-preview-browserbase .scene-preview-dot {
    background: rgb(255 255 255 / 82%);
}

.scene-preview-browserbase .scene-preview-line {
    background: linear-gradient(90deg, #0a0a0a, #f4511e);
}

.scene-preview-resend::before {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(rgb(0 0 0 / 18%), rgb(0 0 0 / 18%)),
        url('/scenes/resend-backround.jpg') center / cover no-repeat;
    content: '';
}

.scene-preview-clerk::before {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(58px 44px at 18% 16%, rgb(108 71 255 / 46%), transparent),
        radial-gradient(52px 40px at 82% 14%, rgb(186 177 255 / 24%), transparent),
        radial-gradient(64px 46px at 52% 96%, rgb(108 71 255 / 24%), transparent),
        linear-gradient(90deg, rgb(255 255 255 / 7%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 7%) 1px, transparent 1px),
        radial-gradient(circle at 9px 9px, rgb(186 177 255 / 16%) 1px, transparent 1.5px);
    background-size:
        auto,
        auto,
        auto,
        22px 22px,
        22px 22px,
        18px 18px;
    content: '';
    opacity: 0.9;
    -webkit-mask-image: radial-gradient(circle at 50% 45%, black, transparent 78%);
    mask-image: radial-gradient(circle at 50% 45%, black, transparent 78%);
}

.scene-preview-clerk::after {
    position: absolute;
    inset: 13% 9%;
    border: 1px solid rgb(255 255 255 / 14%);
    border-radius: 13px;
    background:
        radial-gradient(circle at 50% 0, rgb(108 71 255 / 18%), transparent 58%),
        linear-gradient(180deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 3%));
    box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 10%),
        0 10px 24px rgb(0 0 0 / 20%);
    content: '';
}

.scene-preview-clerk .scene-preview-window {
    width: 70%;
    height: 46%;
    border-color: rgb(108 71 255 / 16%);
    border-radius: 5px;
    background: #111;
    box-shadow: 0 10px 22px rgb(0 0 0 / 30%);
}

.scene-preview-clerk .scene-preview-titlebar {
    background: rgb(255 255 255 / 5%);
}

.scene-preview-clerk .scene-preview-accent {
    right: 12px;
    bottom: 9px;
    width: 30px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--scene-preview-accent), transparent);
    opacity: 0.75;
}

.scene-preview-stripe::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 40%;
    background: #f6f9fc;
    content: '';
    transform: skewY(-6deg);
    transform-origin: right top;
}

.scene-preview-stripe .scene-preview-accent {
    right: -14px;
    bottom: 15px;
    width: 48px;
    height: 8px;
    transform: skewY(-6deg);
}

.scene-preview-tailwind .scene-preview-accent,
.scene-preview-gemini .scene-preview-accent,
.scene-preview-nuxt .scene-preview-accent,
.scene-preview-laravel .scene-preview-accent {
    top: -16px;
    left: 16px;
    width: 64px;
    height: 56px;
    border-radius: 999px;
    filter: blur(14px);
    opacity: 0.7;
}

.scene-preview-mintlify::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(85 215 153 / 8%) 1px, transparent 1px),
        linear-gradient(rgb(85 215 153 / 8%) 1px, transparent 1px);
    background-size: 24px 24px;
    content: '';
    opacity: 0.58;
    -webkit-mask-image: radial-gradient(circle at 50% 45%, black, transparent 76%);
    mask-image: radial-gradient(circle at 50% 45%, black, transparent 76%);
}

.scene-preview-mintlify::after {
    position: absolute;
    right: 12px;
    bottom: 13px;
    width: 54px;
    height: 28px;
    background:
        linear-gradient(90deg, transparent, rgb(85 215 153 / 24%), transparent) 0 0 / 100% 1px
            no-repeat,
        linear-gradient(90deg, transparent, rgb(85 215 153 / 16%), transparent) 0 9px / 100% 1px
            no-repeat,
        linear-gradient(90deg, transparent, rgb(85 215 153 / 10%), transparent) 0 18px / 100% 1px
            no-repeat;
    content: '';
    opacity: 0.74;
}

.scene-preview-mintlify .scene-preview-window {
    width: 68%;
    height: 46%;
    border-color: rgb(85 215 153 / 14%);
    border-radius: 7px;
    background: #070a08;
}

.scene-preview-mintlify .scene-preview-titlebar {
    background: #010201;
}

.scene-preview-mintlify .scene-preview-accent {
    top: 12px;
    right: 14px;
    width: 34px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--scene-preview-accent));
    opacity: 0.85;
}

.scene-preview-tailwind::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 8%) 1px, transparent 1px);
    background-size: 24px 24px;
    content: '';
    opacity: 0.5;
}

.scene-preview-tailwind::after {
    position: absolute;
    right: 8px;
    bottom: 9px;
    left: 8px;
    height: 6px;
    background: linear-gradient(90deg, transparent, #38bdf8, #ec4899, transparent);
    content: '';
    filter: blur(3px);
    opacity: 0.8;
}

.scene-preview-gemini::before {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(circle at 22% 24%, rgb(255 255 255 / 75%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 78% 30%, rgb(128 178 255 / 70%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 45% 72%, rgb(255 255 255 / 50%) 0 1px, transparent 1.5px);
    background-size:
        36px 36px,
        46px 46px,
        58px 58px;
    content: '';
    opacity: 0.75;
}

.scene-preview-openai::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 8%) 1px, transparent 1px);
    background-size: 22px 22px;
    content: '';
    opacity: 0.55;
    -webkit-mask-image: radial-gradient(circle at 50% 45%, black, transparent 78%);
    mask-image: radial-gradient(circle at 50% 45%, black, transparent 78%);
}

.scene-preview-openai .scene-preview-accent {
    right: 10px;
    bottom: 10px;
    width: 32px;
    height: 32px;
    border: 1px solid var(--scene-preview-accent);
    border-top: 0;
    border-left: 0;
    border-radius: 0 0 10px 0;
    background: transparent;
    opacity: 0.42;
}

.scene-preview-laravel::before {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(46px 34px at 15% 12%, rgb(255 45 32 / 30%), transparent),
        radial-gradient(56px 38px at 78% 84%, rgb(255 116 97 / 16%), transparent),
        linear-gradient(90deg, rgb(255 45 32 / 11%) 1px, transparent 1px),
        linear-gradient(rgb(255 45 32 / 8%) 1px, transparent 1px);
    background-size:
        auto,
        auto,
        22px 22px,
        22px 22px;
    content: '';
    -webkit-mask-image: radial-gradient(circle at 50% 45%, black 0 24%, transparent 74%);
    mask-image: radial-gradient(circle at 50% 45%, black 0 24%, transparent 74%);
}

.scene-preview-laravel::after {
    position: absolute;
    inset: 13px 9px 14px;
    border: 1px solid rgb(255 45 32 / 18%);
    border-radius: 12px;
    background: linear-gradient(135deg, rgb(255 45 32 / 7%), rgb(255 45 32 / 1%));
    content: '';
    transform: rotate(-1.5deg);
}

.scene-preview-laravel .scene-preview-window {
    border-color: rgb(255 255 255 / 10%);
    border-radius: 6px;
    background: #150f0f;
}

.scene-preview-laravel .scene-preview-titlebar {
    background: #1a1111;
}

.scene-preview-laravel .scene-preview-accent {
    top: 12px;
    left: 18px;
    width: 34px;
    height: 1px;
    border-radius: 0;
    background: var(--scene-preview-accent);
    box-shadow: 0 8px 0 rgb(255 45 32 / 38%);
    filter: none;
    opacity: 0.7;
}

.scene-preview-laravel .scene-preview-line {
    background: linear-gradient(90deg, #ff2d20, rgb(255 255 255 / 50%));
}

.scene-preview-prisma .scene-preview-accent {
    inset: 10px;
    border: 1px solid var(--scene-preview-accent);
    border-radius: 7px;
    background: transparent;
    opacity: 0.7;
}

.scene-preview-firecrawl .scene-preview-accent {
    right: 0;
    bottom: 0;
    left: 0;
    height: 16px;
    background:
        linear-gradient(to bottom, transparent, rgb(249 115 22 / 65%)),
        repeating-linear-gradient(0deg, transparent 0 3px, rgb(249 115 22 / 45%) 3px 4px);
}

.scene-preview-supabase::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(62 207 142 / 12%) 1px, transparent 1px),
        linear-gradient(rgb(62 207 142 / 12%) 1px, transparent 1px);
    background-size: 24px 15px;
    content: '';
    opacity: 0.65;
    -webkit-mask-image: radial-gradient(circle at 50% 45%, black, transparent 76%);
    mask-image: radial-gradient(circle at 50% 45%, black, transparent 76%);
}

.scene-preview-cloudflare::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 8%) 1px, transparent 1px);
    background-size: 26px 26px;
    content: '';
}

.scene-preview-triggerdev::before {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        135deg,
        rgb(255 255 255 / 9%) 0 1px,
        transparent 1px 8px
    );
    content: '';
    -webkit-mask-image: linear-gradient(135deg, transparent 12%, black 52%, transparent 92%);
    mask-image: linear-gradient(135deg, transparent 12%, black 52%, transparent 92%);
}

.scene-preview-vercel::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 8%) 1px, transparent 1px);
    background-size: 28px 28px;
    content: '';
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black, transparent 74%);
    mask-image: radial-gradient(circle at 50% 50%, black, transparent 74%);
}

.scene-preview-elevenlabs::before {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(
            90deg,
            transparent 0 calc(50% - 1px),
            rgb(255 255 255 / 16%) calc(50% - 1px) calc(50% + 1px),
            transparent calc(50% + 1px)
        ),
        linear-gradient(
            transparent 0 calc(50% - 1px),
            rgb(255 255 255 / 16%) calc(50% - 1px) calc(50% + 1px),
            transparent calc(50% + 1px)
        );
    content: '';
}

.scene-preview-elevenlabs::after {
    position: absolute;
    inset: 6px;
    border: 1px solid rgb(255 255 255 / 16%);
    border-radius: 999px;
    content: '';
}

.scene-preview-cloudflare .scene-preview-accent {
    inset: 8px;
    border: 1px solid rgb(255 255 255 / 10%);
    background: transparent;
    opacity: 0.45;
    border-radius: 0;
}

.scene-preview-vercel .scene-preview-accent {
    top: 18px;
    left: 18px;
    width: 18px;
    height: 18px;
    border-top: 1px solid var(--scene-preview-accent);
    border-left: 1px solid var(--scene-preview-accent);
    background: transparent;
    opacity: 0.55;
}

.scene-preview-vercel::after {
    position: absolute;
    right: 18px;
    bottom: 18px;
    width: 18px;
    height: 18px;
    border-right: 1px solid var(--scene-preview-accent);
    border-bottom: 1px solid var(--scene-preview-accent);
    content: '';
    opacity: 0.55;
}

.scene-preview-elevenlabs .scene-preview-accent {
    inset: 8px;
    border: 1px solid var(--scene-preview-accent);
    border-radius: 999px;
    background: transparent;
    opacity: 0.35;
}

.scene-preview-triggerdev .scene-preview-accent {
    inset: 9px;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 0;
    background: transparent;
    opacity: 1;
}

.scene-preview-supabase .scene-preview-accent {
    top: 11px;
    left: 11px;
    width: 28px;
    height: 1px;
    background: var(--scene-preview-accent);
    box-shadow:
        0 8px 0 rgb(62 207 142 / 55%),
        0 16px 0 rgb(62 207 142 / 35%);
    opacity: 0.9;
}
</style>
