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
                'relative flex w-full cursor-default select-none items-center rounded-sm py-1 pl-6 pr-2 text-xs outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50',
                props.class
            )
        "
    >
        <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectItemIndicator>
                <Check class="h-4 w-4" />
            </SelectItemIndicator>
        </span>

        <SelectItemText>
            <slot />
        </SelectItemText>
    </SelectItem>
</template>
