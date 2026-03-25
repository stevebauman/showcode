<template>
    <Button v-bind="$attrs">
        <LockIcon v-if="locked" class="h-4 w-4" />
        <UnlockIcon v-else class="h-4 w-4" />
    </Button>
</template>

<script setup>
import { LockIcon, UnlockIcon } from 'lucide-vue-next';

defineProps({
    locked: Boolean,
});
</script>
