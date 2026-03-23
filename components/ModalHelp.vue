<template>
    <Modal v-bind="$attrs" size="sm" class="space-y-4" header="Help Guide">
        <ContentRenderer v-if="content" :value="content" />
    </Modal>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const content = ref(null);

onMounted(async () => {
    content.value = await queryCollection('docs').path('/help').first();
});
</script>
