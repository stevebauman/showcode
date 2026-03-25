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
                'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300',
                props.class
            )
        "
        v-bind="delegatedProps"
    >
        <slot />
    </TabsContent>
</template>
