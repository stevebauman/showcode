<script setup>
import { reactiveOmit } from '@vueuse/core';
import { Check } from 'lucide-vue-next';
import { SelectItem, SelectItemIndicator, SelectItemText, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    value: { type: null, required: true },
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
    <SelectItem
        v-bind="forwardedProps"
        :class="
            cn(
                'ui-menu-item relative flex w-full cursor-default items-center gap-2 py-1 pr-2 pl-6 text-xs select-none [&>svg]:size-3.5 [&>svg]:shrink-0',
                props.class
            )
        "
    >
        <span class="absolute left-2 flex size-3.5 items-center justify-center">
            <SelectItemIndicator>
                <Check class="size-4" />
            </SelectItemIndicator>
        </span>

        <SelectItemText>
            <slot />
        </SelectItemText>
    </SelectItem>
</template>
