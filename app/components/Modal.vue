<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent
            :class="{
                'max-w-2xl': size === 'sm',
                'max-w-4xl': size === 'md',
                'max-w-6xl': size === 'lg',
            }"
        >
            <DialogHeader v-if="header">
                <DialogTitle>{{ header }}</DialogTitle>
            </DialogHeader>

            <div v-bind="$attrs">
                <ScrollArea class="max-h-[50rem]">
                    <slot />
                </ScrollArea>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

defineProps({
    modelValue: { type: [Boolean, Object], default: false },
    header: { type: String, default: null },
    size: { type: String, default: 'lg' },
});

defineEmits(['update:modelValue']);
</script>
