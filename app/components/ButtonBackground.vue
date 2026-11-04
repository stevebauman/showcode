<template>
    <div class="group relative h-20 w-full">
        <button
            v-bind="{ ...previewAttributes, ...$attrs }"
            type="button"
            class="preview-card preview-swatch relative size-full overflow-hidden"
            :aria-pressed="active"
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

            <span v-if="active" class="preview-selection" aria-hidden="true">
                <CheckIcon class="size-3" />
            </span>
        </button>

        <button
            v-if="custom"
            type="button"
            aria-label="Delete custom background"
            @click="$emit('delete')"
            class="preview-action focus-visible:outline-ui-focus absolute right-1.5 bottom-1.5 z-10 inline-flex size-6 items-center justify-center rounded-full opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
            <XIcon class="size-3" />
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { CheckIcon, XIcon } from 'lucide-vue-next';

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
