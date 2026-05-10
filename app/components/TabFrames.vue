<template>
    <ScrollArea orientation="horizontal" force-vertical-scroll class="w-full">
        <div class="grid w-max auto-cols-[8rem] grid-flow-col grid-rows-2 gap-4 px-4 py-4">
            <button
                v-for="frame in frames"
                :key="frame.id"
                type="button"
                class="flex w-32 flex-col items-center gap-2 rounded-xl p-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                :class="
                    activeFrame === frame.id
                        ? 'bg-zinc-200/80 text-zinc-950 ring-[3px] ring-violet-500 dark:bg-zinc-700/80 dark:text-zinc-50 dark:ring-violet-400'
                        : ''
                "
                @click="$emit('select', frame.id)"
            >
                <span
                    class="frame-preview relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
                    :class="[
                        `frame-preview-${frame.id}`,
                        { 'is-checker': frame.preview.background === 'checker' },
                    ]"
                    :style="previewStyle(frame)"
                >
                    <span class="frame-preview-accent"></span>
                    <span
                        class="frame-preview-window"
                        :style="{ background: frame.preview.window }"
                    >
                        <span class="frame-preview-titlebar">
                            <span class="frame-preview-dot"></span>
                            <span class="frame-preview-dot"></span>
                            <span class="frame-preview-dot"></span>
                        </span>
                        <span class="frame-preview-content">
                            <span class="frame-preview-line is-short"></span>
                            <span class="frame-preview-line"></span>
                            <span class="frame-preview-line is-medium"></span>
                            <span class="frame-preview-line is-tiny"></span>
                        </span>
                    </span>
                </span>

                <span class="max-w-full truncate">{{ frame.title }}</span>
            </button>
        </div>
    </ScrollArea>
</template>

<script setup>
defineProps({
    frames: { type: Array, required: true },
    activeFrame: { type: String, required: true },
});

defineEmits(['select']);

function previewStyle(frame) {
    if (frame.preview.background === 'checker') {
        return {
            '--frame-preview-accent': frame.preview.accent,
        };
    }

    return {
        background: frame.preview.background,
        '--frame-preview-accent': frame.preview.accent,
    };
}
</script>

<style scoped>
.frame-preview.is-checker {
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

.frame-preview-window {
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

.frame-preview-titlebar {
    display: flex;
    height: 10px;
    flex: none;
    align-items: center;
    gap: 3px;
    padding: 0 5px;
    background: rgb(0 0 0 / 18%);
}

.frame-preview-dot {
    width: 3px;
    height: 3px;
    border-radius: 999px;
    background: rgb(255 255 255 / 35%);
}

.frame-preview-content {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    padding: 5px 7px;
}

.frame-preview-line {
    display: block;
    width: 72%;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--frame-preview-accent), rgb(255 255 255 / 54%));
    opacity: 0.9;
}

.frame-preview-line.is-short {
    width: 48%;
}

.frame-preview-line.is-medium {
    width: 60%;
}

.frame-preview-line.is-tiny {
    width: 32%;
}

.frame-preview-accent {
    position: absolute;
    z-index: 1;
    background: var(--frame-preview-accent);
}

.frame-preview-browserbase::before {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        90deg,
        transparent 0 14%,
        rgb(255 255 255 / 12%) 14% calc(14% + 1px),
        transparent calc(14% + 1px) 28%
    );
    content: '';
}

.frame-preview-resend::before {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(rgb(0 0 0 / 18%), rgb(0 0 0 / 18%)),
        url('/frames/resend-backround.jpg') center / cover no-repeat;
    content: '';
}

.frame-preview-clerk::before {
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

.frame-preview-clerk::after {
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

.frame-preview-clerk .frame-preview-window {
    width: 70%;
    height: 46%;
    border-color: rgb(108 71 255 / 16%);
    border-radius: 5px;
    background: #111;
    box-shadow: 0 10px 22px rgb(0 0 0 / 30%);
}

.frame-preview-clerk .frame-preview-titlebar {
    background: rgb(255 255 255 / 5%);
}

.frame-preview-clerk .frame-preview-accent {
    right: 12px;
    bottom: 9px;
    width: 30px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--frame-preview-accent), transparent);
    opacity: 0.75;
}

.frame-preview-stripe::before {
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

.frame-preview-stripe .frame-preview-accent {
    right: -14px;
    bottom: 15px;
    width: 48px;
    height: 8px;
    transform: skewY(-6deg);
}

.frame-preview-tailwind .frame-preview-accent,
.frame-preview-gemini .frame-preview-accent,
.frame-preview-nuxt .frame-preview-accent,
.frame-preview-laravel .frame-preview-accent,
.frame-preview-mintlify .frame-preview-accent {
    top: -16px;
    left: 16px;
    width: 64px;
    height: 56px;
    border-radius: 999px;
    filter: blur(14px);
    opacity: 0.7;
}

.frame-preview-tailwind::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 8%) 1px, transparent 1px);
    background-size: 24px 24px;
    content: '';
    opacity: 0.5;
}

