<template>
    <Button v-bind="$attrs">
        <LockIcon v-if="locked" class="w-4 h-4" />
        <UnlockIcon v-else class="w-4 h-4" />
    </Button>
</template>

<script setup>
import { LockIcon, UnlockIcon } from 'lucide-vue-next';

defineProps({
    locked: Boolean,
});
</script>
