<template></template>

<script setup>
import useHotkeys from '@/composables/useHotkeys';

const props = defineProps({ shortcuts: Array });

const emit = defineEmits();

useHotkeys(props, { emit });
</script>
