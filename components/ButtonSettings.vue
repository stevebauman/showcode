<template>
    <Button v-bind="$attrs">
        <SettingsIcon class="w-4 h-4" />
    </Button>
</template>

<script setup>
import { Settings as SettingsIcon } from 'lucide-vue-next';
</script>
