<script setup>
import { reactiveOmit } from '@vueuse/core';
import { Circle } from 'lucide-vue-next';
import { DropdownMenuItemIndicator, DropdownMenuRadioItem, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    value: { type: null, required: true },
    disabled: { type: Boolean, required: false },
    textValue: { type: String, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const emits = defineEmits(['select']);

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <DropdownMenuRadioItem
        v-bind="forwarded"
        :class="
            cn(
                'ui-menu-item relative flex cursor-default items-center gap-2 py-1 pr-2 pl-8 text-xs select-none [&>svg]:size-3.5 [&>svg]:shrink-0',
                props.class
            )
        "
    >
        <span class="absolute left-2 flex size-3.5 items-center justify-center">
            <DropdownMenuItemIndicator>
                <Circle class="size-2 fill-current" />
            </DropdownMenuItemIndicator>
        </span>
        <slot />
    </DropdownMenuRadioItem>
</template>
