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
                'ui-field rounded-control data-[placeholder]:text-ui-muted flex h-7 w-full items-center justify-between border px-2 py-1 text-start text-xs disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
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
