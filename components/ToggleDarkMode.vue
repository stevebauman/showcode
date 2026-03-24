<template>
    <button @click="toggle" aria-label="Toggle Color Scheme" title="Toggle Color Scheme">
        <slot :mode="colorMode" />
    </button>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import useApplicationStore from '@/composables/useApplicationStore';

const { colorMode } = storeToRefs(useApplicationStore());

const toggle = () => (colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark');
</script>
