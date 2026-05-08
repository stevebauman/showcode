<script setup>
import { reactiveOmit } from '@vueuse/core';
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    defaultValue: { type: Array, required: false },
    modelValue: { type: [Array, null], required: false },
    disabled: { type: Boolean, required: false },
    orientation: { type: String, required: false },
    dir: { type: String, required: false },
    inverted: { type: Boolean, required: false },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    minStepsBetweenThumbs: { type: Number, required: false },
    thumbAlignment: { type: String, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    class: { type: null, required: false },
});
const emits = defineEmits(['update:modelValue', 'valueCommit']);

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <SliderRoot
        :class="
            cn(
                'relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=vertical]:flex-col',
                props.class
            )
        "
        v-bind="forwarded"
    >
        <SliderTrack
            class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-zinc-100 data-[orientation=vertical]:w-1.5 dark:bg-zinc-800"
        >
            <SliderRange
                class="absolute h-full bg-zinc-900 data-[orientation=vertical]:w-full dark:bg-zinc-50"
            />
        </SliderTrack>
        <SliderThumb
            v-for="(_, key) in modelValue"
            :key="key"
            class="block h-3.5 w-3.5 rounded-full border-2 border-zinc-900 bg-white ring-offset-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
        />
    </SliderRoot>
</template>
