<template>
    <DeferredComponent
        as="button"
        :threshold="0"
        rootMargin="200px 200px 200px 200px"
        @intersected="visible = $event"
        v-bind="hasBeenVisible ? attributes : {}"
        class="relative h-20 w-24 cursor-pointer rounded-xl focus:outline-none"
        :class="active ? 'ring-[3px] ring-violet-500 dark:ring-violet-400' : ''"
        style="will-change: auto; contain: layout; content-visibility: auto"
    >
        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute -right-2 -top-2 z-10 inline-flex size-6 items-center justify-center rounded-full bg-zinc-800 shadow active:bg-zinc-400 dark:bg-zinc-400 dark:active:bg-zinc-500"
        >
            <XIcon class="h-4 w-4 text-white" />
        </button>

        <slot />
    </DeferredComponent>
</template>

<script setup>
import { ref, watch } from 'vue';
import { XIcon } from 'lucide-vue-next';

defineProps({
    custom: Boolean,
    active: Boolean,
    attributes: Object,
});

defineEmits(['delete']);

const visible = ref(false);
const hasBeenVisible = ref(false);

watch(visible, (newVal) => {
    if (newVal) {
        hasBeenVisible.value = true;
    }
});
</script>
