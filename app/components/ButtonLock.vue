<template>
    <Button v-bind="$attrs">
        <LockIcon v-if="locked" class="size-4" />
        <UnlockIcon v-else class="size-4" />
    </Button>
</template>

<script setup>
import { LockIcon, UnlockIcon } from 'lucide-vue-next';

defineProps({
    locked: Boolean,
});
</script>
