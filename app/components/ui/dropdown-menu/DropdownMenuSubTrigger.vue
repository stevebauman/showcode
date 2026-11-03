<script setup>
import { reactiveOmit } from '@vueuse/core';
import { ChevronRight } from 'lucide-vue-next';
import { DropdownMenuSubTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    disabled: { type: Boolean, required: false },
    textValue: { type: String, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <DropdownMenuSubTrigger
        v-bind="forwardedProps"
        :class="
            cn(
                'ui-menu-item relative flex cursor-default items-center gap-2 px-2 py-1 text-xs select-none [&>svg]:size-3.5 [&>svg]:shrink-0',
                props.class
            )
        "
    >
        <slot />
        <ChevronRight class="ml-auto" />
    </DropdownMenuSubTrigger>
</template>
