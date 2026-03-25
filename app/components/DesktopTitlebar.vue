<template>
    <div
        :class="{ hidden: isFullscreen }"
        style="-webkit-app-region: drag; height: 28px"
        class="z-50 flex justify-between border-b bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
    >
        <div @dblclick="$ipc.send('double-click-title-bar')" class="w-full h-full"></div>

        <WindowControls v-if="$config.platform.windows" />
    </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';

const { $ipc } = useNuxtApp();

const isFullscreen = ref(false);

function listener(event, state) {
    if (['fullscreen', 'normal'].includes(state)) {
        isFullscreen.value = state === 'fullscreen';
    }
}

$ipc.addListener('window-state-changed', listener);

onUnmounted(() => $ipc.removeListener('window-state-changed', listener));
</script>
