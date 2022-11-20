<template>
    <VueFeather :type="type" />
</template>

<script setup>
import VueFeather from 'vue-feather';

defineProps({
    type: String  
})
</script>