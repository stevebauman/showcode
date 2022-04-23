<template>
    <div
        :class="{ hidden: isFullscreen }"
        style="-webkit-app-region: drag; height: 28px"
        class="flex justify-between border-b border-ui-gray-500"
    >
        <div @dblclick="$ipc.send('double-click-title-bar')" class="w-full h-full"></div>

        <WindowControls v-if="$config.platform.windows" />
    </div>
</template>

<script>
import { onUnmounted, ref, useContext } from '@nuxtjs/composition-api';

export default {
    setup() {
        const { $ipc } = useContext();

        const isFullscreen = ref(false);

        const listener = (event, state) => {
            if (['fullscreen', 'normal'].includes(state)) {
                isFullscreen.value = state === 'fullscreen';
            }
        };

        $ipc.addListener('window-state-changed', listener);

        onUnmounted(() => $ipc.removeListener('window-state-changed', listener));

        return { isFullscreen };
    },
};
</script>
