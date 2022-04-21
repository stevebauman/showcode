<template>
    <div
        @dblclick="$ipc.send('double-click-title-bar')"
        class="border-b border-ui-gray-500"
        style="-webkit-app-region: drag; height: 28px; zoom: 1"
    ></div>
</template>
