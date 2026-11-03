<script setup>
import { reactiveOmit } from '@vueuse/core';
import { SelectContent, SelectPortal, SelectViewport, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';
import { SelectScrollDownButton, SelectScrollUpButton } from '.';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps({
    forceMount: { type: Boolean, required: false },
    position: { type: String, required: false, default: 'popper' },
    bodyLock: { type: Boolean, required: false },
    side: { type: null, required: false },
    sideOffset: { type: Number, required: false, default: 5 },
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
    disableOutsidePointerEvents: { type: Boolean, required: false },
    class: { type: null, required: false },
});
const emits = defineEmits(['closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside']);

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <SelectPortal>
        <SelectContent
            v-bind="{ ...forwarded, ...$attrs }"
            :class="
                cn(
                    'ui-popup relative z-50 max-h-[min(24rem,var(--reka-select-content-available-height))] min-w-32 overflow-hidden',

                    props.class
                )
            "
        >
            <SelectScrollUpButton />
            <SelectViewport
                :class="
                    cn(
                        'p-1',
                        position === 'popper' && 'w-full min-w-[var(--reka-select-trigger-width)]'
                    )
                "
            >
                <slot />
            </SelectViewport>
            <SelectScrollDownButton />
        </SelectContent>
    </SelectPortal>
</template>
