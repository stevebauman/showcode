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

.frame-preview-clerk::before,
.frame-preview-resend::before {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
        circle at 8px 8px,
        rgb(255 255 255 / 12%) 1px,
        transparent 1.5px
    );
    background-size: 16px 16px;
    content: '';
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
.frame-preview-openai .frame-preview-accent,
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

.frame-preview-laravel::before {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(90deg, rgb(255 45 32 / 12%) 1px, transparent 1px),
        linear-gradient(rgb(255 45 32 / 12%) 1px, transparent 1px);
    background-size: 18px 18px;
    content: '';
    -webkit-mask-image: radial-gradient(circle at 50% 45%, black, transparent 72%);
    mask-image: radial-gradient(circle at 50% 45%, black, transparent 72%);
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

.frame-preview-cloudflare .frame-preview-accent,
.frame-preview-supabase .frame-preview-accent,
.frame-preview-triggerdev .frame-preview-accent,
.frame-preview-vercel .frame-preview-accent,
.frame-preview-elevenlabs .frame-preview-accent {
    inset: 8px;
    border: 1px solid var(--frame-preview-accent);
    border-radius: 999px;
    background: transparent;
    opacity: 0.45;
}
</style>
