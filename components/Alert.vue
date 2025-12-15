<template>
    <Alert
        :class="variantClasses[variant] || variantClasses.default"
        class="relative flex items-center p-4 border-2 rounded-xl shadow-lg"
    >
        <AlertDescription class="flex-grow">
            <slot>{{ message }}</slot>
        </AlertDescription>
    </Alert>
</template>

<script setup>
import { Alert, AlertDescription } from '@/components/ui/alert';

defineProps({
    variant: String,
    message: String,
});

const variantClasses = {
    default: 'bg-blue-50 border-blue-500 text-blue-700',
    danger: 'bg-red-50 border-red-500 text-red-700',
    success: 'bg-green-50 border-green-500 text-green-700',
};
</script>
