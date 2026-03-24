<template>
    <button @click="toggle" aria-label="Toggle Color Scheme" title="Toggle Color Scheme">
        <slot :mode="colorMode" />
    </button>
</template>

<script setup>
import { colorMode } from '@/composables/useApplicationStore';

const toggle = () => (colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark');
</script>
