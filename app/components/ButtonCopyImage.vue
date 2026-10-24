<template>
    <Button
        :aria-label="copying ? 'Copying image' : 'Copy Image'"
        :aria-busy="copying"
        :disabled="copying"
        variant="ghost"
        class="relative overflow-hidden disabled:opacity-100"
        @click="$emit('click', $event)"
    >
        <Transition name="copy-progress">
            <span v-if="copying" aria-hidden="true" class="copy-progress" />
        </Transition>
        <span class="relative size-3.5 shrink-0">
            <Transition name="copy-icon">
                <CheckCircleIcon v-if="copied" class="absolute !size-3.5 text-green-500" />
                <ClipboardIcon v-else class="absolute !size-3.5" />
            </Transition>
        </span>
        <span class="relative hidden sm:inline" aria-live="polite">
            <span aria-hidden="true" class="invisible">Copy Image</span>
            <Transition name="copy-label">
                <span :key="copyLabel" class="absolute inset-0 whitespace-nowrap">
                    {{ copyLabel }}
                </span>
            </Transition>
        </span>
    </Button>
</template>

<script setup>
import { computed } from 'vue';
import { CheckCircleIcon, ClipboardIcon } from 'lucide-vue-next';

const props = defineProps({
    copying: { type: Boolean, default: false },
    copied: { type: Boolean, default: false },
});

defineEmits(['click']);

const copyLabel = computed(() =>
    props.copying ? 'Copying…' : props.copied ? 'Copied!' : 'Copy Image'
);
</script>

<style scoped>
.copy-progress {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, currentColor 5%, transparent);
    pointer-events: none;
}

.copy-progress::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 15%, currentColor 50%, transparent 85%);
    opacity: 0.15;
    animation: copy-shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.copy-progress-enter-active,
.copy-progress-leave-active {
    transition: opacity 300ms ease;
}

.copy-progress-enter-from,
.copy-progress-leave-to {
    opacity: 0;
}

.copy-icon-enter-active,
.copy-icon-leave-active,
.copy-label-enter-active,
.copy-label-leave-active {
    transition:
        opacity 150ms ease,
        transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.copy-icon-enter-from,
.copy-icon-leave-to {
    opacity: 0;
    transform: scale(0.75);
}

.copy-label-enter-from {
    opacity: 0;
    transform: translateY(3px);
}

.copy-label-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

@keyframes copy-shimmer {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .copy-progress::after {
        animation: none;
    }

    .copy-progress-enter-active,
    .copy-progress-leave-active,
    .copy-icon-enter-active,
    .copy-icon-leave-active,
    .copy-label-enter-active,
    .copy-label-leave-active {
        transition: none;
    }
}
</style>
