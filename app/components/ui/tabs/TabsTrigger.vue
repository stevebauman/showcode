<script setup>
import { reactiveOmit } from '@vueuse/core';
import { TabsTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    value: { type: [String, Number], required: true },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <TabsTrigger
        v-bind="forwardedProps"
        :class="
            cn(
                'rounded-control text-ui-muted focus-visible:outline-ui-focus data-[state=active]:bg-ui-selected data-[state=active]:text-ui-text inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-100 focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50',
                props.class
            )
        "
    >
        <slot />
    </TabsTrigger>
</template>
