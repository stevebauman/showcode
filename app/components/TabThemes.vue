<template>
    <ScrollArea orientation="horizontal" force-vertical-scroll class="w-full">
        <div class="grid grid-flow-col grid-rows-2 gap-4 p-4 auto-cols-max">
            <ButtonTheme
                v-for="availableTheme in themes"
                :code="code"
                :settings="settings"
                :languages="languages"
                :key="availableTheme"
                :theme="availableTheme"
                :background="background"
                :active="availableTheme === theme"
                :data-ref="`button-theme-${availableTheme}`"
               
                @click="$emit('select', availableTheme)"
            />
        </div>
    </ScrollArea>
</template>

<script setup>
import { onMounted } from 'vue';
import useScrollRefIntoView from '@/composables/useScrollRefIntoView';

const props = defineProps({
    code: { type: Array, required: true },
    theme: { type: String, default: true },
    themes: { type: Array, required: true },
    settings: { type: Object, required: true },
    background: { type: Object, required: true },
    languages: { type: Array, required: true },
});

defineEmits(['select']);

const { scrollRefIntoView } = useScrollRefIntoView();

onMounted(() => scrollRefIntoView(`button-theme-${props.theme}`));
</script>
