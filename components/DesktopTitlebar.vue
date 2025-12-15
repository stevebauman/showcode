<template>
    <div
        :class="{ hidden: isFullscreen }"
        style="-webkit-app-region: drag; height: 28px"
        class="z-50 flex justify-between border-b bg-ui-gray-700 border-ui-gray-800"
    >
        <div @dblclick="$ipc.send('double-click-title-bar')" class="w-full h-full"></div>

        <WindowControls v-if="config.public.platform?.windows" />
    </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';

const { $ipc } = useNuxtApp();
const config = useRuntimeConfig();

const isFullscreen = ref(false);

function listener(event, state) {
    if (['fullscreen', 'normal'].includes(state)) {
        isFullscreen.value = state === 'fullscreen';
    }
}

$ipc.addListener('window-state-changed', listener);

onUnmounted(() => $ipc.removeListener('window-state-changed', listener));
</script>
