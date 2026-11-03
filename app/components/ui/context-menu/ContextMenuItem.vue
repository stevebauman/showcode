<script setup>
import { reactiveOmit } from '@vueuse/core';
import { ContextMenuItem, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    disabled: { type: Boolean, required: false },
    textValue: { type: String, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
    inset: { type: Boolean, required: false },
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <ContextMenuItem
        v-bind="forwardedProps"
        :class="
            cn(
                'ui-menu-item relative flex cursor-default items-center gap-2 px-2 py-1 text-xs select-none [&>svg]:size-3.5 [&>svg]:shrink-0',
                inset && 'pl-8',
                props.class
            )
        "
    >
        <slot />
    </ContextMenuItem>
</template>
