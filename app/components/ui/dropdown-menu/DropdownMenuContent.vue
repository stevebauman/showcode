<script setup>
import { reactiveOmit } from '@vueuse/core';
import { DropdownMenuContent, DropdownMenuPortal, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    forceMount: { type: Boolean, required: false },
    loop: { type: Boolean, required: false },
    side: { type: null, required: false },
    sideOffset: { type: Number, required: false, default: 4 },
    sideFlip: { type: Boolean, required: false },
    align: { type: null, required: false },
    alignOffset: { type: Number, required: false },
    alignFlip: { type: Boolean, required: false },
    avoidCollisions: { type: Boolean, required: false },
    collisionBoundary: { type: null, required: false },
    collisionPadding: { type: [Number, Object], required: false },
    arrowPadding: { type: Number, required: false },
    hideShiftedArrow: { type: Boolean, required: false },
    sticky: { type: String, required: false },
    hideWhenDetached: { type: Boolean, required: false },
    positionStrategy: { type: String, required: false },
    updatePositionStrategy: { type: String, required: false },
    disableUpdateOnLayoutShift: { type: Boolean, required: false },
    prioritizePosition: { type: Boolean, required: false },
    reference: { type: null, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});
const emits = defineEmits([
    'escapeKeyDown',
    'pointerDownOutside',
    'focusOutside',
    'interactOutside',
    'closeAutoFocus',
]);

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DropdownMenuPortal>
        <DropdownMenuContent
            v-bind="forwarded"
            :class="cn('ui-popup z-50 min-w-44 overflow-hidden p-1', props.class)"
        >
            <slot />
        </DropdownMenuContent>
    </DropdownMenuPortal>
</template>
