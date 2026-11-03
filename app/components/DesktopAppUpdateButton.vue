<template>
    <div v-show="updateState && visible" ref="buttonContainer" class="relative mr-1 h-8 shrink-0">
        <button
            type="button"
            class="rounded-control flex h-8 items-center gap-1.5 bg-blue-500 px-3 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-wait disabled:bg-blue-500"
            :disabled="installing"
            @click="install"
        >
            <RefreshCwIcon class="size-3.5" :class="{ 'animate-spin': installing }" />
            Update
        </button>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { RefreshCwIcon } from 'lucide-vue-next';

const props = defineProps({
    viewport: { type: Object, default: null },
    tabsContainer: { type: Object, default: null },
});

const $ipc = useElectronIpc();

const buttonContainer = ref(null);
const updateState = ref(null);
const installingUpdate = ref(false);
const visible = ref(true);

const installing = computed(
    () => installingUpdate.value || updateState.value?.status === 'downloading'
);

const { width: viewportWidth } = useElementSize(() => props.viewport);
const { width: tabsWidth } = useElementSize(() => props.tabsContainer);
const { width: buttonWidth } = useElementSize(buttonContainer);

function updateStateChanged(event, state) {
    updateState.value = state;
}

async function install() {
    installingUpdate.value = true;

    try {
        await $ipc.invoke('install-update');
    } finally {
        installingUpdate.value = false;
    }
}

$ipc.addListener('update-state-changed', updateStateChanged);

onMounted(async () => {
    updateState.value = await $ipc.invoke('get-update-state');
});

onUnmounted(() => $ipc.removeListener('update-state-changed', updateStateChanged));

watch([viewportWidth, tabsWidth, updateState], () => {
    if (!viewportWidth.value || !tabsWidth.value) return;

    if (visible.value) {
        if (tabsWidth.value > viewportWidth.value) visible.value = false;
    } else if (tabsWidth.value + buttonWidth.value + 4 <= viewportWidth.value) {
        visible.value = true;
    }
});
</script>
