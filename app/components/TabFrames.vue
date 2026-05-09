<template>
    <ControlRow>
        <button
            v-for="frame in frames"
            :key="frame.id"
            type="button"
            class="flex w-28 flex-col items-center gap-2 rounded-xl p-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            :class="
                activeFrame === frame.id
                    ? 'bg-zinc-200/80 text-zinc-950 ring-[3px] ring-violet-500 dark:bg-zinc-700/80 dark:text-zinc-50 dark:ring-violet-400'
                    : ''
            "
            @click="$emit('select', frame.id)"
        >
            <span
                class="frame-preview relative h-16 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
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
                ></span>
            </span>

            <span class="max-w-full truncate">{{ frame.title }}</span>
        </button>
    </ControlRow>
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
    inset: 18px 12px 12px;
    z-index: 2;
    border: 1px solid rgb(255 255 255 / 16%);
    border-radius: 5px;
    box-shadow: 0 12px 22px rgb(0 0 0 / 24%);
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
.frame-preview-mintlify .frame-preview-accent {
    top: -16px;
    left: 16px;
    width: 64px;
    height: 56px;
    border-radius: 999px;
    filter: blur(14px);
    opacity: 0.7;
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
