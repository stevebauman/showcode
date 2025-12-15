<template>
    <Button v-bind="$attrs" :active="locked">
        <LockIcon v-if="locked" class="w-4 h-4" />
        <UnlockIcon v-else class="w-4 h-4" />
    </Button>
</template>

<script setup>
import { Lock as LockIcon, Unlock as UnlockIcon } from 'lucide-vue-next';

defineProps({
    locked: Boolean,
});
</script>
