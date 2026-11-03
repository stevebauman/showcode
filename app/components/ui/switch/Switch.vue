<script setup>
import { reactiveOmit } from '@vueuse/core';
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    id: { type: String, required: false },
    value: { type: String, required: false },
    trueValue: { type: null, required: false },
    falseValue: { type: null, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    class: { type: null, required: false },
});

const emits = defineEmits(['update:modelValue']);

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <SwitchRoot
        v-bind="forwarded"
        :class="
            cn(
                'ui-switch peer focus-visible:outline-ui-focus inline-flex shrink-0 cursor-default items-center rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                props.class
            )
        "
    >
        <SwitchThumb
            :class="
                cn(
                    'ui-switch-thumb pointer-events-none flex items-center justify-center rounded-full'
                )
            "
        >
            <slot name="thumb" />
        </SwitchThumb>
    </SwitchRoot>
</template>
