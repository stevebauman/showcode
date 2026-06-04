<template>
    <button
        v-bind="previewAttributes"
        class="relative h-20 w-24 cursor-pointer overflow-hidden rounded-xl focus:outline-hidden"
        :class="active ? 'ring-[3px] ring-violet-500 dark:ring-violet-400' : ''"
    >
        <img
            v-if="thumbnail"
            :src="thumbnail"
            alt=""
            loading="eager"
            decoding="async"
            draggable="false"
            class="absolute inset-0 size-full object-cover"
        />

        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute -top-2 -right-2 z-10 inline-flex size-6 items-center justify-center rounded-full bg-zinc-800 shadow-sm active:bg-zinc-400 dark:bg-zinc-400 dark:active:bg-zinc-500"
        >
            <XIcon class="size-4 text-white" />
        </button>

        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';
import { XIcon } from 'lucide-vue-next';

const props = defineProps({
    custom: Boolean,
    active: Boolean,
    attributes: Object,
    thumbnail: String,
});

defineEmits(['delete']);

const previewAttributes = computed(() => (props.thumbnail ? {} : props.attributes));
</script>
