<script setup>
import { reactiveOmit } from '@vueuse/core';
import { ChevronsUpDown } from 'lucide-vue-next';
import { SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui';
import { cn, formControlFocusClasses } from '@/lib/utils';

const props = defineProps({
    disabled: { type: Boolean, required: false },
    reference: { type: null, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <SelectTrigger
        v-bind="forwardedProps"
        :class="
            cn(
                'rounded-control flex h-7 w-full items-center justify-between border border-zinc-200/80 bg-zinc-100/80 px-2 py-1 text-start text-xs transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-zinc-500 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/[0.07] dark:data-[placeholder]:text-zinc-400 [&>span]:truncate',
                formControlFocusClasses,
                props.class
            )
        "
    >
        <slot />
        <SelectIcon as-child>
            <ChevronsUpDown class="ml-2 size-3 shrink-0 opacity-50" />
        </SelectIcon>
    </SelectTrigger>
</template>
