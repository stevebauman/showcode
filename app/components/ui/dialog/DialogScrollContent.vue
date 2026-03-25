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
            class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80"
        >
            <DialogContent
                :class="
                    cn(
                        'relative z-50 my-8 grid w-full max-w-lg gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-lg md:w-full',
                        props.class
                    )
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

                <DialogClose
                    class="absolute right-3 top-3 rounded-md p-0.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <X class="h-4 w-4" />
                    <span class="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </DialogOverlay>
    </DialogPortal>
</template>
