<template>
    <div
        @dblclick="$ipc.send('double-click-title-bar')"
        :class="{ hidden: isFullscreen }"
        class="border-b border-ui-gray-500"
        style="-webkit-app-region: drag; height: 28px; zoom: 1"
    ></div>
</template>

<script>
import { ref, useContext } from '@nuxtjs/composition-api';

export default {
    setup() {
        const { $ipc } = useContext();

        const isFullscreen = ref(false);

        $ipc.on('window-state-changed', (event, state) => {
            if (['fullscreen', 'normal'].includes(state)) {
                isFullscreen.value = state === 'fullscreen';
            }
        });

        return { isFullscreen };
    },
};
</script>
