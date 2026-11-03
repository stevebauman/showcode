<script setup>
import { reactiveOmit } from '@vueuse/core';
import { TabsContent } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
    value: { type: [String, Number], required: true },
    forceMount: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <TabsContent
        :class="
            cn(
                'ui-tab-content focus-visible:outline-ui-focus mt-2 focus-visible:outline-2',
                props.class
            )
        "
        v-bind="delegatedProps"
    >
        <slot />
    </TabsContent>
</template>
