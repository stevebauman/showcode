<template>
    <div class="relative h-20 w-24">
        <button
            v-bind="{ ...previewAttributes, ...$attrs }"
            type="button"
            class="rounded-emphasis relative size-full cursor-pointer overflow-hidden focus:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500"
            :class="active ? 'ring-1 ring-violet-500 dark:ring-violet-400' : ''"
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

            <slot />
        </button>

        <button
            v-if="custom"
            type="button"
            aria-label="Delete custom background"
            @click="$emit('delete')"
            class="absolute top-1 right-1 z-10 inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-zinc-800 text-white shadow-sm hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-hidden active:bg-zinc-600"
        >
            <XIcon class="size-4 text-white" />
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { XIcon } from 'lucide-vue-next';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    custom: Boolean,
    active: Boolean,
    attributes: Object,
    thumbnail: String,
});

defineEmits(['delete']);

const previewAttributes = computed(() => (props.thumbnail ? {} : props.attributes));
</script>
