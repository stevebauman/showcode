<template>
    <DeferredComponent
        as="button"
        :threshold="0"
        rootMargin="200px 200px 200px 200px"
        @intersected="visible = $event"
        v-bind="hasBeenVisible ? attributes : {}"
        class="relative h-20 w-24 cursor-pointer rounded-xl focus:outline-hidden"
        :class="active ? 'ring-[3px] ring-violet-500 dark:ring-violet-400' : ''"
        style="will-change: auto; contain: layout; content-visibility: auto"
    >
        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute -top-2 -right-2 z-10 inline-flex size-6 items-center justify-center rounded-full bg-zinc-800 shadow-sm active:bg-zinc-400 dark:bg-zinc-400 dark:active:bg-zinc-500"
        >
            <XIcon class="h-4 w-4 text-white" />
        </button>

        <slot />
    </DeferredComponent>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { XIcon } from 'lucide-vue-next';

defineProps({
    custom: Boolean,
    active: Boolean,
    attributes: Object,
});

defineEmits(['delete']);

const visible = ref(false);
const hasBeenVisible = ref(false);

let cancelActivation = null;

watch(visible, (newVal) => {
    if (newVal && !hasBeenVisible.value) {
        cancelActivation = schedulePaint(() => {
            hasBeenVisible.value = true;
        });
    }
});

onBeforeUnmount(() => {
    if (cancelActivation) cancelActivation();
});
</script>

<script>
// Module-scoped rAF scheduler that throttles background activation
// across paint cycles to prevent paint-bound jank when many buttons scroll
// into view simultaneously. Paints up to PER_TICK backgrounds per
// rAF tick, yielding the rest to the next tick.
const PER_TICK = 2;
const queue = [];
let scheduled = false;

function flush() {
    scheduled = false;

    for (let i = 0; i < PER_TICK && queue.length > 0; i++) {
        const task = queue.shift();
        if (!task.cancelled) task.fn();
    }

    if (queue.length > 0) {
        scheduled = true;
        requestAnimationFrame(flush);
    }
}

function schedulePaint(fn) {
    const task = { fn, cancelled: false };
    queue.push(task);

    if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(flush);
    }

    return () => {
        task.cancelled = true;
    };
}
</script>
