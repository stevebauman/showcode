<template>
    <HoverCardRoot v-model:open="open" :open-delay="450" :close-delay="100">
        <HoverCardTrigger
            as="div"
            @pointerdown="dismiss"
            @contextmenu="dismiss"
            @pointerleave="suppressed = false"
        >
            <slot />
        </HoverCardTrigger>

        <HoverCardPortal>
            <HoverCardContent
                side="bottom"
                align="start"
                :side-offset="10"
                :collision-padding="12"
                hide-when-detached
                data-tab-preview
                class="tab-hover-preview z-40 w-72 max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-zinc-200/80 bg-white/95 p-1.5 text-zinc-900 shadow-xl shadow-zinc-950/15 backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-900/95 dark:text-zinc-100 dark:shadow-black/40"
            >
                <div
                    class="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-black/5 ring-inset dark:bg-zinc-950 dark:ring-white/5"
                >
                    <template v-if="image && !starting">
                        <div
                            aria-hidden="true"
                            class="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-xl"
                            :style="{ backgroundImage: `url(${image})` }"
                        />
                        <img
                            :src="image"
                            :alt="`${title} preview`"
                            class="relative size-full object-contain"
                            draggable="false"
                        />
                    </template>

                    <div v-else class="relative flex flex-col items-center gap-2 px-6 text-center">
                        <div
                            class="flex size-11 items-center justify-center rounded-xl bg-white text-violet-500 shadow-sm ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:text-violet-400 dark:ring-white/10"
                        >
                            <PlusIcon v-if="starting" class="size-5" />
                            <CodeIcon v-else class="size-5" />
                        </div>
                        <p class="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                            {{ starting ? 'A fresh start' : 'No preview yet' }}
                        </p>
                        <p class="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
                            {{
                                starting
                                    ? 'Start from scratch or choose a template.'
                                    : 'Open this project to render a preview.'
                            }}
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2.5 px-2 py-2.5">
                    <div
                        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 dark:bg-white/5 dark:text-zinc-500"
                    >
                        <PlusIcon v-if="starting" class="size-3.5" />
                        <CodeIcon v-else class="size-3.5" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-xs font-medium">{{ title }}</p>
                        <p
                            class="mt-0.5 flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500"
                        >
                            <span
                                v-if="modified && !starting"
                                class="size-1.5 rounded-full bg-amber-400"
                            />
                            {{
                                starting
                                    ? 'New project'
                                    : modified
                                      ? 'Unsaved changes'
                                      : 'Project preview'
                            }}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCardPortal>
    </HoverCardRoot>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { CodeIcon, PlusIcon } from 'lucide-vue-next';
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui';

const props = defineProps({
    name: String,
    image: String,
    starting: Boolean,
    modified: Boolean,
    disabled: Boolean,
});

const showing = ref(false);
const suppressed = ref(false);

const title = computed(() => props.name || (props.starting ? 'New Project' : 'Untitled Project'));

const open = computed({
    get: () => showing.value && !props.disabled && !suppressed.value,
    set: (value) => (showing.value = value && !props.disabled && !suppressed.value),
});

function dismiss() {
    showing.value = false;
    suppressed.value = true;
}

watch(
    () => props.disabled,
    () => (showing.value = false)
);
</script>

<style>
.tab-hover-preview {
    transform-origin: var(--reka-hover-card-content-transform-origin);
    animation: preview-in 160ms ease-out;
}

@keyframes preview-in {
    from {
        opacity: 0;
        transform: translateY(-4px) scale(0.97);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (prefers-reduced-motion: reduce) {
    .tab-hover-preview {
        animation: none;
    }
}
</style>
