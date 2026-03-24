<template>
    <Switch
        :model-value="isDark"
        aria-label="Toggle Color Scheme"
        @update:model-value="toggle"
    >
        <template #thumb>
            <SunIcon v-if="!isDark" class="w-2 h-2 text-amber-500" />
            <MoonIcon v-else class="w-2 h-2 text-indigo-400" />
        </template>
    </Switch>
</template>

<script setup>
import { computed } from 'vue';
import { SunIcon, MoonIcon } from 'lucide-vue-next';
import { colorMode } from '@/composables/useApplicationStore';

const isDark = computed(() => colorMode.value === 'dark');

const toggle = () => (colorMode.value = isDark.value ? 'light' : 'dark');
</script>