.frame-preview-tailwind::after {
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

.frame-preview-gemini::before {
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

.frame-preview-openai::before {
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

.frame-preview-openai::after {
    position: absolute;
    top: -30px;
    right: -20px;
    width: 82px;
    height: 82px;
    border: 1px solid rgb(255 255 255 / 16%);
    border-radius: 999px;
    content: '';
}

.frame-preview-openai .frame-preview-accent {
    right: 10px;
    bottom: 10px;
    width: 32px;
    height: 32px;
    border: 1px solid var(--frame-preview-accent);
    border-top: 0;
    border-left: 0;
    border-radius: 0 0 10px 0;
    background: transparent;
    opacity: 0.42;
}

.frame-preview-laravel::before {
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

.frame-preview-laravel::after {
    position: absolute;
    inset: 13px 9px 14px;
    border: 1px solid rgb(255 45 32 / 18%);
    border-radius: 12px;
    background: linear-gradient(135deg, rgb(255 45 32 / 7%), rgb(255 45 32 / 1%));
    content: '';
    transform: rotate(-1.5deg);
}

.frame-preview-laravel .frame-preview-window {
    border-color: rgb(255 255 255 / 10%);
    border-radius: 6px;
    background: #150f0f;
}

.frame-preview-laravel .frame-preview-titlebar {
    background: #1a1111;
}

.frame-preview-laravel .frame-preview-accent {
    top: 12px;
    left: 18px;
    width: 34px;
    height: 1px;
    border-radius: 0;
    background: var(--frame-preview-accent);
    box-shadow: 0 8px 0 rgb(255 45 32 / 38%);
    filter: none;
    opacity: 0.7;
}

.frame-preview-laravel .frame-preview-line {
    background: linear-gradient(90deg, #ff2d20, rgb(255 255 255 / 50%));
}

.frame-preview-prisma .frame-preview-accent {
    inset: 10px;
    border: 1px solid var(--frame-preview-accent);
    border-radius: 7px;
    background: transparent;
    opacity: 0.7;
}

.frame-preview-firecrawl .frame-preview-accent {
    right: 0;
    bottom: 0;
    left: 0;
    height: 16px;
    background:
        linear-gradient(to bottom, transparent, rgb(249 115 22 / 65%)),
        repeating-linear-gradient(0deg, transparent 0 3px, rgb(249 115 22 / 45%) 3px 4px);
}

.frame-preview-supabase::before {
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

.frame-preview-supabase::after {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 40px;
    height: 40px;
    border: 1px solid rgb(62 207 142 / 22%);
    border-radius: 999px;
    box-shadow:
        -22px 30px 0 -15px rgb(62 207 142 / 8%),
        -22px 30px 0 -14px rgb(62 207 142 / 20%),
        -8px 8px 0 -6px rgb(62 207 142 / 30%);
    content: '';
}

.frame-preview-cloudflare::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px),
        linear-gradient(rgb(255 255 255 / 8%) 1px, transparent 1px);
    background-size: 26px 26px;
    content: '';
}

.frame-preview-triggerdev::before {
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

.frame-preview-vercel::before {
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

.frame-preview-elevenlabs::before {
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

.frame-preview-elevenlabs::after {
    position: absolute;
    inset: 6px;
    border: 1px solid rgb(255 255 255 / 16%);
    border-radius: 999px;
    content: '';
}

.frame-preview-cloudflare .frame-preview-accent {
    inset: 8px;
    border: 1px solid rgb(255 255 255 / 10%);
    background: transparent;
    opacity: 0.45;
    border-radius: 0;
}

.frame-preview-vercel .frame-preview-accent {
    top: 18px;
    left: 18px;
    width: 18px;
    height: 18px;
    border-top: 1px solid var(--frame-preview-accent);
    border-left: 1px solid var(--frame-preview-accent);
    background: transparent;
    opacity: 0.55;
}

.frame-preview-vercel::after {
    position: absolute;
    right: 18px;
    bottom: 18px;
    width: 18px;
    height: 18px;
    border-right: 1px solid var(--frame-preview-accent);
    border-bottom: 1px solid var(--frame-preview-accent);
    content: '';
    opacity: 0.55;
}

.frame-preview-elevenlabs .frame-preview-accent {
    inset: 8px;
    border: 1px solid var(--frame-preview-accent);
    border-radius: 999px;
    background: transparent;
    opacity: 0.35;
}

.frame-preview-triggerdev .frame-preview-accent {
    inset: 9px;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 0;
    background: transparent;
    opacity: 1;
}

.frame-preview-supabase .frame-preview-accent {
    top: 11px;
    left: 11px;
    width: 28px;
    height: 1px;
    background: var(--frame-preview-accent);
    box-shadow:
        0 8px 0 rgb(62 207 142 / 55%),
        0 16px 0 rgb(62 207 142 / 35%);
    opacity: 0.9;
}
</style>
