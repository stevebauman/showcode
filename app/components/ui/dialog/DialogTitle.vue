<script setup>
import { reactiveOmit } from '@vueuse/core';
import { DialogTitle, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <DialogTitle
        v-bind="forwardedProps"
        :class="cn('text-ui-text text-sm leading-snug font-semibold', props.class)"
    >
        <slot />
    </DialogTitle>
</template>
