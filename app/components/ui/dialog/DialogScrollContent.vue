<script setup>
import { reactiveOmit } from '@vueuse/core';
import { X } from 'lucide-vue-next';
import {
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    useForwardPropsEmits,
} from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    forceMount: { type: Boolean, required: false },
    disableOutsidePointerEvents: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});
const emits = defineEmits([
    'escapeKeyDown',
    'pointerDownOutside',
    'focusOutside',
    'interactOutside',
    'openAutoFocus',
    'closeAutoFocus',
]);

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DialogPortal>
        <DialogOverlay
            class="ui-overlay fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4"
        >
            <DialogContent
                :class="
                    cn('ui-dialog relative z-50 my-4 grid w-full max-w-lg gap-5 p-6', props.class)
                "
                v-bind="forwarded"
                @pointer-down-outside="
                    (event) => {
                        const originalEvent = event.detail.originalEvent;
                        const target = originalEvent.target;
                        if (
                            originalEvent.offsetX > target.clientWidth ||
                            originalEvent.offsetY > target.clientHeight
                        ) {
                            event.preventDefault();
                        }
                    }
                "
            >
                <slot />

                <DialogClose class="ui-close absolute top-3 right-3">
                    <X class="size-4" />
                    <span class="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </DialogOverlay>
    </DialogPortal>
</template>
