<template></template>

<script setup>
import useHotkeys from '@/composables/useHotkeys';

const props = defineProps({ shortcuts: Array });
const emit = defineEmits(['triggered']);

useHotkeys(props, { emit });
</script>
