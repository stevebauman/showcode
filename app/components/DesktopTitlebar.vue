<template>
    <div
        :class="{
            hidden: isFullscreen && !$slots.default,
            'h-7': !$slots.default,
            'h-11 gap-1': $slots.default,
            'pl-[88px]': $slots.default && !isFullscreen,
        }"
        style="-webkit-app-region: drag"
        class="border-ui-line bg-ui-chrome z-50 flex shrink-0 items-center border-b"
    >
        <slot>
            <div @dblclick="$ipc.send('double-click-title-bar')" class="size-full"></div>
        </slot>

        <div
            v-if="$slots.default"
            data-titlebar-drag-region
            class="h-full min-w-12 flex-1"
            @dblclick="$ipc.send('double-click-title-bar')"
        />
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const { $ipc } = useNuxtApp();

const isFullscreen = ref(false);

function listener(event, state) {
    if (['fullscreen', 'normal'].includes(state)) {
        isFullscreen.value = state === 'fullscreen';
    }
}

$ipc.addListener('window-state-changed', listener);

onMounted(async () => listener(null, await $ipc.invoke('get-window-state')));

onUnmounted(() => $ipc.removeListener('window-state-changed', listener));
</script>
