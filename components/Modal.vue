<template>
    <Dialog :open="modelValue ?? false" @update:open="$emit('update:modelValue', $event)">
        <DialogContent
            :class="[
                'bg-ui-gray-700 border-ui-gray-800 shadow-xl rounded-xl p-0',
                {
                    'max-w-2xl': size === 'sm',
                    'max-w-4xl': size === 'md',
                    'max-w-6xl': size === 'lg',
                },
            ]"
        >
            <DialogHeader
                v-if="$slots.header"
                class="py-3 px-6 rounded-t text-lg border-b font-medium text-ui-gray-100 border-ui-gray-800"
            >
                <slot name="header" />
            </DialogHeader>

            <Scrollbar class="max-h-[50rem] px-6 pb-6">
                <slot />
            </Scrollbar>

            <DialogFooter v-if="$slots.footer" class="bg-ui-gray-100 p-3 rounded-b">
                <slot name="footer" />
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
} from '@/components/ui/dialog';

defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'lg',
    },
});

defineEmits(['update:modelValue']);
</script>
