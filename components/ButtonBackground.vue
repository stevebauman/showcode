<template>
    <DeferredComponent
        as="button"
        :threshold="0"
        rootMargin="200px 200px 200px 200px"
        @intersected="visible = $event"
        v-bind="hasBeenVisible ? attributes : {}"
        class="relative w-24 h-20 rounded-xl cursor-pointer focus:outline-none"
        :class="active ? 'ring-[3px] ring-violet-500 dark:ring-violet-400' : ''"
        style="will-change: auto; contain: layout; content-visibility: auto"
    >
        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute z-10 inline-flex items-center justify-center size-6 rounded-full shadow active:bg-zinc-400 dark:active:bg-zinc-500 bg-zinc-800 dark:bg-zinc-400 -top-2 -right-2"
        >
            <XIcon class="w-4 h-4 text-white" />
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
