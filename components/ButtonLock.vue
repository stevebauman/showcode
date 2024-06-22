<template>
    <Button v-bind="$attrs" v-on="$listeners" :active="locked">
        <LockIcon v-if="locked" class="w-4 h-4" />
        <UnlockIcon v-else class="w-4 h-4" />
    </Button>
</template>

<script setup>
import { LockIcon, UnlockIcon } from 'vue-feather-icons';

defineProps({
    locked: Boolean,
});
</script>
