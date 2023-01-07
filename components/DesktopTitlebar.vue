<template>
    <div
        :class="{ hidden: isFullscreen }"
        style="-webkit-app-region: drag; height: 28px"
        class="z-50 flex justify-between border-b select-none bg-ui-gray-600 border-ui-gray-800"
    >
        <div data-tauri-drag-region @dblclick="appWindow.maximize()" class="w-full h-full"></div>

         <WindowControls v-if="$config.platform.windows" />
    </div>
</template>

<script>
import { appWindow } from '@tauri-apps/api/window';
import { onMounted, ref } from "@nuxtjs/composition-api";

export default {
    setup() {
        const isFullscreen = ref(false);
        const previousIsFullscreen = ref(false);

        const updateFullscreen = async () => {
            previousIsFullscreen.value = isFullscreen.value;

            previousIsFullscreen.value === true
                ? (isFullscreen.value = false)
                : (isFullscreen.value = await appWindow.isFullscreen());
        };

        appWindow.onResized(_.debounce(updateFullscreen, 500));

        onMounted(updateFullscreen);

        return { appWindow, isFullscreen };
    },
};
</script>
