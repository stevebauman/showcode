<template>
    <div v-show="visible" ref="link" class="relative mr-1 h-8 w-8 shrink-0">
        <a
            :href="href"
            target="_blank"
            class="group absolute top-0 right-0 z-30 flex h-8 w-8 items-center overflow-hidden rounded-lg px-[9px] text-xs font-medium whitespace-nowrap text-zinc-500 transition-[width,color,background-color] duration-200 ease-out hover:w-36 hover:bg-zinc-200/50 hover:text-zinc-700 focus-visible:w-36 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
        >
            <MonitorDownIcon class="size-3.5 shrink-0" />
            <span
                class="ml-1.5 shrink-0 -translate-x-1 opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            >
                Get Desktop App
            </span>
        </a>
    </div>
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
