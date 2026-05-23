<template>
    <a
        v-show="visible"
        ref="link"
        :href="href"
        target="_blank"
        class="mr-1 flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-200/50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
    >
        <MonitorDownIcon class="size-3.5" />
        Get Desktop App
    </a>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { MonitorDownIcon } from 'lucide-vue-next';

const props = defineProps({
    href: { type: String, required: true },
    viewport: { type: Object, default: null },
    tabsContainer: { type: Object, default: null },
});

const link = ref(null);
const visible = ref(true);

const { width: viewportWidth } = useElementSize(() => props.viewport);
const { width: tabsWidth } = useElementSize(() => props.tabsContainer);
const { width: linkWidth } = useElementSize(link);

watch([viewportWidth, tabsWidth], () => {
    if (!viewportWidth.value || !tabsWidth.value) return;

    if (visible.value) {
        if (tabsWidth.value > viewportWidth.value) visible.value = false;
    } else if (tabsWidth.value + linkWidth.value + 4 <= viewportWidth.value) {
        visible.value = true;
    }
});
</script>
